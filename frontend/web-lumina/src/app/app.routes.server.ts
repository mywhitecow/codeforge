// app.routes.server.ts
// CORREGIDO:
//   - Rutas estáticas → Prerender (genera HTML en build)
//   - Rutas dinámicas (con parámetros) → Server (renderizado en runtime)
//   - Rutas protegidas → Server (requieren auth, no pueden pre-renderizarse)
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '',                 renderMode: RenderMode.Prerender },
  { path: 'courses',          renderMode: RenderMode.Prerender },
  { path: 'paths',            renderMode: RenderMode.Prerender },
  { path: 'schools',          renderMode: RenderMode.Prerender },
  { path: 'business',         renderMode: RenderMode.Prerender },
  { path: 'jobs',             renderMode: RenderMode.Prerender },
  { path: 'live',             renderMode: RenderMode.Prerender },
  { path: 'premium',          renderMode: RenderMode.Prerender },
  { path: 'auth/login',       renderMode: RenderMode.Prerender },
  { path: 'auth/register',    renderMode: RenderMode.Prerender },

  // Ruta dinámica con parámetros → se fuerza Prerender con 0 páginas
  {
    path: 'courses/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => []
  }
];
  // Rutas dinámicas: renderizado en runtime (parámetros desconocidos en build)
 //{ path: 'courses/:id', renderMode: RenderMode.Server },

  // Rutas protegidas: siempre Server (dependen de auth state)
 //{ path: 'cart',    renderMode: RenderMode.Server },
 //{ path: 'profile', renderMode: RenderMode.Server },

  // Fallback
 // { path: '**', renderMode: RenderMode.Server },
