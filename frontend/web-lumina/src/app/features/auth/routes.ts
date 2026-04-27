import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginSuccessComponent } from './login-success/login-success.component';
import { noAuthGuard } from '../../core/guards/role.guard';

export const AUTH_ROUTES: Routes = [
  { path: 'login',         component: LoginComponent,        canActivate: [noAuthGuard] },
  { path: 'register',      component: RegisterComponent,     canActivate: [noAuthGuard] },
  { path: 'login-success', component: LoginSuccessComponent },
  { path: '',              redirectTo: 'login', pathMatch: 'full' },
];