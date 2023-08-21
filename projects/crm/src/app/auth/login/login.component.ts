import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginData } from '../auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="bg-light rounded p-3">
      <h1>Connexion à MyFacture !</h1>
      <form [formGroup]="loginForm" (submit)="onSubmit()">
        <div class="alert bg-warning" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        <div>
          <label class="mb-1" for="email">Adresse email</label>
          <input
            [class.is-invalid]="email.invalid && email.touched"
            formControlName="email"
            type="email"
            placeholder="Adresse email de connexion"
            name="email"
            id="email"
            class="mb-3 form-control"
          />
          <p class="invalid-feedback">L'adresse email doit être valide</p>
        </div>
        <div>
          <label class="mb-1" for="password">Mot de passe</label>
          <input
            [class.is-invalid]="password.invalid && password.touched"
            formControlName="password"
            type="password"
            placeholder="Votre mot de passe"
            name="password"
            id="password"
            class="mb-3 form-control"
          />
          <p class="invalid-feedback">
            Le mot de passe est obligatoire, doit faire 8 caractères minimum et
            contenir au moins un chiffre
          </p>
        </div>

        <button class="btn btn-success">Connexion !</button>
      </form>
    </div>
  `,
  styles: [],
})
export class LoginComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  errorMessage = '';

  loginForm = this.fb.group({
    email: ['kaniha@mail.com', [Validators.required, Validators.email]],
    password: [
      'password1',
      [Validators.required, Validators.minLength(8), Validators.pattern(/\d+/)],
    ],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const loginData: LoginData = {
      email: this.email.value!,
      password: this.password.value!,
    };

    return this.auth.login(loginData).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (error) => (this.errorMessage = error.error.message),
    });
  }

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }
}
