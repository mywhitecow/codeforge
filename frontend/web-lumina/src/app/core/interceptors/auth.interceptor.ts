// core/interceptors/auth.interceptor.ts
// ─────────────────────────────────────────────────────────────
// auth.interceptor.ts — Update to use token refresh
// ─────────────────────────────────────────────────────────────

import { HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (auth.needsRefresh()) {
    return auth.refreshAccessToken().pipe(
      switchMap(token => next(addAuthHeader(req, token))),
      catchError(() => next(req))
    );
  }

  const token = auth.getToken();
  const outgoingReq = token ? addAuthHeader(req, token) : req;

  return next(outgoingReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && token && !req.url.includes('auth/refresh')) {
        return auth.refreshAccessToken().pipe(
          switchMap(newToken => next(addAuthHeader(req, newToken))),
          catchError(refreshErr => throwError(() => refreshErr))
        );
      }
      return throwError(() => err);
    })
  );
};

function addAuthHeader(req: HttpRequest<unknown>, token: string) {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}