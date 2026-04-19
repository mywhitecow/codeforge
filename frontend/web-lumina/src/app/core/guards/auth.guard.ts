// core/guards/auth.guard.ts
// CORREGIDO: isAuthenticated es un computed Signal → se invoca como función isAuthenticated()
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // computed() devuelve un signal → llamar como función para leer el valor
  if (auth.isAuthenticated()) return true;

  return router.createUrlTree(['/auth/login']);
};