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
    <!-- Fondo azul marino profundo -->
    <div class="min-h-screen bg-[#0A0F1A] flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-[420px]">

        <!-- Logo + Encabezado -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-3 group mb-4" aria-label="LUMINA — Ir al inicio">
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
            <span class="text-2xl font-bold text-white tracking-tight">LUMINA</span>
          </a>
          <h1 class="text-white text-2xl font-semibold tracking-tight">Bienvenido de vuelta</h1>
          <p class="text-slate-300 mt-1.5 text-sm">Inicia sesión para continuar aprendiendo</p>
        </div>

        <!-- Tarjeta de login (Dark Slate) -->
        <div class="bg-slate-800 rounded-2xl p-8 shadow-2xl ring-1 ring-white/5">

          <!-- Error global -->
          @if (errorMsg()) {
            <div role="alert" class="mb-5 px-4 py-3 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300 text-sm flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ errorMsg() }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>

            <!-- Email -->
            <div class="mb-4">
              <label for="login-email" class="block text-sm font-medium text-slate-200 mb-1.5">Correo electrónico</label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <input
                  id="login-email"
                  type="email"
                  formControlName="email"
                  placeholder="tu@correo.com"
                  autocomplete="email"
                  class="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                />
              </div>
              @if (f['email'].invalid && f['email'].touched) {
                <span class="text-xs text-red-400 mt-1 block">
                  @if (f['email'].errors?.['required']) { El correo es obligatorio. }
                  @else if (f['email'].errors?.['email']) { Ingresa un correo válido. }
                </span>
              }
            </div>

            <!-- Password -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label for="login-password" class="block text-sm font-medium text-slate-200">Contraseña</label>
                <a routerLink="/auth/forgot-password" class="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-width="1.5"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input
                  id="login-password"
                  type="password"
                  formControlName="password"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  class="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                />
              </div>
              @if (f['password'].invalid && f['password'].touched) {
                <span class="text-xs text-red-400 mt-1 block">
                  @if (f['password'].errors?.['required']) { La contraseña es obligatoria. }
                  @else if (f['password'].errors?.['minlength']) { Mínimo 8 caracteres. }
                </span>
              }
            </div>

            <!-- Recordar sesión -->
            <label class="flex items-center gap-2.5 mt-4 mb-5 cursor-pointer group">
              <input
                type="checkbox"
                formControlName="rememberMe"
                class="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800 cursor-pointer"
              />
              <span class="text-sm text-slate-300 group-hover:text-slate-200 transition-colors select-none">
                Recordar mi sesión por 30 días
              </span>
            </label>

            <!-- Botón submit (azul brillante) -->
            <button
              type="submit"
              class="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white text-sm bg-blue-500 hover:bg-blue-600 hover:-translate-y-px hover:shadow-lg hover:shadow-blue-500/30 active:translate-y-0 active:shadow-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              [disabled]="loading()"
            >
              @if (loading()) {
                <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Ingresando...
              } @else {
                Ingresar a LUMINA
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              }
            </button>

          </form>

          <!-- Divisor OAuth -->
          <div class="flex items-center gap-3 my-5">
            <div class="flex-1 h-px bg-slate-700"></div>
            <span class="text-xs text-slate-400 font-medium">o continúa con</span>
            <div class="flex-1 h-px bg-slate-700"></div>
          </div>

          <!-- Botones sociales -->
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-600 rounded-xl text-sm text-slate-200 font-medium hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-150"
              aria-label="Continuar con Google"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              class="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-600 rounded-xl text-sm text-slate-200 font-medium hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-150"
              aria-label="Continuar con GitHub"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <p class="text-center text-sm text-slate-400 mt-6">
            ¿No tienes cuenta?
            <a routerLink="/auth/register" class="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Regístrate gratis
            </a>
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

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    const { email, password } = this.form.getRawValue();

    this.auth.login(email!, password!).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/courses']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(
          err.status === 401
            ? 'Correo o contraseña incorrectos.'
            : 'Ocurrió un error. Inténtalo de nuevo.'
        );
      },
    });
  }
}