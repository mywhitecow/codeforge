import { RenderMode, ServerRoute } from '@angular/ssr';

// ─── CORRECCIÓN SSR ────────────────────────────────────────────────────────
// RenderMode.Prerender en '**' intenta prerenderizar TODAS las rutas,
// incluyendo rutas con parámetros dinámicos como /courses/:id.
// Angular no puede resolver esos parámetros en build-time → tareas pendientes.
//
// Estrategia correcta:
// - Rutas estáticas conocidas → Prerender (generadas en build-time, ultra-rápidas)
// - Rutas dinámicas con :params → Server (SSR on-demand por request)
// - Rutas solo-cliente (auth, cart, profile) → Client (SPA, no SSR)
export const serverRoutes: ServerRoute[] = [
  // Rutas dinámicas: SSR on-demand
  {
    path: 'courses/:id',
    renderMode: RenderMode.Server,
  },

  // Rutas protegidas: solo cliente, requieren autenticación
  {
    path: 'cart',
    renderMode: RenderMode.Client,
  },
  {
    path: 'profile',
    renderMode: RenderMode.Client,
  },
  {
    path: 'auth/login',
    renderMode: RenderMode.Client,
  },
  {
    path: 'auth/register',
    renderMode: RenderMode.Client,
  },

  // Resto de rutas estáticas: prerenderizar en build-time
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];