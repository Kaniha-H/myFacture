import { Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SpectatorHost, createHostFactory } from '@ngneat/spectator';
import { InvoiceFormDetailsComponent } from './invoice-form-details.component';

@Component({
  template: `<app-invoice-form-details
    [parent]="form"
    (details-added)="onAdd()"
    (details-removed)="onRemove($event)"
  ></app-invoice-form-details>`,
})
class TestHostComponent {
  onAdd() {}

  onRemove(index: number) {}

  form = new FormGroup({
    details: new FormArray([
      new FormGroup({
        amount: new FormControl(100),
        description: new FormControl('MOCK_DESCRIPTION_1'),
        quantity: new FormControl(2),
      }),
      new FormGroup({
        amount: new FormControl(200),
        description: new FormControl('MOCK_DESCRIPTION_2'),
        quantity: new FormControl(3),
      }),
    ]),
  });
}

describe('InvoiceFormDetailsComponent', () => {
  let spectator: SpectatorHost<InvoiceFormDetailsComponent, TestHostComponent>;

  const createSpectator = createHostFactory({
    component: InvoiceFormDetailsComponent,
    host: TestHostComponent,
    imports: [ReactiveFormsModule],
  });

  it('should display 2 details item', () => {
    spectator = createSpectator(`<app-invoice-form-details
      [parent]="form"
    ></app-invoice-form-details>`);

    expect(spectator.queryAll('.detail-row')).toHaveLength(2);
  });

  it('should take into account user modifications to inputs', () => {
    spectator = createSpectator(`<app-invoice-form-details
      [parent]="form"
    ></app-invoice-form-details>`);

    spectator.typeInElement('200', '#amount_0');
    spectator.typeInElement('UPDATED_DESCRIPTION', '#description_0');
    spectator.typeInElement('5', '#quantity_0');

    expect(spectator.hostComponent.form.controls.details.value[0]).toEqual({
      amount: 200,
      description: 'UPDATED_DESCRIPTION',
      quantity: 5,
    });
  });

  it('should Output a custom event when user clicks on #add-button', () => {
    spectator = createSpectator(`<app-invoice-form-details
    [parent]="form"
    (details-added)="onAdd()"
  ></app-invoice-form-details>`);

    const onAddSpy = spyOn(spectator.hostComponent, 'onAdd');

    spectator.click('#add-button');

    expect(onAddSpy).toHaveBeenCalled();
  });

  it('should Output a custom event when user clicks on #remove-button', () => {
    spectator = createSpectator(`<app-invoice-form-details
    [parent]="form"
    (details-removed)="onRemove($event)"
  ></app-invoice-form-details>`);

    const onRemoveSpy = spyOn(spectator.hostComponent, 'onRemove');

    spectator.click('#remove-button-0');

    expect(onRemoveSpy).toHaveBeenCalledWith(0);

    spectator.click('#remove-button-1');

    expect(onRemoveSpy).toHaveBeenCalledWith(1);
  });

  it('should display a welcome message with a button to add first detail', () => {
    spectator = createSpectator(
      `<app-invoice-form-details
        [parent]="form"
        (details-added)="onAdd()"
      ></app-invoice-form-details>`,
      {
        hostProps: {
          form: new FormGroup({
            details: new FormArray<FormGroup>([]),
          }),
        },
      }
    );

    expect(spectator.queryAll('.detail-row')).toHaveLength(0);
    expect(spectator.query('.alert.bg-warning')).toExist();

    const onAddSpy = spyOn(spectator.hostComponent, 'onAdd');

    spectator.click('#initial-add-button');

    expect(onAddSpy).toHaveBeenCalledWith();
  });
});
