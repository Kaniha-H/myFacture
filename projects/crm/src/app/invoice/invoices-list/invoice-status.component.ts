import { Component, Input } from '@angular/core';
import { InvoiceStatus } from '../invoice';

@Component({
  selector: 'app-invoice-status',
  template: ` <span class="badge {{ badgeClass }}">{{ statusLabel }}</span> `,
  styles: [],
})
export class InvoiceStatusComponent {
  @Input()
  status: InvoiceStatus = 'SENT';

  get badgeClass() {
    return this.status === 'SENT'
      ? 'bg-info'
      : this.status === 'PAID'
      ? 'bg-success'
      : 'bg-danger';
  }

  get statusLabel() {
    return this.status === 'SENT'
      ? 'Envoyée'
      : this.status === 'PAID'
      ? 'Payée'
      : 'Annulée';
  }
}
