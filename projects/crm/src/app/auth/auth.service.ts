import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from '../../environments/environments';
import { TokenManager } from './token-manager';

const API_URL = environment.apiUrl;

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type LoginApiResponse = { authToken: string };

export const TOKEN_MANAGER = new InjectionToken(
  'Class to inject to store the token'
);

@Injectable()
export class AuthService {
  constructor(
    private http: HttpClient,
    @Inject(TOKEN_MANAGER) private tokenManager: TokenManager
  ) {
    this.tokenManager.loadToken().subscribe((token) => {
      if (token) {
        this.authStatus$.next(true);
      }
    });
  }

  authStatus$ = new BehaviorSubject(false);

  register(registerData: RegisterData) {
    return this.http.post(API_URL + '/auth/signup', registerData);
  }

  exists(email: string) {
    return this.http
      .post<{ exists: boolean }>(API_URL + '/user/validation/exists', {
        email,
      })
      .pipe(map((response) => response.exists));
  }

  login(loginData: LoginData) {
    return this.http
      .post<LoginApiResponse>(API_URL + '/auth/login', loginData)
      .pipe(
        map((response) => response.authToken),
        tap((token) => {
          this.tokenManager.storeToken(token);
          this.authStatus$.next(true);
        })
      );
  }

  logout() {
    this.authStatus$.next(false);
    this.tokenManager.removeToken();
  }

  get authToken() {
    return this.tokenManager.loadToken();
  }
}
