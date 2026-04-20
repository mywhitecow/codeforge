import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
 
// ─── CORRECCIÓN CRÍTICA ────────────────────────────────────────────────────
// Angular 21 SSR: el engine llama este default export PASANDO un BootstrapContext.
// La función DEBE recibir ese context y pasarlo a bootstrapApplication.
// Sin esto, el proceso de extracción de rutas (prerender) lanza NG0401.
//
// Firma correcta: (context: unknown) => Promise<ApplicationRef>
// Angular internamente tipará el context — aquí usamos 'any' para evitar
// importar el tipo privado de @angular/ssr que puede no estar re-exportado.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const bootstrap = (context: any) => bootstrapApplication(AppComponent, config, context);
 
export default bootstrap;
 