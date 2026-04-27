// core/interceptors/error.interceptor.ts
// ─────────────────────────────────────────────────────────────
// 4. core/interceptors/error.interceptor.ts  (REPLACEMENT)
// ─────────────────────────────────────────────────────────────
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError, timer } from 'rxjs';
import { retry } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';
import { inject } from '@angular/core';

const RETRYABLE_STATUS = new Set([0, 429, 502, 503, 504]);
const MAX_RETRIES = 2;
const BASE_DELAY_MS = 1000;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    retry({
      count: MAX_RETRIES,
      delay: (error: HttpErrorResponse, attempt: number) => {
        if (!RETRYABLE_STATUS.has(error.status)) throw error;
        return timer(BASE_DELAY_MS * Math.pow(2, attempt - 1));
      },
    }),
    catchError((err: HttpErrorResponse) => {
      handleHttpError(err, router, toast);
      return throwError(() => err);
    })
  );
};

function handleHttpError(
  err: HttpErrorResponse,
  router: Router,
  toast: ToastService
): void {
  switch (err.status) {
    case 0:
      toast.error('Sin conexión. Verifica tu red e intenta de nuevo.');
      break;
    case 401:
      break;
    case 403:
      toast.error('No tienes permiso para realizar esta acción.');
      break;
    case 404:
      toast.error('No se encontró el recurso solicitado.');
      break;
    case 422:
      toast.error('Error en la validación de datos.');
      break;
    case 429:
      toast.warning('Demasiadas solicitudes. Espera un momento.');
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      toast.error('Error del servidor. Estamos trabajando en ello.');
      break;
    default:
      if (err.status >= 400) {
        toast.error('Ocurrió un error inesperado. Intenta de nuevo.');
      }
  }
}