import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService, RegisterData } from '../auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="bg-light rounded p-3">
      <h1>Créer un compte sur MyFacture !</h1>
      <p>
        Vous pourrez alors gérer facilement vos factures en tant que Freelance !
      </p>
      <form [formGroup]="registerForm" (submit)="onSubmit()">
        <div class="alert bg-warning" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        <div>
          <label class="mb-1" for="name">Nom d'utilisateur</label>
          <input
            [class.is-invalid]="name.invalid && name.touched"
            formControlName="name"
            type="text"
            placeholder="Votre nom d'utilisateur"
            name="name"
            id="name"
            class="mb-3 form-control"
          />
          <p class="invalid-feedback">
            Le nom d'utilisateur est obligatoire et doi faire plus de 5
            caractères
          </p>
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
          <p
            class="invalid-feedback"
            *ngIf="email.hasError('required') || email.hasError('email')"
          >
            L'adresse email doit être valide
          </p>
          <p class="text-info" *ngIf="email.pending">
            <span class="spinner-border spinner-border-sm"></span>
            vérification du l'adresse email en cours
          </p>
          <p class="invalid-feedback" *ngIf="email.hasError('uniqueEmail')">
            L'adresse email est déjà utilisée
          </p>
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
        <div>
          <label class="mb-1" for="confirmPassword">Confirmation</label>
          <input
            [class.is-invalid]="
              (confirmPassword.invalid || registerForm.hasError('confirm')) &&
              confirmPassword.touched
            "
            formControlName="confirmPassword"
            type="password"
            placeholder="Confirmez votre mot de passe"
            name="confirmPassword"
            id="confirmPassword"
            class="mb-3 form-control"
          />

          <p
            class="invalid-feedback"
            *ngIf="confirmPassword.hasError('required')"
          >
            La confirmation du mot de passe est obligatoire
          </p>
          <p
            class="invalid-feedback"
            *ngIf="
              registerForm.hasError('confirm') &&
              !confirmPassword.hasError('required')
            "
          >
            La confirmation ne correspond pas au mot de passe
          </p>
        </div>
        <button class="btn btn-success">Créer mon compte MyFacture !</button>
      </form>
    </div>
  `,
  styles: [],
})
export class RegisterComponent {
  constructor(
    private router: Router,
    private auth: AuthService,
    private fb: FormBuilder
  ) {}

  errorMessage = '';

  registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: [
        '',
        [Validators.required, Validators.email],
        this.UniqueEmailAsyncValidator.bind(this),
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/\d+/),
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: confirmPasswordValidator,
    }
  );

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const data: RegisterData = {
      name: this.name.value!,
      email: this.email.value!,
      password: this.password.value!,
    };

    return this.auth.register(data).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (error) =>
        (this.errorMessage =
          'Un problème est survenu, merci de réessayer plus tard.'),
    });
  }

  UniqueEmailAsyncValidator(control: AbstractControl) {
    return this.auth
      .exists(control.value)
      .pipe(map((exists) => (exists ? { uniqueEmail: true } : null)));
  }

  // alias
  get name() {
    return this.registerForm.controls.name;
  }
  get email() {
    return this.registerForm.controls.email;
  }
  get password() {
    return this.registerForm.controls.password;
  }
  get confirmPassword() {
    return this.registerForm.controls.confirmPassword;
  }
}

const confirmPasswordValidator: ValidatorFn = (control: AbstractControl) => {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');

  if (password?.value === confirm?.value) {
    return null;
  }

  return {
    confirm: true,
  };
};
