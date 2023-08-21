import { SpectatorDirective, createDirectiveFactory } from '@ngneat/spectator';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { AuthenticatedDirective } from './authenticated.directive';

describe('AuthenticatedDirective', () => {
  let spectator: SpectatorDirective<AuthenticatedDirective>;

  const fakeAuthService = {
    authStatus$: new BehaviorSubject(false),
  };

  const createSpectator = createDirectiveFactory({
    directive: AuthenticatedDirective,
    providers: [{ provide: AuthService, useValue: fakeAuthService }],
  });

  it('should show element only if authStatus$ matches', () => {
    spectator = createSpectator(`<h1 *authenticated="true"></h1>`);

    fakeAuthService.authStatus$.next(false);

    expect(spectator.query('h1')).not.toExist();

    fakeAuthService.authStatus$.next(true);

    expect(spectator.query('h1')).toExist();
  });
});
