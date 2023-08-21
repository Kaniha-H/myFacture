import { CommonModule, registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceCreationComponent } from './invoice-creation/invoice-creation.component';
import { InvoiceEditionComponent } from './invoice-edition/invoice-edition.component';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { AuthInterceptor } from './auth.interceptor';
import { InvoiceFormDetailsComponent } from './invoice-form/invoice-form-details.component';
import { InvoiceFormGeneralComponent } from './invoice-form/invoice-form-general.component';
import { InvoiceFormTotalsComponent } from './invoice-form/invoice-form-totals.component';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { InvoiceService } from './invoice.service';
import { InvoiceStatusComponent } from './invoices-list/invoice-status.component';

registerLocaleData(localeFr);

const routes: Routes = [
  { path: '', component: InvoicesListComponent },
  { path: 'create', component: InvoiceCreationComponent },
  { path: ':id', component: InvoiceEditionComponent },
];

@NgModule({
  declarations: [
    InvoiceCreationComponent,
    InvoiceEditionComponent,
    InvoicesListComponent,
    InvoiceFormComponent,
    InvoiceFormGeneralComponent,
    InvoiceFormDetailsComponent,
    InvoiceFormTotalsComponent,
    InvoiceStatusComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    InvoiceService,
    AuthInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthInterceptor,
    },
  ],
})
export class InvoiceModule {}
