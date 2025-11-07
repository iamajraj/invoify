import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const clientId = searchParams.get("clientId")

    const where: any = {
      userId: session.user.id
    }

    if (status) {
      where.status = status
    }

    if (clientId) {
      where.clientId = clientId
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        client: true,
        items: true,
        _count: {
          select: { items: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
      paymentTerms
    } = await request.json()

    if (!invoiceNumber || !clientId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Invoice number, client, and items are required" },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0)
    const taxAmount = (subtotal * (taxRate || 0)) / 100
    const total = subtotal + taxAmount - (discount || 0)

    // Create invoice with items
    const invoice = await prisma.invoice.create({
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
        userId: session.user.id,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.quantity * item.unitPrice
          }))
        }
      },
      include: {
        client: true,
        items: true
      }
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
