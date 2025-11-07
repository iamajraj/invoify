export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  title?: string;
  description?: string;
  status: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  notes?: string;
  paymentTerms?: string;
  clientId: string;
  senderId: string;
  createdAt?: string;
  updatedAt?: string;
  client: Client;
  sender: Company;
  items: InvoiceItem[];
}

export interface InvoiceFormData {
  invoiceNumber: string;
  title: string;
  description: string;
  clientId: string;
  senderId: string;
  issueDate: string;
  dueDate: string;
  taxRate: number;
  discount: number;
  notes: string;
  paymentTerms: string;
}

export interface CreateInvoiceData {
  invoiceNumber: string;
  title?: string;
  description?: string;
  clientId: string;
  senderId: string;
  issueDate: string;
  dueDate: string;
  taxRate?: number;
  discount?: number;
  notes?: string;
  paymentTerms?: string;
  items: Omit<InvoiceItem, 'id' | 'createdAt' | 'updatedAt'>[];
}
