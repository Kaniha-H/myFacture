import { Observable } from 'rxjs';

export interface TokenManager {
  storeToken(token: string): Observable<string>;
  loadToken(): Observable<string | null>;
  removeToken(): Observable<boolean>;
}
