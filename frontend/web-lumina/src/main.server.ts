import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// Angular SSR espera un default export que sea una función sin argumentos
// que retorne una Promise<ApplicationRef>.
// El BootstrapContext lo inyecta el engine de SSR internamente — NO se pasa manualmente.
const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;