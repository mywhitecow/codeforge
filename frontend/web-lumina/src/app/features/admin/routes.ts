// features/admin/routes.ts
// ─────────────────────────────────────────────────────────────────────────────
// Rutas del panel de administración.
// El canActivate en app.routes.ts ya garantiza que solo admins llegan aquí,
// pero se deja `adminGuard` también aquí como defensa en profundidad (defense
// in depth) — buena práctica para sistemas enterprise.
//
// Estructura:
//   /admin                    → Dashboard de admin (resumen, estadísticas)
//   /admin/courses            → Listado de todos los cursos (ABMC)
//   /admin/courses/new        → Crear nuevo curso
//   /admin/courses/:id/edit   → Editar curso existente
//   /admin/users              → Listado de usuarios
//   /admin/users/:id          → Detalle/edición de usuario
//   /admin/reports            → Dashboard de reportes
// ─────────────────────────────────────────────────────────────────────────────
import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [adminGuard], // defensa en profundidad
    loadComponent: () =>
      import('./dashboard/admin-dashboard.component').then(
        m => m.AdminDashboardComponent
      ),
  },
  {
    path: 'courses',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./courses/admin-course-list.component').then(
        m => m.AdminCourseListComponent
      ),
  },
  {
    path: 'courses/new',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./courses/admin-course-form.component').then(
        m => m.AdminCourseFormComponent
      ),
  },
  {
    path: 'courses/:id/edit',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./courses/admin-course-form.component').then(
        m => m.AdminCourseFormComponent
      ),
  },
  {
    path: 'users',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./users/admin-user-list.component').then(
        m => m.AdminUserListComponent
      ),
  },
  {
    path: 'users/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./users/admin-user-detail.component').then(
        m => m.AdminUserDetailComponent
      ),
  },
  {
    path: 'reports',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./reports/admin-reports.component').then(
        m => m.AdminReportsComponent
      ),
  },
];