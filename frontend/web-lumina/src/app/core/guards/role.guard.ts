// core/guards/role.guard.ts
// ─────────────────────────────────────────────────────────────────────────────
// DISEÑO: Guard Factory Pattern
//
// Por qué factory en vez de un guard por rol:
//   ❌ authGuard, adminGuard, instructorGuard, studentGuard → 4 archivos,
//      duplicación masiva, difícil de mantener.
//   ✅ roleGuard(['admin', 'instructor']) → una función, composable, DRY.
//
// Uso en rutas:
//   { path: 'admin', canActivate: [roleGuard(['admin'])] }
//   { path: 'courses/new', canActivate: [roleGuard(['admin', 'instructor'])] }
//
// El guard hace 3 cosas en orden:
//   1. Si no está autenticado → redirige a /auth/login (guarda la URL destino)
//   2. Si está autenticado pero el rol no coincide → redirige a /unauthorized
//   3. Si todo OK → permite el acceso
// ─────────────────────────────────────────────────────────────────────────────
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';
import { UserRole } from '../models/user.model';

/**
 * Factory que genera un `CanActivateFn` tipado para los roles dados.
 *
 * @param allowedRoles - Array de roles con acceso. Array vacío = cualquier rol autenticado.
 *
 * @example
 * // Solo admin
 * canActivate: [roleGuard(['admin'])]
 *
 * // Admin o Instructor
 * canActivate: [roleGuard(['admin', 'instructor'])]
 *
 * // Cualquier usuario autenticado (equivale al authGuard anterior)
 * canActivate: [roleGuard([])]
 */
export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return (route, state) => {
    const auth        = inject(AuthService);
    const permissions = inject(PermissionService);
    const router      = inject(Router);

    // ── Paso 1: ¿Está autenticado? ───────────────────────────────────────
    if (!auth.isAuthenticated()) {
      // Guardamos la URL destino para redirigir después del login (UX estándar)
      return router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url },
      });
    }

    // ── Paso 2: ¿Tiene el rol requerido? ────────────────────────────────
    // Si `allowedRoles` está vacío, cualquier rol autenticado puede pasar.
    if (allowedRoles.length > 0) {
      const currentRole = permissions.currentRole();
      if (!currentRole || !allowedRoles.includes(currentRole)) {
        // Redirigimos a una página de "sin permisos" con contexto
        return router.createUrlTree(['/unauthorized'], {
          queryParams: { requiredRole: allowedRoles[0] },
        });
      }
    }

    return true;
  };
}

// ── Guards semánticos pre-construidos (convenience exports) ─────────────────
// Así las rutas quedan legibles sin importar la factory manualmente:
//   canActivate: [adminGuard]   en vez de   canActivate: [roleGuard(['admin'])]

/** Acceso exclusivo para administradores */
export const adminGuard: CanActivateFn = roleGuard(['admin']);

/** Acceso para administradores e instructores */
export const instructorGuard: CanActivateFn = roleGuard(['admin', 'instructor']);

/** Acceso para cualquier usuario autenticado (todos los roles) */
export const authGuard: CanActivateFn = roleGuard([]);