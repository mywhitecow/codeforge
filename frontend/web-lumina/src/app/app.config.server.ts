// app.config.server.ts
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

// ─── CORRECCIÓN ────────────────────────────────────────────────────────────
// withRoutes(serverRoutes) conecta tu app.routes.server.ts al engine SSR.
// Sin esto, el extractor de rutas no sabe qué rutas prerenderizar y cuáles
// renderizar on-demand, causando comportamiento indefinido o errores.
//
// Si tu versión de @angular/ssr NO exporta withRoutes (versión muy temprana de 21.x),
// reemplaza provideServerRendering(withRoutes(serverRoutes)) por solo provideServerRendering()
// y el error debería resolverse igualmente gracias al fix de main.server.ts.
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes))
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);