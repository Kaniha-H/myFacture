import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SpectatorHost, createHostFactory } from '@ngneat/spectator';
import { InvoiceFormGeneralComponent } from './invoice-form-general.component';

@Component({
  template: ``,
})
class TestHostComponent {
  form = new FormGroup({
    customer_name: new FormControl(),
    description: new FormControl(),
    status: new FormControl(),
  });
}

describe('InvoiceFormGeneralComponent', () => {
  let spectator: SpectatorHost<InvoiceFormGeneralComponent, TestHostComponent>;

  const createSpectator = createHostFactory({
    component: InvoiceFormGeneralComponent,
    host: TestHostComponent,
    imports: [ReactiveFormsModule],
  });

  it('should take into account inputs modifications', () => {
    spectator = createSpectator(`<app-invoice-form-general
    [parent]="form"
  ></app-invoice-form-general>`);

    spectator.typeInElement('MOCK_DESCRIPTION', '#description');
    spectator.typeInElement('MOCK_CUSTOMER', '#customer_name');
    spectator.selectOption(spectator.query('#status')!, 'PAID');

    expect(spectator.hostComponent.form.value).toEqual({
      description: 'MOCK_DESCRIPTION',
      customer_name: 'MOCK_CUSTOMER',
      status: 'PAID',
    });
  });
});
