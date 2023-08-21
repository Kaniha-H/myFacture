import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  Spectator,
  SpectatorHost,
  createComponentFactory,
  createHostFactory,
} from '@ngneat/spectator';
import { Invoice } from '../invoice';
import { InvoiceFormDetailsComponent } from './invoice-form-details.component';
import { InvoiceFormGeneralComponent } from './invoice-form-general.component';
import { InvoiceFormTotalsComponent } from './invoice-form-totals.component';
import { InvoiceFormType } from './invoice-form-type';
import { InvoiceFormComponent } from './invoice-form.component';

describe('InvoiceFormComponent', () => {
  let spectator: Spectator<InvoiceFormComponent>;
  let component: InvoiceFormComponent;
  let form: InvoiceFormType;

  const createSpectator = createComponentFactory({
    component: InvoiceFormComponent,
    imports: [ReactiveFormsModule],
    declarations: [
      InvoiceFormDetailsComponent,
      InvoiceFormGeneralComponent,
      InvoiceFormTotalsComponent,
    ],
  });

  beforeEach(() => {
    spectator = createSpectator();
    component = spectator.component;
    form = component.invoiceForm;
  });

  it('should validate customer_name', () => {
    const field = form.controls.customer_name;

    spectator.typeInElement('', '#customer_name');
    expect(field.hasError('required')).toBeTrue();

    spectator.typeInElement('Ka', '#customer_name');
    expect(field.hasError('minlength')).toBeTrue();

    spectator.typeInElement('Kaniha', '#customer_name');
    expect(field.valid).toBeTrue();
  });

  it('should validate description', () => {
    const field = form.controls.description;

    spectator.typeInElement('', '#description');
    expect(field.hasError('required')).toBeTrue();

    spectator.typeInElement('MOCK_DES', '#description');
    expect(field.hasError('minlength')).toBeTrue();

    spectator.typeInElement('MOCK_DESCRIPTION', '#description');
    expect(field.valid).toBeTrue();
  });

  it('should validate that at least one detail item is given', () => {
    expect(form.hasError('noDetails')).toBeTrue();

    component.onAddDetails();

    expect(form.hasError('noDetails')).toBeFalse();
  });

  it('should validate details', () => {
    component.onAddDetails();

    const detailItem = form.controls.details.at(0);

    /* Description */

    // can't be empty
    spectator.typeInElement('', '#description_0');
    expect(detailItem.controls.description.hasError('required')).toBeTrue();

    // must have more than 5 letters
    spectator.typeInElement('MOCK', '#description_0');
    expect(detailItem.controls.description.hasError('minlength')).toBeTrue();

    /* Amount */
    // can't be empty
    spectator.typeInElement('', '#amount_0');
    expect(detailItem.controls.amount.hasError('required')).toBeTrue();

    // can't have negatif number
    spectator.typeInElement('-2', '#amount_0');
    expect(detailItem.controls.amount.hasError('min')).toBeTrue();

    /* Quantity */
    // can't be empty
    spectator.typeInElement('', '#quantity_0');
    expect(detailItem.controls.quantity.hasError('required')).toBeTrue();

    // can't have negatif number
    spectator.typeInElement('-2', '#quantity_0');
    expect(detailItem.controls.quantity.hasError('min')).toBeTrue();
  });

  it('should add a detail item when we call addDetails()', () => {
    component.onAddDetails();
    spectator.detectChanges();
    expect(spectator.queryAll('.detail-row')).toHaveLength(1);

    component.onAddDetails();
    spectator.detectChanges();
    expect(spectator.queryAll('.detail-row')).toHaveLength(2);
  });

  it('should remove a detail item when we call onRemoveDetail()', () => {
    component.onAddDetails(); // item 0
    component.onAddDetails(); // item 1
    spectator.detectChanges();
    expect(spectator.queryAll('.detail-row')).toHaveLength(2);

    component.onRemoveDetails(0);
    spectator.detectChanges();
    expect(spectator.queryAll('.detail-row')).toHaveLength(1);

    component.onRemoveDetails(0);
    spectator.detectChanges();
    expect(spectator.queryAll('.detail-row')).toHaveLength(0);
  });

  it('should listen to details events', () => {
    spectator.click('#initial-add-button');

    expect(spectator.queryAll('.detail-row')).toHaveLength(1);

    spectator.click('#remove-button-0');

    expect(spectator.queryAll('.detail-row')).toHaveLength(0);
  });

  it('should calculate total', () => {
    component.details.push(
      new FormGroup({
        amount: new FormControl(200),
        quantity: new FormControl(3),
        description: new FormControl(''),
      })
    );
    component.details.push(
      new FormGroup({
        amount: new FormControl(300),
        quantity: new FormControl(3),
        description: new FormControl(''),
      })
    );

    expect(spectator.component.total).toBe(1500);
  });
});

