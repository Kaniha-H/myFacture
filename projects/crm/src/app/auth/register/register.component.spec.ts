import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { of, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let spectator: Spectator<RegisterComponent>;

  const createSpectator = createComponentFactory({
    component: RegisterComponent,
    imports: [ReactiveFormsModule, RouterModule],
    mocks: [AuthService, Router],
  });

  it('should validate inputs', () => {
    spectator = createSpectator();

    // Testing email required
    spectator.typeInElement('', '#email');
    expect(spectator.component.email.invalid).toBeTrue();

    // Testing email format
    spectator.typeInElement('kaniha', '#email');
    expect(spectator.component.email.invalid).toBeTrue();

    // Testing email exists
    spectator.inject(AuthService).exists.and.returnValue(of(true));
    spectator.typeInElement('kaniha@mail.com', '#email');
    expect(spectator.component.email.invalid).toBeTrue();

    // Testing email available
    spectator.inject(AuthService).exists.and.returnValue(of(false));
    spectator.typeInElement('kha@mail.com', '#email');
    expect(spectator.component.email.valid).toBeTrue();

    // Testing confirm password valid
    spectator.typeInElement('password1', '#password');
    spectator.typeInElement('password1', '#confirmPassword');
    expect(spectator.component.registerForm.hasError('confirm')).toBeFalse();

    // Testing confirm password invalid
    spectator.typeInElement('password1', '#password');
    spectator.typeInElement('password2', '#confirmPassword');
    expect(spectator.component.registerForm.hasError('confirm')).toBeTrue();
  });

  it('should not call authServie.register if form is invalid', () => {
    spectator = createSpectator();

    spectator.component.registerForm.setValue({
      name: '',
      email: 'kaniha',
      password: 'jgl',
      confirmPassword: 'diff',
    });

    spectator.click('button');
    expect(spectator.inject(AuthService).register).not.toHaveBeenCalled();
  });
  it('should redirect / if register succeed', () => {
    spectator = createSpectator();

    spectator.inject(AuthService).register.and.returnValue(of(null));
    spectator.inject(AuthService).exists.and.returnValue(of(false));

    spectator.component.registerForm.setValue({
      name: 'Mélanie',
      email: 'mel@mail.com',
      password: 'password0',
      confirmPassword: 'password0',
    });

    spectator.click('button');

    expect(spectator.inject(Router).navigateByUrl).toHaveBeenCalledWith('/');
  });
  it('should not redirect and show an error message if register fails', () => {
    spectator = createSpectator();

    spectator
      .inject(AuthService)
      .register.and.returnValue(throwError(() => null));
    spectator.inject(AuthService).exists.and.returnValue(of(false));

    spectator.component.registerForm.setValue({
      name: 'Mélanie',
      email: 'mel@mail.com',
      password: 'password0',
      confirmPassword: 'password0',
    });

    spectator.click('button');

    expect(spectator.inject(Router).navigateByUrl).not.toHaveBeenCalled();
    expect(spectator.query('.alert.bg-warning')).toExist();
  });
});
