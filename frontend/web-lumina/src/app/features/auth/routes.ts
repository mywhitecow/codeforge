import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginSuccessComponent } from './login-success/login-success.component';

export const AUTH_ROUTES: Routes = [
  { path: 'login',         component: LoginComponent },
  { path: 'register',      component: RegisterComponent },
  { path: 'login-success', component: LoginSuccessComponent },
  { path: '',              redirectTo: 'login', pathMatch: 'full' },
];