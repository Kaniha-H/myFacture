import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type InvoiceFormType = FormGroup<{
  customer_name: FormControl;
  description: FormControl;
  status: FormControl;
  details: FormArray<
    FormGroup<{
      description: FormControl;
      amount: FormControl;
      quantity: FormControl;
    }>
  >;
}>;
