import { RouterModule } from '@angular/router';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { of, throwError } from 'rxjs';
import { Invoice } from '../invoice';
import { InvoiceService } from '../invoice.service';
import { InvoiceStatusComponent } from './invoice-status.component';
import { InvoicesListComponent } from './invoices-list.component';

describe('InvoicesListComponent', () => {
  let spectator: Spectator<InvoicesListComponent>;

  const createSpectator = createComponentFactory({
    component: InvoicesListComponent,
    declarations: [InvoiceStatusComponent],
    imports: [RouterModule.forRoot([])],
    mocks: [InvoiceService],
  });

  beforeEach(() => {
    spectator = createSpectator({
      detectChanges: false,
    });
    spectator
      .inject(InvoiceService)
      .findAll.and.returnValue(of(getFakeInvoices()));
  });

  it('should display an error message if request fails', () => {
    spectator
      .inject(InvoiceService)
      .findAll.and.returnValue(throwError(() => of(null)));

    spectator.detectChanges();

    expect(spectator.query('.alert.bg-danger')).toExist();
  });

  it('should display a list of invoices if request succeed', () => {
    spectator.detectChanges();

    expect(spectator.queryAll('tbody tr')).toHaveLength(2);
    expect(spectator.query('tbody tr')?.innerHTML).toContain('300,00&nbsp;€');
  });

  it('should delete an invoice if request succeed', () => {
    spectator.inject(InvoiceService).delete.and.returnValue(of(null));

    spectator.detectChanges();

    spectator.click('#delete-button-1');

    expect(spectator.query('#delete-button-1')).not.toExist();
  });

  it('should not delete an invoice if request fails', () => {
    spectator
      .inject(InvoiceService)
      .delete.and.returnValue(throwError(() => of(null)));

    spectator.detectChanges();

    spectator.click('#delete-button-1');

    expect(spectator.query('#delete-button-1')).toExist();
    expect(spectator.query('.alert.bg-danger')).toExist();
  });
});

const getFakeInvoices = () => {
  return [
    {
      id: 1,
      description: 'MOCK_DESCRIPTION',
      total: 300,
      status: 'PAID',
      created_at: Date.now(),
      customer_name: 'MOCK_CUSTOMER',
      details: [],
    },
    {
      id: 2,
      description: 'MOCK_DESCRIPTION',
      total: 500,
      status: 'CANCELED',
      created_at: Date.now(),
      customer_name: 'MOCK_CUSTOMER',
      details: [],
    },
  ] as Invoice[];
};
