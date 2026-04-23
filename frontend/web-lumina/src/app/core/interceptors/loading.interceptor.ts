// ─────────────────────────────────────────────────────────────
// 3. core/interceptors/loading.interceptor.ts
// ─────────────────────────────────────────────────────────────
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
 
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip non-user-facing background requests (e.g. analytics pings)
  if (req.headers.has('X-Silent')) return next(req);
 
  const loading = inject(LoadingService);
  loading.start();
 
  return next(req).pipe(
    finalize(() => loading.stop())
  );
};