// app.config.server.ts
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';
import { appConfig } from './app.config';

// provideServerRendering() en Angular 21 no requiere argumentos adicionales.
// withRoutes() no existe en esta versión — fue eliminado o nunca existió en la API pública.
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);