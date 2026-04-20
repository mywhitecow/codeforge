// main.server.ts
// FIX: BootstrapContext NO es un export público de @angular/platform-browser en Angular 21.
//      El bootstrap server correcto es una función default que recibe ApplicationRef
//      internamente. La firma correcta para Angular SSR es simplemente exportar
//      la llamada a bootstrapApplication sin tipar el contexto manualmente.
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

export default () => bootstrapApplication(AppComponent, config);