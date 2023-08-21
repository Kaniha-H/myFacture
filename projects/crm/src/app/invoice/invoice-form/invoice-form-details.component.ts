import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InvoiceFormType } from './invoice-form-type';

@Component({
  selector: 'app-invoice-form-details',
  template: `
    <ng-container [formGroup]="parent" *ngIf="parent && details">
      <div class="alert bg-warning text-white" *ngIf="details.length === 0">
        <p>Vous devez ajouter des détails à votre facture</p>
        <button
          type="button"
          id="initial-add-button"
          class="btn btn-sm btn-outline-light"
          (click)="detailsAddedEvent.emit()"
        >
          + Ajouter ma première ligne
        </button>
      </div>
      <section formArrayName="details">
        <div
          class="detail-row"
          *ngFor="let group of details.controls; let i = index"
          [formGroup]="group"
        >
          <div class="row mb-3">
            <div class="col-7">
              <input
                [class.is-invalid]="
                  group.controls.description.touched &&
                  group.controls.description.invalid
                "
                formControlName="description"
                name="description_{{ i }}"
                id="description_{{ i }}"
                type="text"
                placeholder="Description"
                class="form-control"
              />
              <p class="invalid-feedback">La description est obligatoire</p>
            </div>
            <div class="col-2">
              <input
                [class.is-invalid]="
                  group.controls.amount.touched && group.controls.amount.invalid
                "
                formControlName="amount"
                name="amount_{{ i }}"
                id="amount_{{ i }}"
                type="number"
                placeholder="Montant"
                class="form-control"
              />
              <p class="invalid-feedback">Le montant est obligatoire</p>
            </div>
            <div class="col-2">
              <input
                [class.is-invalid]="
                  group.controls.quantity.touched &&
                  group.controls.quantity.invalid
                "
                formControlName="quantity"
                name="quantity_{{ i }}"
                id="quantity_{{ i }}"
                type="number"
                placeholder="Quantité"
                class="form-control"
              />
              <p class="invalid-feedback">La quantité est obligatoire</p>
            </div>
            <div class="col-1">
              <button
                type="button"
                id="remove-button-{{ i }}"
                class="btn w-auto d-block btn-sm btn-danger"
                (click)="detailsRemovedEvent.emit(i)"
              >
                X
              </button>
            </div>
          </div>
        </div>
        <button
          *ngIf="details.length > 0"
          id="add-button"
          class="btn btn-primary btn-sm"
          type="button"
          (click)="detailsAddedEvent.emit()"
        >
          + Ajouter une ligne
        </button>
      </section>
    </ng-container>
  `,
  styles: [],
})
export class InvoiceFormDetailsComponent {
  @Input()
  parent?: InvoiceFormType;

  @Output('details-removed')
  detailsRemovedEvent = new EventEmitter<number>();

  @Output('details-added')
  detailsAddedEvent = new EventEmitter();

  get details() {
    return this.parent?.controls.details;
  }
}
