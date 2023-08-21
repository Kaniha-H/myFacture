import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { SpectatorHost, createHostFactory } from '@ngneat/spectator';
import { InvoiceFormTotalsComponent } from './invoice-form-totals.component';

registerLocaleData(localeFr);

describe('InvoiceFormTotal', () => {
  let spectator: SpectatorHost<InvoiceFormTotalsComponent>;

  const createSpectator = createHostFactory({
    component: InvoiceFormTotalsComponent,
  });

  it('should show total, total TVA and total TTC', () => {
    spectator = createSpectator(
      `<app-invoice-form-totals [total]="100"></app-invoice-form-totals>`
    );

    expect(spectator.query('#total_ht')?.innerHTML).toContain('100,00&nbsp;€');
    expect(spectator.query('#total_tva')?.innerHTML).toContain('20,00&nbsp;€');
    expect(spectator.query('#total_ttc')?.innerHTML).toContain('120,00&nbsp;€');
  });
});
