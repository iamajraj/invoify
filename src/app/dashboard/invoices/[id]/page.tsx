'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Download,
  Mail,
  FileText,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Phone,
  Building,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Invoice, InvoiceItem } from '@/types/invoice';

export default function InvoiceViewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (invoiceId && session) {
      fetchInvoice();
    }
  }, [invoiceId, session]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`);
      if (response.ok) {
        const data = await response.json();
        setInvoice(data);
      } else {
        toast.error('Invoice not found');
        router.push('/dashboard/invoices');
      }
    } catch (error) {
      toast.error('Something went wrong');
      router.push('/dashboard/invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice) {
      toast.error('Invoice data not available');
      return;
    }

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 25;
      let currentY = margin;

      // Set font
      pdf.setFont('helvetica');

      // Simple header - just the invoice title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('INVOICE', margin, currentY);
      currentY += 20;

      // Invoice details
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');

      // Left column - Invoice info
      pdf.text(`Invoice Number: ${invoice.invoiceNumber}`, margin, currentY);
      pdf.text(
        `Issue Date: ${new Date(invoice.issueDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`,
        margin,
        currentY + 8
      );

      // Right column - Due date and terms
      const rightColX = pageWidth - margin - 70;
      pdf.text(
        `Due Date: ${new Date(invoice.dueDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`,
        rightColX,
        currentY + 8
      );

      if (invoice.paymentTerms) {
        pdf.text(
          `Payment Terms: ${invoice.paymentTerms}`,
          margin,
          currentY + 16
        );
      }

      currentY += 35;

      // Title section
      if (invoice.title) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(invoice.title, margin, currentY);
        currentY += 12;
      }

      // Description section
      if (invoice.description) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const descriptionLines = pdf.splitTextToSize(
          invoice.description,
          pageWidth - 2 * margin
        );
        pdf.text(descriptionLines, margin, currentY);
        currentY += descriptionLines.length * 5 + 15;
      }

      // From (Sender) section - top left
      if (invoice.sender) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('FROM:', margin, currentY);
        currentY += 10;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        pdf.text(invoice.sender.name, margin, currentY);
        pdf.text(invoice.sender.email, margin, currentY + 7);

        if (invoice.sender.phone) {
          pdf.text(invoice.sender.phone, margin, currentY + 14);
        }
      }

      // Bill To section
      const billToX = invoice.sender ? pageWidth / 2 + 20 : margin;
      const billToStartY = invoice.sender ? currentY : currentY + 10;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('BILL TO:', billToX, billToStartY);
      const clientY = billToStartY + 10;

      // Add a subtle background for client info
      pdf.setFillColor(248, 250, 252);
      pdf.rect(
        billToX - 3,
        clientY - 5,
        pageWidth - billToX - margin + 3,
        25,
        'F'
      );

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text(invoice.client.name, billToX, clientY);
      pdf.text(invoice.client.email, billToX, clientY + 7);

      // Address information
      let addressLines = [];
      if (invoice.client.address) addressLines.push(invoice.client.address);
      if (invoice.client.city || invoice.client.state) {
        addressLines.push(
          [invoice.client.city, invoice.client.state].filter(Boolean).join(', ')
        );
      }
      if (invoice.client.zipCode) addressLines.push(invoice.client.zipCode);
      if (invoice.client.country) addressLines.push(invoice.client.country);

      addressLines.forEach((line, index) => {
        if (line) {
          pdf.text(line, billToX, clientY + 14 + index * 6);
        }
      });

      currentY = Math.max(
        clientY + 14 + addressLines.length * 6 + 15,
        currentY + 45
      );

      // Professional table styling
      const tableStartY = currentY;
      const colWidths = [85, 20, 30, 35]; // Description, Qty, Unit Price, Amount
      const colPositions = [
        margin,
        margin + colWidths[0],
        margin + colWidths[0] + colWidths[1],
        margin + colWidths[0] + colWidths[1] + colWidths[2],
      ];

      // Table header
      pdf.setFillColor(41, 128, 185); //blue header
      pdf.rect(margin, tableStartY, pageWidth - 2 * margin, 12, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('Description', colPositions[0] + 3, tableStartY + 8);
      pdf.text('Qty', colPositions[1] + 8, tableStartY + 8);
      pdf.text('Unit Price', colPositions[2] + 3, tableStartY + 8);
      pdf.text('Amount', colPositions[3] + 10, tableStartY + 8);

      // Table rows
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      let rowY = tableStartY + 18;

      invoice.items.forEach((item, index) => {
        // checking if we need a new page
        if (rowY > pageHeight - 80) {
          pdf.addPage();
          rowY = margin + 18;

          // repeat header on new page
          pdf.setFillColor(41, 128, 185);
          pdf.rect(margin, margin, pageWidth - 2 * margin, 12, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(10);
          pdf.text('Description', colPositions[0] + 3, margin + 8);
          pdf.text('Qty', colPositions[1] + 8, margin + 8);
          pdf.text('Unit Price', colPositions[2] + 3, margin + 8);
          pdf.text('Amount', colPositions[3] + 10, margin + 8);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
        }

        // alternate row colors
        if (index % 2 === 0) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(margin, rowY - 5, pageWidth - 2 * margin, 10, 'F');
        }

        // wrapping, long descriptions
        const description =
          item.description.length > 40
            ? item.description.substring(0, 37) + '...'
            : item.description;

        pdf.text(description, colPositions[0] + 3, rowY);
        pdf.text(item.quantity.toString(), colPositions[1] + 8, rowY, {
          align: 'center',
        });
        pdf.text(`$${item.unitPrice.toFixed(2)}`, colPositions[2] + 3, rowY);
        pdf.text(`$${item.amount.toFixed(2)}`, colPositions[3] + 15, rowY, {
          align: 'right',
        });

        rowY += 12;
      });

      currentY = rowY + 15;

      // totals section
      const totalsWidth = 80;
      const totalsX = pageWidth - margin - totalsWidth;

      // Totals background
      pdf.setFillColor(248, 250, 252);
      pdf.rect(totalsX - 5, currentY - 5, totalsWidth + 10, 40, 'F');

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      let totalsY = currentY;

      pdf.text(`Subtotal:`, totalsX, totalsY);
      pdf.text(
        `$${invoice.subtotal.toFixed(2)}`,
        totalsX + totalsWidth - 10,
        totalsY,
        { align: 'right' }
      );
      totalsY += 8;

      if (invoice.taxRate > 0) {
        pdf.text(`Tax (${invoice.taxRate}%):`, totalsX, totalsY);
        pdf.text(
          `$${invoice.taxAmount.toFixed(2)}`,
          totalsX + totalsWidth - 10,
          totalsY,
          { align: 'right' }
        );
        totalsY += 8;
      }

      if (invoice.discount > 0) {
        pdf.text(`Discount:`, totalsX, totalsY);
        pdf.text(
          `-$${invoice.discount.toFixed(2)}`,
          totalsX + totalsWidth - 10,
          totalsY,
          { align: 'right' }
        );
        totalsY += 8;
      }

      // Total line with emphasis
      pdf.setDrawColor(41, 128, 185);
      pdf.setLineWidth(0.5);
      pdf.line(totalsX, totalsY + 2, totalsX + totalsWidth, totalsY + 2);
      totalsY += 10;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(41, 128, 185);
      pdf.text(`TOTAL:`, totalsX, totalsY);
      pdf.text(
        `$${invoice.total.toFixed(2)}`,
        totalsX + totalsWidth - 10,
        totalsY,
        { align: 'right' }
      );

      currentY = totalsY + 25;

      // Notes section
      if (invoice.notes) {
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text('Notes:', margin, currentY);
        currentY += 8;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        const noteLines = pdf.splitTextToSize(
          invoice.notes,
          pageWidth - 2 * margin
        );
        pdf.text(noteLines, margin, currentY);
        currentY += noteLines.length * 4 + 10;
      }

      // Professional footer
      const footerY = pageHeight - 25;
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.3);
      pdf.line(margin, footerY, pageWidth - margin, footerY);

      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Thank you for your business!', margin, footerY + 8);
      pdf.text(
        'Generated by Invoify - Professional Invoice Management',
        pageWidth - margin - 120,
        footerY + 8
      );

      // Save the PDF
      pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);
      toast.success('Professional PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleSendEmail = () => {
    toast.info('Email functionality coming soon!');
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (response.ok) {
        const updatedInvoice = await response.json();
        setInvoice(updatedInvoice);
        toast.success(`Invoice marked as ${newStatus.toLowerCase()}`);
      } else {
        toast.error('Failed to update invoice status');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || !invoice) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/invoices">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Invoices
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {invoice.invoiceNumber}
              </h1>
              {invoice.title && (
                <p className="text-gray-600 mt-1">{invoice.title}</p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Status:</span>
                <Select
                  value={invoice.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Draft
                      </div>
                    </SelectItem>
                    <SelectItem value="SENT">
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        Sent
                      </div>
                    </SelectItem>
                    <SelectItem value="PAID">
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Paid
                      </div>
                    </SelectItem>
                    <SelectItem value="OVERDUE">
                      <div className="flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Overdue
                      </div>
                    </SelectItem>
                    <SelectItem value="CANCELLED">
                      <div className="flex items-center">
                        <X className="mr-2 h-4 w-4" />
                        Cancelled
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button onClick={handleSendEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Info */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Invoice Number</p>
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Issue Date</p>
                      <p className="font-medium">
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Due Date</p>
                      <p className="font-medium">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Payment Terms</p>
                      <p className="font-medium">
                        {invoice.paymentTerms || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                {invoice.description && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Description</p>
                    <p className="text-gray-900">{invoice.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <CardTitle>Line Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.description}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.unitPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Totals */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  {invoice.taxRate > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Tax ({invoice.taxRate}%):</span>
                      <span>${invoice.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Discount:</span>
                      <span>-${invoice.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {invoice.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{invoice.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {/* Sender Information */}
            {invoice.sender && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>From</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">{invoice.sender.name}</p>
                        <p className="text-sm text-gray-600">
                          {invoice.sender.email}
                        </p>
                      </div>
                    </div>

                    {invoice.sender.phone && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <p className="text-sm">{invoice.sender.phone}</p>
                      </div>
                    )}

                    {invoice.sender.website && (
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <a
                          href={invoice.sender.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {invoice.sender.website}
                        </a>
                      </div>
                    )}

                    {(invoice.sender.address ||
                      invoice.sender.city ||
                      invoice.sender.state) && (
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div className="text-sm">
                          {invoice.sender.address && (
                            <p>{invoice.sender.address}</p>
                          )}
                          {(invoice.sender.city || invoice.sender.state) && (
                            <p>
                              {[invoice.sender.city, invoice.sender.state]
                                .filter(Boolean)
                                .join(', ')}
                              {invoice.sender.zipCode &&
                                ` ${invoice.sender.zipCode}`}
                            </p>
                          )}
                          {invoice.sender.country && (
                            <p>{invoice.sender.country}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {invoice.sender.taxId && (
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Tax ID</p>
                          <p className="text-sm">{invoice.sender.taxId}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Client Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bill To</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{invoice.client.name}</p>
                      <p className="text-sm text-gray-600">
                        {invoice.client.email}
                      </p>
                    </div>
                  </div>

                  {invoice.client.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <p className="text-sm">{invoice.client.phone}</p>
                    </div>
                  )}

                  {(invoice.client.address ||
                    invoice.client.city ||
                    invoice.client.state) && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div className="text-sm">
                        {invoice.client.address && (
                          <p>{invoice.client.address}</p>
                        )}
                        {(invoice.client.city || invoice.client.state) && (
                          <p>
                            {[invoice.client.city, invoice.client.state]
                              .filter(Boolean)
                              .join(', ')}
                            {invoice.client.zipCode &&
                              ` ${invoice.client.zipCode}`}
                          </p>
                        )}
                        {invoice.client.country && (
                          <p>{invoice.client.country}</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
