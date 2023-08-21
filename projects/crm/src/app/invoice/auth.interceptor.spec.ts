import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpMethod,
  SpectatorHttp,
  createHttpFactory,
} from '@ngneat/spectator';
import { of } from 'rxjs';
import { environment } from '../../environments/environments';
import { AuthService } from '../auth/auth.service';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let spectator: SpectatorHttp<AuthInterceptor>;

  const createSpectator = createHttpFactory({
    service: AuthInterceptor,
    mocks: [AuthService],
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
      },
    ],
  });

  it('should not act on the request if it does not concern invoice', () => {
    spectator = createSpectator();

    const http = spectator.inject(HttpClient);

    http.get(environment.apiUrl + '/users').subscribe();

    const req = spectator.expectOne(
      environment.apiUrl + '/users',
      HttpMethod.GET
    );

    expect(req.request.headers.has('Authorization')).toBeFalse();
  });

  it('should throw an error if we reach /invoice without a authToken', (done: DoneFn) => {
    spectator = createSpectator();

    const http = spectator.inject(HttpClient);
    const auth = spectator.inject(AuthService);

    spyOnProperty(auth, 'authToken').and.returnValue(of(null));

    http.get(environment.apiUrl + '/invoice/toto').subscribe({
      error: (error) => {
        expect(error.message).toBe('No authentification token');
        done();
      },
    });
  });

  it('should add authorization Bearer if we reach /invoice with an authToken', () => {
    spectator = createSpectator();

    const http = spectator.inject(HttpClient);
    const auth = spectator.inject(AuthService);

    spyOnProperty(auth, 'authToken').and.returnValue(of('MOCK_TOKEN'));

    http.get(environment.apiUrl + '/invoice/toto').subscribe();

    const req = spectator.expectOne(
      environment.apiUrl + '/invoice/toto',
      HttpMethod.GET
    );

    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer MOCK_TOKEN');
  });
});
