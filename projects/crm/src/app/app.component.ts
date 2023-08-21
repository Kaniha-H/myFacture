import { Component, OnDestroy } from '@angular/core';
import {
  Event as NavigationEvent,
  NavigationStart,
  Router,
} from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/">MyFature</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarColor01">
          <ul class="navbar-nav me-auto">
            <ng-container *authenticated="true">
              <li class="nav-item">
                <a class="nav-link" routerLink="/invoices">Factures</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/invoices/create">+ Créer</a>
              </li>
            </ng-container>
          </ul>
          <ul class="navbar-nav">
            <ng-container *authenticated="false">
              <li class="nav-item">
                <a
                  id="login"
                  routerLink="/account/login"
                  class="btn btn-success btn-sm"
                  >Connexion</a
                >
              </li>
              <li class="nav-item">
                <a
                  id="register"
                  routerLink="/account/register"
                  class="btn btn-info btn-sm"
                  >Inscription</a
                >
              </li>
            </ng-container>
            <li class="nav-item" *authenticated="true">
              <button
                (click)="onLogout()"
                id="logout"
                class="btn btn-danger btn-sm"
              >
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container pt-5">
      <div
        class="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg"
        *ngIf="isHomepage"
      >
        <div class="col-lg-7 p-3 p-lg-5 pt-lg-3">
          <h1 class="display-4 fw-bold lh-1 text-body-emphasis">
            Bienvenue dans MyFacture
          </h1>
          <p class="lead">
            Gagnez du temps et simplifiez-vous la vie, où que vous soyez!
            Essayez gratuitement. Toutes les fonctionnalités dont vous avez
            besoin afin de simplifier votre gestion. Facile et rapide
          </p>
          <div
            class="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3"
            *authenticated="false"
          >
            <button
              class="btn btn-primary btn-lg px-4 me-md-2 fw-bold"
              routerLink="/account/register"
            >
              Créer un compte
            </button>
            <button
              class="btn btn-outline-secondary btn-lg px-4"
              routerLink="/account/login"
            >
              Connexion
            </button>
          </div>
          <div
            class="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3"
            *authenticated="true"
          >
            <button
              class="btn btn-primary btn-lg px-4 me-md-2 fw-bold"
              routerLink="/invoices/create"
            >
              Créer une facture
            </button>
            <button
              class="btn btn-outline-secondary btn-lg px-4"
              routerLink="/invoices"
            >
              Voir mes factures
            </button>
          </div>
        </div>
        <div class="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg">
          <img
            class="rounded-lg-3"
            src="../assets/crm.png"
            alt="capture d'une création d'une facture"
            width="720"
          />
        </div>
      </div>
    </div>

    <div class="container pt-5">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [],
})
export class AppComponent implements OnDestroy {
  isHomepage: boolean = true;
  event$;

  constructor(private auth: AuthService, private router: Router) {
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        if (event.url === '/') {
          this.isHomepage = true;
        } else {
          this.isHomepage = false;
        }
      }
    });
  }

  onLogout() {
    this.auth.logout();
    this.router.navigateByUrl('account/login');
  }

  ngOnDestroy() {
    this.event$.unsubscribe();
  }
}
