// features/auth/login/login.component.ts
import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#0A0F1A] flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-[420px]">

        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-3 group mb-4" aria-label="CodeForge Academy — Ir al inicio">
            <svg width="44" height="44" viewBox="0 0 32 32" fill="none" class="transition-transform duration-300 group-hover:rotate-12" aria-hidden="true">
              <circle cx="16" cy="16" r="15" fill="url(#login-grad)" />
              <path d="M10 22 L16 10 L22 22 Z" fill="none" stroke="white" stroke-width="2" stroke-linejoin="round" />
              <circle cx="16" cy="14" r="2" fill="white" />
              <defs>
                <linearGradient id="login-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#3B82F6" />
                  <stop offset="100%" stop-color="#2563EB" />
                </linearGradient>
              </defs>
            </svg>
            <span class="text-2xl font-bold text-white tracking-tight">CodeForge Academy</span>
          </a>
          <h1 class="text-white text-2xl font-semibold tracking-tight">Bienvenido de vuelta</h1>
          <p class="text-slate-300 mt-1.5 text-sm">Inicia sesión para continuar aprendiendo</p>
        </div>

        <div class="bg-slate-800 rounded-2xl p-8 shadow-2xl ring-1 ring-white/5">

          @if (errorMsg()) {
            <div role="alert" class="mb-5 px-4 py-3 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300 text-sm flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ errorMsg() }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
            <div class="mb-4">
              <label for="login-email" class="block text-sm font-medium text-slate-200 mb-1.5">Correo electrónico</label>
              <div class="relative">
                <input
                  id="login-email"
                  type="email"
                  formControlName="email"
                  placeholder="tu@correo.com"
                  class="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                />
              </div>
            </div>

            <div>
              <label for="login-password" class="block text-sm font-medium text-slate-200 mb-1.5">Contraseña</label>
              <input
                id="login-password"
                type="password"
                formControlName="password"
                placeholder="••••••••"
                class="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              />
            </div>

            <button
              type="submit"
              class="w-full mt-6 py-3 px-6 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-all disabled:opacity-60"
              [disabled]="loading()"
            >
              {{ loading() ? 'Ingresando...' : 'Ingresar a CodeForge Academy' }}
            </button>
          </form>

          <div class="flex items-center gap-3 my-5">
            <div class="flex-1 h-px bg-slate-700"></div>
            <span class="text-xs text-slate-400">o continúa con</span>
            <div class="flex-1 h-px bg-slate-700"></div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              (click)="loginWithSocial('google')"
              class="flex items-center justify-center gap-2 py-2.5 border border-slate-600 rounded-xl text-sm text-slate-200 hover:bg-slate-700 transition-all"
            >
              <!-- Google logo -->
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              (click)="loginWithSocial('github')"
              class="flex items-center justify-center gap-2 py-2.5 border border-slate-600 rounded-xl text-sm text-slate-200 hover:bg-slate-700 transition-all"
            >
              <!-- GitHub logo -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
              </svg>
              GitHub
            </button>
          </div>

          <p class="text-center text-sm text-slate-400 mt-6">
            ¿No tienes cuenta?
            <a routerLink="/auth/register" class="text-blue-400 font-semibold">Regístrate gratis</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  errorMsg = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false],
  });

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    const { email, password } = this.form.getRawValue();

    this.auth.login(email!, password!).subscribe({
      next: (res: any) => {
        // acceptExternalToken actualiza el signal _token interno de AuthService
        // para que el guard vea isAuthenticated()=true de inmediato.
        this.auth.acceptExternalToken(res.token || res.accessToken);

        // Forzar la carga del usuario mapeado (desde /api/auth/me)
        this.auth.loadCurrentUser().subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigate(['/courses']);
          },
          error: () => {
            this.loading.set(false);
            this.errorMsg.set('No se pudo cargar el perfil del usuario.');
          }
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(
          err.status === 401 ? 'Correo o contraseña incorrectos.' : 'Error al conectar con el servidor.'
        );
      },
    });
  }

  // Lógica para redirigir a Google/GitHub en el backend
  loginWithSocial(provider: string): void {
    window.location.href = `http://localhost:8000/api/auth/${provider}/redirect`;
  }
}