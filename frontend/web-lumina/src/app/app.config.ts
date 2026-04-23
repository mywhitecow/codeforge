// app.config.ts
// FIX: provideClientHydration() es obligatorio en Angular 21 cuando se usa
//      outputMode: 'server' en angular.json. Sin él, el cliente no puede
//      rehidratar el HTML renderizado en servidor y se produce un mismatch
//      que puede romper la aplicación en producción silenciosamente.
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withFetch,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(
      withInterceptors([loadingInterceptor, authInterceptor, errorInterceptor]),
      withFetch(), // obligatorio para SSR: usa fetch nativo en lugar de XHR
    ),
    provideAnimationsAsync(),
    provideClientHydration(), // obligatorio con outputMode: 'server' en Angular 21
  ],
};