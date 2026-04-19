// features/paths/routes.ts
// CORREGIDO: rutas funcionales con componente real
import { Routes } from '@angular/router';
import { PathListComponent } from './path-list/path-list.component';

export const PATHS_ROUTES: Routes = [
  { path: '', component: PathListComponent },
];