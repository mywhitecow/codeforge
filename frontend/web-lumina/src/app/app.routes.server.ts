// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // courses/:id → SSR on-demand (correcto, el parámetro no se puede prerenderar)
  {
    path: 'courses/:id',
    renderMode: RenderMode.Server,
  },

  // Admin: rutas con parámetros → SSR on-demand
  { path: 'admin/courses/:id/edit', renderMode: RenderMode.Server },
  { path: 'admin/users/:id',        renderMode: RenderMode.Server },

  // Instructor: rutas con parámetros → SSR on-demand
  { path: 'instructor/courses/:id/edit',     renderMode: RenderMode.Server },
  { path: 'instructor/courses/:id/students', renderMode: RenderMode.Server },

  // Rutas protegidas → solo cliente
  { path: 'cart',           renderMode: RenderMode.Client },
  { path: 'profile',        renderMode: RenderMode.Client },
  { path: 'my-learning',    renderMode: RenderMode.Client },
  { path: 'my-learning/course/:id', renderMode: RenderMode.Client },
  { path: 'my-learning/course/:id/quiz', renderMode: RenderMode.Client },
  { path: 'auth/login',     renderMode: RenderMode.Client },
  { path: 'auth/register',  renderMode: RenderMode.Client },

  // Rutas dinámicas públicas → SSR on-demand
  { path: 'paths/:id',      renderMode: RenderMode.Server },

  // Todo lo demás → prerender en build time
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];