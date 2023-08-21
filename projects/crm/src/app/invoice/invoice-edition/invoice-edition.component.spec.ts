// import { ReactiveFormsModule } from '@angular/forms';
// import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
// import { Spectator, createComponentFactory } from '@ngneat/spectator';
// import { of, throwError } from 'rxjs';
// import { InvoiceFormDetailsComponent } from '../invoice-form/invoice-form-details.component';
// import { InvoiceFormGeneralComponent } from '../invoice-form/invoice-form-general.component';
// import { InvoiceFormTotalsComponent } from '../invoice-form/invoice-form-totals.component';
// import { InvoiceFormComponent } from '../invoice-form/invoice-form.component';
// import { InvoiceService } from '../invoice.service';
// import { InvoiceEditionComponent } from './invoice-edition.component';

// describe('InvoiceEditionComponent', () => {
//   let spectator: Spectator<InvoiceEditionComponent>;

//   const createSpectator = createComponentFactory({
//     component: InvoiceEditionComponent,
//     declarations: [
//       InvoiceFormComponent,
//       InvoiceFormDetailsComponent,
//       InvoiceFormGeneralComponent,
//       InvoiceFormTotalsComponent,
//     ],
//     imports: [ReactiveFormsModule],
//     mocks: [ActivatedRoute, Router, InvoiceService],
//     detectChanges: false,
//   });

//   it('should not redirect to ../ if update fails', () => {
//     spectator = createSpectator();

//     const route = spectator.inject(ActivatedRoute);
//     const service = spectator.inject(InvoiceService);
//     const router = spectator.inject(Router);

//     service.findAll.and.returnValue(
//       of({
//         id: 42,
//         description: 'MOCK_DESCRIPTION',
//         customer_name: 'MOCK_CUSTOMER',
//         status: 'PAID',
//         details: [
//           { description: 'MOCK_DETAIL_1', amount: 300, quantity: 3 },
//           { description: 'MOCK_DETAIL_2', amount: 500, quantity: 3 },
//         ],
//       })
//     );

//     service.update.and.returnValue(throwError(() => of(null)));

//     spyOnProperty(route, 'paramMap').and.returnValue(
//       of(convertToParamMap({ id: 42 }))
//     );

//     spectator.detectChanges();

//     spectator.click('#submit');

//     expect(router.navigate).not.toHaveBeenCalled();
//     expect(spectator.query('.alert.bg-danger')).toExist();
//   });

//   it('should redirect to ../ if update succeed', () => {
//     spectator = createSpectator();

//     const route = spectator.inject(ActivatedRoute);
//     const service = spectator.inject(InvoiceService);
//     const router = spectator.inject(Router);

//     service.findAll.and.returnValue(
//       of({
//         id: 42,
//         description: 'MOCK_DESCRIPTION',
//         customer_name: 'MOCK_CUSTOMER',
//         status: 'PAID',
//         details: [
//           { description: 'MOCK_DETAIL_1', amount: 300, quantity: 3 },
//           { description: 'MOCK_DETAIL_2', amount: 500, quantity: 3 },
//         ],
//       })
//     );

//     service.update.and.returnValue(of(null));

//     spyOnProperty(route, 'paramMap').and.returnValue(
//       of(convertToParamMap({ id: 42 }))
//     );

//     spectator.detectChanges();

//     spectator.click('#submit');

//     expect(router.navigate).toHaveBeenCalledWith(['../'], {
//       relativeTo: route,
//     });
//   });
// });
