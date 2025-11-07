'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Calculator,
  Building,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Client, Company, InvoiceItem, InvoiceFormData } from '@/types/invoice';

export default function NewInvoicePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, amount: 0 },
  ]);
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: '',
    title: '',
    description: '',
    clientId: '',
    senderId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0], // 30 days from now
    taxRate: 0,
    discount: 0,
    notes: '',
    paymentTerms: 'Net 30',
  });

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * formData.taxRate) / 100;
  const total = subtotal + taxAmount - formData.discount;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    fetchClients();
    fetchCompanies();
    generateInvoiceNumber();
  }, [session]);

  useEffect(() => {
    // Set default sender to the first company if available and not already set
    if (companies.length > 0 && !formData.senderId) {
      setFormData((prev) => ({ ...prev, senderId: companies[0].id }));
    }
  }, [companies, formData.senderId]);

  useEffect(() => {
    // Update amounts when items change
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        amount: item.quantity * item.unitPrice,
      }))
    );
  }, [items.map((item) => `${item.quantity}-${item.unitPrice}`).join(',')]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      toast.error('Failed to fetch clients');
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      }
    } catch (error) {
      toast.error('Failed to fetch companies');
    }
  };

  const generateInvoiceNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    setFormData((prev) => ({
      ...prev,
      invoiceNumber: `INV-${year}${month}-${random}`,
    }));
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
              amount:
                field === 'quantity' || field === 'unitPrice'
                  ? field === 'quantity'
                    ? Number(value) * item.unitPrice
                    : item.quantity * Number(value)
                  : item.amount,
            }
          : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !formData.invoiceNumber ||
      !formData.clientId ||
      !formData.senderId ||
      items.some(
        (item) => !item.description || item.quantity <= 0 || item.unitPrice <= 0
      )
    ) {
      toast.error(
        'Please fill in all required fields including sender company and ensure all items have valid quantities and prices'
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: items.map(({ id, ...item }) => item), // Remove id field
        }),
      });

      if (response.ok) {
        toast.success('Invoice created successfully');
        router.push('/dashboard/invoices');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to create invoice');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/invoices">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Invoices
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Invoice
          </h1>
          <p className="text-gray-600 mt-1">
            Generate a professional invoice for your client
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>
                Basic information about this invoice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={(e) =>
                      handleInputChange('invoiceNumber', e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client *</Label>
                  <Select
                    value={formData.clientId}
                    onValueChange={(value) =>
                      handleInputChange('clientId', value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} - {client.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderId">
                    From Company *
                  </Label>
                  <Select
                    value={formData.senderId}
                    onValueChange={(value) =>
                      handleInputChange('senderId', value)
                    }
                    required
                  >
                    <SelectTrigger className="w-full border-2 hover:border-blue-300 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="Select your company" />
                    </SelectTrigger>
                    <SelectContent className="max-w-md">
                      {companies.map((company) => (
                        <SelectItem
                          key={company.id}
                          value={company.id}
                          className="py-3"
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {companies.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2">
                      <p className="text-sm text-blue-800">
                        <Building className="inline h-4 w-4 mr-1" />
                        No companies set up yet.
                      </p>
                      <Link href="/dashboard/companies/new" className="text-blue-600 hover:underline text-sm font-medium">
                        Add your first company →
                      </Link>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      This information will appear as the sender on your invoice PDF
                    </p>
                  )}
                </div>
                </div>

              <div className="space-y-2">
                <Label htmlFor="title">Invoice Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Web Development Services"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder="Brief description of the work or services provided"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date *</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) =>
                      handleInputChange('issueDate', e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      handleInputChange('dueDate', e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select
                    value={formData.paymentTerms}
                    onValueChange={(value) =>
                      handleInputChange('paymentTerms', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 45">Net 45</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                      <SelectItem value="Due on Receipt">
                        Due on Receipt
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Line Items</CardTitle>
                  <CardDescription>
                    Add the products or services for this invoice
                  </CardDescription>
                </div>
                <Button type="button" onClick={addItem} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-24">Qty</TableHead>
                    <TableHead className="w-32">Unit Price</TableHead>
                    <TableHead className="w-32">Amount</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, 'description', e.target.value)
                          }
                          placeholder="Item description"
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              'quantity',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              'unitPrice',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          required
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        ${item.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Totals and Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Calculations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.taxRate}
                      onChange={(e) =>
                        handleInputChange(
                          'taxRate',
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount ($)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.discount}
                      onChange={(e) =>
                        handleInputChange(
                          'discount',
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax ({formData.taxRate}%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  {formData.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Discount:</span>
                      <span>-${formData.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Additional notes or payment instructions"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Link href="/dashboard/invoices">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Invoice
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
