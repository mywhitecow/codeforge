// features/schools/routes.ts
import { Routes } from '@angular/router';

export const SCHOOLS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./school-list/school-list.component').then(m => m.SchoolListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./school-detail/school-detail.component').then(m => m.SchoolDetailComponent),
  },
];