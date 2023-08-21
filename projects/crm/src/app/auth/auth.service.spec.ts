import {
  HttpMethod,
  SpectatorHttp,
  createHttpFactory,
} from '@ngneat/spectator';
import { Observable, catchError, combineLatest, of, skip } from 'rxjs';
import { environment } from '../../environments/environments';
import { AuthService, TOKEN_MANAGER } from './auth.service';
import { TokenManager } from './token-manager';

const API_URL = environment.apiUrl;

let storedToken: string | null = null;

const fakeTokenManager: TokenManager = {
  storeToken: function (token: string): Observable<string> {
    storedToken = token;
    return of(token);
  },
  loadToken: function (): Observable<string | null> {
    return of(storedToken);
  },
  removeToken: function (): Observable<boolean> {
    storedToken = null;
    return of(true);
  },
};

describe('AuthService', () => {
  let spectator: SpectatorHttp<AuthService>;

  const createSpectator = createHttpFactory({
    service: AuthService,
    providers: [
      {
        provide: TOKEN_MANAGER,
        useValue: fakeTokenManager,
      },
    ],
  });

  beforeEach(() => {
    // there is no token
    storedToken = null;
  });

  it('should set authStatus$ to TRUE if token is stored', (done: DoneFn) => {
    storedToken = 'MOCK_TOKEN';

    spectator = createSpectator();

    // use DoneFn to wait for the subscription is done
    spectator.service.authStatus$.subscribe((status) => {
      expect(status).toBeTrue();
      done();
    });
  });

  it('should set authStatus$ to FALSE if no token is stored', (done: DoneFn) => {
    spectator = createSpectator();

    spectator.service.authStatus$.subscribe((status) => {
      expect(status).toBeFalse();
      done();
    });
  });

  it('should set authStatus to false and remove token when we call logout()', (done: DoneFn) => {
    storedToken = 'MOCK_TOKEN';

    spectator = createSpectator();

    spectator.service.logout();

    expect(storedToken).toBeNull();

    spectator.service.authStatus$.subscribe((status) => {
      expect(status).toBeFalse();
      done();
    });
  });

  it('should store a token and set authStatus$ to TRUE if login() succeeds', (done: DoneFn) => {
    spectator = createSpectator();

    const login$ = spectator.service.login({
      email: 'mock@mail.com',
      password: 'password1',
    });

    const authStatus$ = spectator.service.authStatus$.pipe(skip(1));

    combineLatest([login$, authStatus$]).subscribe(([token, status]) => {
      expect(token).toBe('MOCK_TOKEN');
      expect(storedToken).toBe('MOCK_TOKEN');
      expect(status).toBeTrue();
      done();
    });

    const req = spectator.expectOne(API_URL + '/auth/login', HttpMethod.POST);

    req.flush({
      authToken: 'MOCK_TOKEN',
    });
  });

  it('should not store a token and authStatus$ should remain to false if login() fails', (done: DoneFn) => {
    spectator = createSpectator();

    const login$ = spectator.service
      .login({
        email: 'mock@mail.com',
        password: 'password1',
      })
      .pipe(catchError(() => of('error')));

    const authStatus$ = spectator.service.authStatus$;

    combineLatest([login$, authStatus$]).subscribe(([token, status]) => {
      expect(status).toBeFalse();
      expect(storedToken).toBeNull();
      done();
    });

    const req = spectator.expectOne(API_URL + '/auth/login', HttpMethod.POST);

    req.flush(
      {
        message: 'MOCK_ERROR_MESSAGE',
      },
      {
        status: 401,
        statusText: 'forbidden',
      }
    );
  });

  it('should register a new account', (done: DoneFn) => {
    spectator = createSpectator();

    spectator.service
      .register({
        email: 'mock@mail.com',
        password: 'password1',
        name: 'MOCK_NAME',
      })
      .subscribe(() => done());

    const req = spectator.expectOne(API_URL + '/auth/signup', HttpMethod.POST);
    expect(req.request.body).toEqual({
      email: 'mock@mail.com',
      password: 'password1',
      name: 'MOCK_NAME',
    });

    req.flush({});
  });

  it('should verify if a mail is already exist', (done: DoneFn) => {
    spectator = createSpectator();

    spectator.service.exists('mock@mail.com').subscribe((exists) => {
      expect(exists).toBeTrue();
      done();
    });

    const req = spectator.expectOne(
      API_URL + '/user/validation/exists',
      HttpMethod.POST
    );

    expect(req.request.body).toEqual({
      email: 'mock@mail.com',
    });

    req.flush({
      exists: true,
    });
  });
});
