import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { InvoiceStatusComponent } from './invoice-status.component';

describe('InvoiceStatusComponent', () => {
  let spectator: Spectator<InvoiceStatusComponent>;

  const createSpectator = createComponentFactory({
    component: InvoiceStatusComponent,
  });

  it('should display and translate invoice status correctly', () => {
    spectator = createSpectator();

    spectator.setInput('status', 'PAID');
    expect(spectator.query('span')).toHaveClass('bg-success');
    expect(spectator.query('span')).toHaveText('Payée');

    spectator.setInput('status', 'SENT');
    expect(spectator.query('span')).toHaveClass('bg-info');
    expect(spectator.query('span')).toHaveText('Envoyée');

    spectator.setInput('status', 'CANCELED');
    expect(spectator.query('span')).toHaveClass('bg-danger');
    expect(spectator.query('span')).toHaveText('Annulée');
  });
});
