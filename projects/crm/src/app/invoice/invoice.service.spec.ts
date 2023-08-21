import {
  HttpMethod,
  SpectatorHttp,
  createHttpFactory,
} from '@ngneat/spectator';
import { environment } from '../../environments/environments';
import { Invoice } from './invoice';
import { InvoiceService } from './invoice.service';

describe('InvoiceService', () => {
  let spectator: SpectatorHttp<InvoiceService>;

  const createSpectator = createHttpFactory({
    service: InvoiceService,
  });

  it('should call /invoice in POST when we call create()', () => {
    spectator = createSpectator();

    const invoice: Invoice = {
      description: 'MOCK_DESCRIPTION',
      customer_name: 'MOCK_CUSTOMER',
      status: 'PAID',
      details: [
        {
          quantity: 3,
          amount: 300,
          description: 'MOCK_DETAIL_DESCRIPTION',
        },
      ],
    };

    spectator.service.create(invoice).subscribe();

    const req = spectator.expectOne(
      environment.apiUrl + '/invoice',
      HttpMethod.POST
    );

    expect(req.request.body).toEqual({
      description: 'MOCK_DESCRIPTION',
      customer_name: 'MOCK_CUSTOMER',
      status: 'PAID',
      details: [
        {
          quantity: 3,
          amount: 30000,
          description: 'MOCK_DETAIL_DESCRIPTION',
        },
      ],
    });
  });

  it('should call /invoice/{id} in DELETE when we call delete()', () => {
    spectator = createSpectator();

    spectator.service.delete(42).subscribe();

    const req = spectator.expectOne(
      environment.apiUrl + '/invoice/42',
      HttpMethod.DELETE
    );
  });

  it('should call /invoice/{id} in PUT when we call create()', () => {
    spectator = createSpectator();

    const invoice: Invoice = {
      id: 42,
      description: 'MOCK_DESCRIPTION',
      customer_name: 'MOCK_CUSTOMER',
      status: 'PAID',
      details: [
        {
          quantity: 3,
          amount: 300,
          description: 'MOCK_DETAIL_DESCRIPTION',
        },
      ],
    };

    spectator.service.update(invoice).subscribe();

    const req = spectator.expectOne(
      environment.apiUrl + '/invoice/42',
      HttpMethod.PUT
    );

    expect(req.request.body).toEqual({
      id: 42,
      description: 'MOCK_DESCRIPTION',
      customer_name: 'MOCK_CUSTOMER',
      status: 'PAID',
      details: [
        {
          quantity: 3,
          amount: 30000,
          description: 'MOCK_DETAIL_DESCRIPTION',
        },
      ],
    });
  });

  it('should call /invoices in GET when we call findAll()', (done: DoneFn) => {
    spectator = createSpectator();

    spectator.service.findAll().subscribe((invoices) => {
      const invoice = invoices[0];

      expect(invoice.total).toBe(300);
      done();
    });

    const req = spectator.expectOne(
      environment.apiUrl + '/invoices',
      HttpMethod.GET
    );

    req.flush([{ total: 30000 }]);
  });

  it('should call /invoice/{id} in GET when we call findOne()', (done: DoneFn) => {
    spectator = createSpectator();

    spectator.service.findOne(42).subscribe((invoice) => {
      const details1 = invoice.details[0];
      const details2 = invoice.details[1];

      expect(details1.amount).toBe(300);
      expect(details2.amount).toBe(40);
      done();
    });

    const req = spectator.expectOne(
      environment.apiUrl + '/invoice/42',
      HttpMethod.GET
    );

    req.flush({
      details: [{ amount: 30000 }, { amount: 4000 }],
    });
  });
});
