// app.routes.ts
// ─────────────────────────────────────────────────────────────────────────────
// ARQUITECTURA DE RUTAS CON RBAC
//
// Principios aplicados:
//   1. Lazy loading por feature module (rendimiento)
//   2. Guards semánticos por rol (roleGuard factory)
//   3. Rutas agrupadas por dominio (admin, instructor, courses, auth)
//   4. `returnUrl` en guards para UX óptimo post-login
//
// Árbol de rutas:
//   /                     → redirect a /courses
//   /auth/**              → público (login, register)
//   /courses/**           → autenticado (cualquier rol)
//   /courses/:id/learn    → estudiante con acceso según suscripción
//   /admin/**             → solo admin
//   /instructor/**        → admin + instructor
//   /cart                 → estudiante autenticado
//   /profile              → cualquier autenticado
//   /unauthorized         → página de acceso denegado
// ─────────────────────────────────────────────────────────────────────────────
import { Routes } from '@angular/router';
import { adminGuard, instructorGuard, authGuard, roleGuard } from './core/guards/role.guard';
import { PlaceholderComponent } from './features/placeholder/placeholder.component';

export const routes: Routes = [

  // ── Rutas Públicas ─────────────────────────────────────────────────────
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/routes').then(m => m.AUTH_ROUTES),
  },

  // ── Rutas de Contenido (públicas) ──────────────────────────────────────
  {
    path: 'courses',
    loadChildren: () => import('./features/courses/routes').then(m => m.COURSE_ROUTES),
  },
  {
    path: 'paths',
    loadChildren: () => import('./features/paths/routes').then(m => m.PATHS_ROUTES),
  },
  {
    path: 'schools',
    loadChildren: () => import('./features/schools/routes').then(m => m.SCHOOLS_ROUTES),
  },

  // ── Panel de Administración (solo admin) ───────────────────────────────
  // Lazy-loaded feature module completo → el código del panel NUNCA
  // llega al bundle de Instructores ni Estudiantes.
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./features/admin/routes').then(m => m.ADMIN_ROUTES),
  },

  // ── Panel de Instructor (admin + instructor) ───────────────────────────
  {
    path: 'instructor',
    canActivate: [instructorGuard],
    loadChildren: () =>
      import('./features/instructor/routes').then(m => m.INSTRUCTOR_ROUTES),
  },

  // ── Rutas de Estudiante ────────────────────────────────────────────────
  {
    path: 'my-learning',
    canActivate: [roleGuard(['student', 'instructor', 'admin'])],
    loadChildren: () =>
      import('./features/learning/routes').then(m => m.LEARNING_ROUTES),
  },
  {
    path: 'cart',
    canActivate: [roleGuard(['student'])],
    loadChildren: () => import('./features/cart/routes').then(m => m.CART_ROUTES),
  },

  // ── Perfil (cualquier autenticado) ─────────────────────────────────────
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/user-profile/routes').then(m => m.PROFILE_ROUTES),
  },

  // ── Placeholder routes ─────────────────────────────────────────────────
  { path: 'business',  component: PlaceholderComponent },
  { path: 'jobs',      component: PlaceholderComponent },
  { path: 'live',      component: PlaceholderComponent },
 { path: 'premium',   loadComponent: () => import('./features/premium/premium.component').then(m => m.PremiumComponent) },
  { path: 'my-courses', component: PlaceholderComponent },
  { path: 'notes',     component: PlaceholderComponent },
  { path: 'help',      component: PlaceholderComponent },

  // ── Página de Acceso Denegado ──────────────────────────────────────────
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/unauthorized/unauthorized.component').then(
        m => m.UnauthorizedComponent
      ),
  },

  // ── OAuth callback (backend redirige aquí tras login social) ───────────
  {
    path: 'login-success',
    loadComponent: () =>
      import('./features/auth/login-success/login-success.component').then(
        m => m.LoginSuccessComponent
      ),
  },

  // ── Home Page ──────────────────────────────────────────────────────────
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent), pathMatch: 'full' },
  { path: '**', redirectTo: '/courses' },
];