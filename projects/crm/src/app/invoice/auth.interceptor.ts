import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environments';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // si on ne travaille pas sur les invoices
    if (!req.url.startsWith(environment.apiUrl + '/invoice')) {
      // alors on laisse continuer les choses
      return next.handle(req);
    }

    return this.auth.authToken.pipe(
      tap((token) => {
        if (!token) {
          throw new Error('No authentification token');
        }
      }),
      switchMap((token) => {
        const reqWithToken = req.clone({
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
          }),
        });
        return next.handle(reqWithToken);
      })
    );
  }
}
