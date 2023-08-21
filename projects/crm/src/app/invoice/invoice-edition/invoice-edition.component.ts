import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, switchMap, tap } from 'rxjs';
import { Invoice } from '../invoice';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoice-edition',
  template: `
    <div class="bg-light p-5 rounded">
      <h1>Modifier une facture</h1>
      <p class="alert bg-info text-white">
        Remplissez les informations de la facture afin de la retrouver dans
        votre liste plus tard !
      </p>

      <p class="alert bg-danger" *ngIf="errorMessage">{{ errorMessage }}</p>

      <app-invoice-form
        *ngIf="invoice$ | async as invoice"
        [invoice]="invoice"
        (invoice-submit)="onSubmit($event)"
      ></app-invoice-form>
    </div>
  `,
  styles: [],
})
export class InvoiceEditionComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private service: InvoiceService,
    private router: Router
  ) {}

  errorMessage = '';
  invoice$?: Observable<Invoice>;
  invoiceId?: number;

  ngOnInit(): void {
    this.invoice$ = this.route.paramMap.pipe(
      map((paramMap) => paramMap.get('id')),
      tap((id) => (this.invoiceId = +id!)),
      switchMap((id) => this.service.findOne(+id!))
    );
  }

  onSubmit(invoice: Invoice) {
    this.service.update({ ...invoice, id: this.invoiceId }).subscribe({
      next: () =>
        this.router.navigate(['../'], {
          relativeTo: this.route,
        }),
      error: () =>
        (this.errorMessage =
          'Une erreur est survenue durant la modification de la facture, merci de réessayer plus tard'),
    });
  }
}
