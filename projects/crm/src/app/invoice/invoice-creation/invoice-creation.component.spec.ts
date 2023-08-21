import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { of, throwError } from 'rxjs';
import { InvoiceFormDetailsComponent } from '../invoice-form/invoice-form-details.component';
import { InvoiceFormGeneralComponent } from '../invoice-form/invoice-form-general.component';
import { InvoiceFormTotalsComponent } from '../invoice-form/invoice-form-totals.component';
import { InvoiceFormComponent } from '../invoice-form/invoice-form.component';
import { InvoiceService } from '../invoice.service';
import { InvoiceCreationComponent } from './invoice-creation.component';

describe('InvoiceCreationComponent', () => {
  let spectator: Spectator<InvoiceCreationComponent>;
  const createSpectator = createComponentFactory({
    component: InvoiceCreationComponent,
    imports: [ReactiveFormsModule],
    mocks: [InvoiceService, Router, ActivatedRoute],
    declarations: [
      InvoiceFormComponent,
      InvoiceFormDetailsComponent,
      InvoiceFormGeneralComponent,
      InvoiceFormTotalsComponent,
    ],
  });

  it('should redirect to ../ if invoice creation succeed', () => {
    spectator = createSpectator();
    spectator.inject(InvoiceService).create.and.returnValue(of(null));

    spectator.typeInElement('MOCK_DESCRIPTION', '#description');
    spectator.typeInElement('MOCK_CUSTOMER', '#customer_name');
    spectator.click('#initial-add-button');
    spectator.typeInElement('MOCK_DESCRIPTION', '#description_0');
    spectator.typeInElement('3', '#quantity_0');
    spectator.typeInElement('100', '#amount_0');

    spectator.click('#submit');

    expect(spectator.inject(Router).navigate).toHaveBeenCalledWith(['../'], {
      relativeTo: spectator.inject(ActivatedRoute),
    });
    expect(spectator.query('.alert.bg-warning')).not.toExist();
  });

  it('should not redirect and display an error message if invoice creation failed', () => {
    spectator = createSpectator();
    spectator
      .inject(InvoiceService)
      .create.and.returnValue(throwError(() => of(null)));

    spectator.typeInElement('MOCK_DESCRIPTION', '#description');
    spectator.typeInElement('MOCK_CUSTOMER', '#customer_name');
    spectator.click('#initial-add-button');
    spectator.typeInElement('MOCK_DESCRIPTION', '#description_0');
    spectator.typeInElement('3', '#quantity_0');
    spectator.typeInElement('100', '#amount_0');

    spectator.click('#submit');

    expect(spectator.inject(Router).navigate).not.toHaveBeenCalledWith();
    expect(spectator.query('.alert.bg-warning')).toExist();
  });
});
