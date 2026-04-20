// app.config.server.ts
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';
//import { provideServerRoutesConfig } from '@angular/ssr';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    //provideServerRoutesConfig(serverRoutes),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);