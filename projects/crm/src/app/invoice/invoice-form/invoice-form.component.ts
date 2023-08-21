import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Invoice } from '../invoice';
import { InvoiceFormType } from './invoice-form-type';

@Component({
  selector: 'app-invoice-form',
  template: ` <form [formGroup]="invoiceForm" (submit)="onSubmit()">
    <app-invoice-form-general [parent]="invoiceForm"></app-invoice-form-general>

    <hr />

    <h3>Détails de la facture</h3>

    <app-invoice-form-details
      (details-added)="onAddDetails()"
      (details-removed)="onRemoveDetails($event)"
      [parent]="invoiceForm"
    ></app-invoice-form-details>

    <hr />

    <app-invoice-form-totals [total]="total"></app-invoice-form-totals>

    <button class="mt-3 w-sm-auto btn btn-success" id="submit">
      Enregistrer
    </button>
  </form>`,
  styles: [],
})
export class InvoiceFormComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

  @Input()
  invoice?: Invoice;

  @Output('invoice-submit')
  invoiceSubmitEvent = new EventEmitter<Invoice>();

  ngOnInit(): void {
    if (!this.invoice) {
      return;
    }

    this.invoice.details.forEach((item) => {
      this.onAddDetails();
    });

    this.invoiceForm.patchValue(this.invoice);
  }

  get details() {
    return this.invoiceForm.controls.details;
  }

  get total() {
    return this.details.value.reduce((itemTotal: number, item) => {
      return itemTotal + item.amount * item.quantity;
    }, 0);
  }

  invoiceForm: InvoiceFormType = this.fb.group(
    {
      customer_name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['SENT'],
      details: this.fb.array<
        FormGroup<{
          description: FormControl;
          amount: FormControl;
          quantity: FormControl;
        }>
      >([]),
    },
    {
      validators: detailsExistsValidator,
    }
  );

  onAddDetails() {
    this.details.push(
      this.fb.group({
        description: ['', [Validators.required, Validators.minLength(10)]],
        amount: ['', [Validators.required, Validators.min(0)]],
        quantity: ['', [Validators.required, Validators.min(0)]],
      })
    );
  }

  onRemoveDetails(index: number) {
    this.details.removeAt(index);
  }

  onSubmit() {
    if (this.invoiceForm.invalid) {
      return;
    }

    this.invoiceSubmitEvent.emit(this.invoiceForm.value as Invoice);
  }
}

const detailsExistsValidator: ValidatorFn = (control: AbstractControl) => {
  const details = control.get('details') as FormArray;

  return details.length > 0
    ? null
    : {
        noDetails: true,
      };
};
