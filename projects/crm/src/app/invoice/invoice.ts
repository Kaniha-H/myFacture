export type InvoiceDetail = {
  description: string;
  amount: number;
  quantity: number;
};

export type InvoiceDetails = InvoiceDetail[];

export type InvoiceStatus = 'PAID' | 'SENT' | 'CANCELED';

export type Invoice = {
  id?: number;
  created_at?: number;
  customer_name: string;
  total?: number;
  description: string;
  status: InvoiceStatus;
  details: InvoiceDetails;
};
