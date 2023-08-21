import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { of, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let spectator: Spectator<LoginComponent>;

  const createSpectator = createComponentFactory({
    component: LoginComponent,
    imports: [ReactiveFormsModule],
    mocks: [AuthService, Router],
  });
  it('should valide inputs', () => {
    spectator = createSpectator();

    // Testing required email
    spectator.typeInElement('', '#email');
    expect(spectator.component.email.invalid).toBeTrue();

    // Testing wrong email format
    spectator.typeInElement('toto', '#email');
    expect(spectator.component.email.invalid).toBeTrue();

    // Testing right email format
    spectator.typeInElement('toto@mail.com', '#email');
    expect(spectator.component.email.valid).toBeTrue();

    // Testing required password
    spectator.typeInElement('', '#password');
    expect(spectator.component.password.invalid).toBeTrue();

    // Testing too short password
    spectator.typeInElement('toto1', '#password');
    expect(spectator.component.password.invalid).toBeTrue();

    // Testing password without digital
    spectator.typeInElement('tototatae', '#password');
    expect(spectator.component.password.invalid).toBeTrue();

    // Testing good password format
    spectator.typeInElement('password0', '#password');
    expect(spectator.component.password.valid).toBeTrue();
  });

  it('should redirect / if login succeed', () => {
    spectator = createSpectator();

    spectator.inject(AuthService).login.and.returnValue(of(null));

    spectator.component.loginForm.setValue({
      email: 'kaniha@mail.com',
      password: 'password1',
    });

    spectator.click('button');

    expect(spectator.inject(Router).navigateByUrl).toHaveBeenCalledWith('/');
  });
  it('should not call service if form is invalid', () => {
    spectator = createSpectator();

    spectator.component.loginForm.setValue({
      email: 'kaniha@mail.com',
      password: 'pass1',
    });

    spectator.click('button');

    expect(spectator.inject(AuthService).login).not.toHaveBeenCalled();
  });
  it('should not redirect and show an error message if login fails', () => {
    spectator = createSpectator();

    spectator.inject(AuthService).login.and.returnValue(
      throwError(() => {
        return {
          error: {
            message: 'MOCK_MESSAGE',
          },
        };
      })
    );

    spectator.component.loginForm.setValue({
      email: 'kaniha@mail.com',
      password: 'password1',
    });

    spectator.click('button');

    expect(spectator.inject(Router).navigateByUrl).not.toHaveBeenCalled();
    expect(spectator.query('.alert.bg-warning')).toExist();
    expect(spectator.query('.alert.bg-warning')).toHaveText('MOCK_MESSAGE');
  });
});