@Component({
  template: `<app-invoice-form
    (invoice-submit)="onSubmit($event)"
  ></app-invoice-form>`,
})
class TestHostComponent {
  invoice: Invoice = {
    id: 42,
    description: 'MOCK_DESCRIPTION',
    customer_name: 'MOCK_CUSTOMER',
    status: 'PAID',
    details: [
      { description: 'MOCK_DETAIL_1', amount: 300, quantity: 3 },
      { description: 'MOCK_DETAIL_2', amount: 500, quantity: 3 },
    ],
  };

  onSubmit(invoice: Invoice) {}
}

describe('InvoiceFormComponent with Input', () => {
  let spectator: SpectatorHost<InvoiceFormComponent, TestHostComponent>;

  const createHost = createHostFactory({
    component: InvoiceFormComponent,
    host: TestHostComponent,
    template: `<app-invoice-form [invoice]="invoice"></app-invoice-form>`,
    declarations: [
      InvoiceFormDetailsComponent,
      InvoiceFormTotalsComponent,
      InvoiceFormGeneralComponent,
    ],
    imports: [ReactiveFormsModule],
  });

  it('should fill the form with @Input invoice', () => {
    spectator = createHost();

    expect(spectator.component.invoiceForm.value).toEqual({
      description: 'MOCK_DESCRIPTION',
      customer_name: 'MOCK_CUSTOMER',
      status: 'PAID',
      details: [
        { description: 'MOCK_DETAIL_1', amount: 300, quantity: 3 },
        { description: 'MOCK_DETAIL_2', amount: 500, quantity: 3 },
      ],
    });

    expect(spectator.queryAll('.detail-row')).toHaveLength(2);
  });
});

describe('InvoiceFormComponent with Output', () => {
  let spectator: SpectatorHost<InvoiceFormComponent, TestHostComponent>;
  let component: InvoiceFormComponent;
  let form: InvoiceFormType;
  let host: TestHostComponent;
  let submitSpy: jasmine.Spy;

  const createHost = createHostFactory({
    component: InvoiceFormComponent,
    host: TestHostComponent,
    template: `<app-invoice-form
      (invoice-submit)="onSubmit($event)"
    ></app-invoice-form>`,
    declarations: [
      InvoiceFormDetailsComponent,
      InvoiceFormTotalsComponent,
      InvoiceFormGeneralComponent,
    ],
    imports: [ReactiveFormsModule],
  });

  beforeEach(() => {
    spectator = createHost();
    component = spectator.component;
    host = spectator.hostComponent;
    form = component.invoiceForm;
    submitSpy = spyOn(spectator.hostComponent, 'onSubmit');
  });

  it('should emit an event on (invoice-submit) if form is valid and user clicks submit button', () => {
    spectator.click('#initial-add-button');

    form.setValue({
      description: 'MOCK_DESCRIPTION',
      customer_name: 'MOCK_CUSTOMER',
      status: 'PAID',
      details: [
        {
          amount: 300,
          quantity: 2,
          description: 'MOCK_DESCRIPTION',
        },
      ],
    });

    spectator.detectChanges();

    spectator.click('#submit');

    expect(submitSpy).toHaveBeenCalledWith(form.value as Invoice);
  });

  it('should not emit an event on (invoice-submit) if form is invalid and user clicks submit button', () => {
    spectator.click('#submit');

    expect(submitSpy).not.toHaveBeenCalled();
  });
});
