import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'courses',
    loadChildren: () => import('./features/courses/routes').then(m => m.COURSE_ROUTES)
  },
  {
    path: 'paths',
    loadChildren: () => import('./features/paths/routes').then(m => m.PATHS_ROUTES)
  },
  {
    path: 'schools',
    loadChildren: () => import('./features/schools/routes').then(m => m.SCHOOLS_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'cart',
    canActivate: [authGuard],
  loadChildren: () => import('./features/cart/routes').then(m => m.CART_ROUTES)
  },
  {
    path: 'profile',
     canActivate: [authGuard],
  loadChildren: () => import('./features/user-profile/routes').then(m => m.PROFILE_ROUTES)  
  },
  { path: '', redirectTo: '/courses', pathMatch: 'full' },
  { path: '**', redirectTo: '/courses' }
];