import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environments';
import { Invoice } from './invoice';

const API_URL = environment.apiUrl;

@Injectable()
export class InvoiceService {
  constructor(private http: HttpClient) {}

  create(invoiceData: Invoice) {
    const finalInvoice: Invoice = this.mapAppInvoiceToAppInvoice(invoiceData);
    return this.http.post<Invoice>(API_URL + '/invoice', finalInvoice);
  }

  update(invoiceData: Invoice) {
    const finalInvoice: Invoice = this.mapAppInvoiceToAppInvoice(invoiceData);
    return this.http.put<Invoice>(
      API_URL + '/invoice/' + invoiceData.id,
      finalInvoice
    );
  }

  delete(id: number) {
    return this.http.delete(API_URL + '/invoice/' + id);
  }

  findAll() {
    return this.http.get<Invoice[]>(API_URL + '/invoices').pipe(
      map((invoices) => {
        return invoices.map((invoice) => {
          return { ...invoice, total: invoice.total! / 100 };
        });
      })
    );
  }

  findOne(id: number) {
    return this.http
      .get<Invoice>(API_URL + '/invoice/' + id)
      .pipe(map((invoice) => this.mapApiInvoiceToAppInvoice(invoice)));
  }

  mapApiInvoiceToAppInvoice(invoice: Invoice) {
    return {
      ...invoice,
      details: invoice.details.map((item) => {
        return { ...item, amount: item.amount / 100 };
      }),
    };
  }

  mapAppInvoiceToAppInvoice(invoice: Invoice) {
    return {
      ...invoice,
      details: invoice.details.map((item) => {
        return { ...item, amount: item.amount * 100 };
      }),
    };
  }
}
