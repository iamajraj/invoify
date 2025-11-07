import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: invoiceId } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: session.user.id,
      },
      include: {
        client: true,
        sender: true,
        items: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: invoiceId } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestBody = await request.json();
    const {
      invoiceNumber,
      title,
      description,
      clientId,
      senderId,
      issueDate,
      dueDate,
      items,
      taxRate,
      discount,
      notes,
      paymentTerms,
      status,
    } = requestBody;

    // Check if this is a status-only update
    const isStatusOnlyUpdate = Object.keys(requestBody).length === 1 && status;

    let invoice;

    if (isStatusOnlyUpdate) {
      // Simple status update
      invoice = await prisma.invoice.update({
        where: {
          id: invoiceId,
          userId: session.user.id,
        },
        data: {
          status,
        },
      });
    } else {
      // Full invoice update
      if (!invoiceNumber || !clientId || !items || items.length === 0) {
        return NextResponse.json(
          {
            error:
              'Invoice number, client, and items are required for full updates',
          },
          { status: 400 }
        );
      }

      // Calculate totals
      const subtotal = items.reduce(
        (sum: number, item: any) => sum + item.quantity * item.unitPrice,
        0
      );
      const taxAmount = (subtotal * (taxRate || 0)) / 100;
      const total = subtotal + taxAmount - (discount || 0);

      // update in a transaction
      invoice = await prisma.$transaction(async (tx) => {
        // deltee existing items
        await tx.invoiceItem.deleteMany({
          where: { invoiceId: invoiceId },
        });

        return await tx.invoice.update({
          where: {
            id: invoiceId,
            userId: session.user.id,
          },
          data: {
            invoiceNumber,
            title,
            description,
            clientId,
            senderId,
            issueDate: new Date(issueDate),
            dueDate: new Date(dueDate),
            subtotal,
            taxRate: taxRate || 0,
            taxAmount,
            discount: discount || 0,
            total,
            notes,
            paymentTerms,
            status: status || 'DRAFT',
            items: {
              create: items.map((item: any) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                amount: item.quantity * item.unitPrice,
              })),
            },
          },
        });
      });
    }

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // For full updates, invoice already includes relations
    // For status-only updates, fetch with relations
    let responseData = invoice;
    if (isStatusOnlyUpdate) {
      const updatedInvoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          client: true,
          sender: true,
          items: true,
        },
      });
      if (!updatedInvoice) {
        return NextResponse.json(
          { error: 'Invoice not found' },
          { status: 404 }
        );
      }
      responseData = updatedInvoice;
    }
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: invoiceId } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoice = await prisma.invoice.deleteMany({
      where: {
        id: invoiceId,
        userId: session.user.id,
      },
    });

    if (invoice.count === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
