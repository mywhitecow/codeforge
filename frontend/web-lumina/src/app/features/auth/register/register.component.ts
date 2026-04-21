// features/auth/register/register.component.ts
import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Validador: contraseñas coinciden
function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const pass = control.get('password')?.value as string;
  const confirm = control.get('confirmPassword')?.value as string;
  return pass === confirm ? null : { passwordsMismatch: true };
}

// Tipo para fortaleza de contraseña
type PasswordStrength = 'empty' | 'weak' | 'medium' | 'strong';

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <!-- Fondo azul marino profundo -->
    <div class="min-h-screen bg-[#0A0F1A] flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-[440px]">

        <!-- Logo + Encabezado -->
        <div class="text-center mb-6">
          <a routerLink="/" class="inline-flex items-center gap-3 group mb-4" aria-label="LUMINA — Ir al inicio">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" class="transition-transform duration-300 group-hover:rotate-12" aria-hidden="true">
              <circle cx="16" cy="16" r="15" fill="url(#reg-grad)" />
              <path d="M10 22 L16 10 L22 22 Z" fill="none" stroke="white" stroke-width="2" stroke-linejoin="round"/>
              <circle cx="16" cy="14" r="2" fill="white"/>
              <defs>
                <linearGradient id="reg-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#3B82F6"/>
                  <stop offset="100%" stop-color="#2563EB"/>
                </linearGradient>
              </defs>
            </svg>
            <span class="text-2xl font-bold text-white tracking-tight">LUMINA</span>
          </a>
          <h1 class="text-white text-2xl font-semibold tracking-tight">
            Crea tu cuenta
            <span class="ml-2 inline-block text-xs font-bold bg-blue-500 text-white px-2.5 py-0.5 rounded-full align-middle tracking-wide uppercase">
              Gratis
            </span>
          </h1>
          <p class="text-slate-300 mt-1.5 text-sm">
            Aprende con los mejores de la industria
          </p>
        </div>

        <!-- Tarjeta de registro (Dark Slate) -->
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

            <!-- Nombre + Apellido (en fila) -->
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label for="reg-first-name" class="block text-sm font-medium text-slate-200 mb-1.5">Nombre</label>
                <input
                  id="reg-first-name"
                  type="text"
                  formControlName="firstName"
                  placeholder="María"
                  autocomplete="given-name"
                  class="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                />
                @if (f['firstName'].invalid && f['firstName'].touched) {
                  <span class="text-xs text-red-400 mt-1 block">
                    @if (f['firstName'].errors?.['required']) { Requerido. }
                    @else if (f['firstName'].errors?.['minlength']) { Mín. 2 chars. }
                  </span>
                }
              </div>
              <div>
                <label for="reg-last-name" class="block text-sm font-medium text-slate-200 mb-1.5">Apellido</label>
                <input
                  id="reg-last-name"
                  type="text"
                  formControlName="lastName"
                  placeholder="García"
                  autocomplete="family-name"
                  class="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                />
                @if (f['lastName'].invalid && f['lastName'].touched) {
                  <span class="text-xs text-red-400 mt-1 block">
                    @if (f['lastName'].errors?.['required']) { Requerido. }
                  </span>
                }
              </div>
            </div>

            <!-- Email -->
            <div class="mb-4">
              <label for="reg-email" class="block text-sm font-medium text-slate-200 mb-1.5">Correo electrónico</label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <input
                  id="reg-email"
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

            <!-- Password + strength meter -->
            <div class="mb-4">
              <label for="reg-password" class="block text-sm font-medium text-slate-200 mb-1.5">Contraseña</label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-width="1.5"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input
                  id="reg-password"
                  type="password"
                  formControlName="password"
                  placeholder="Mínimo 8 caracteres"
                  autocomplete="new-password"
                  class="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                />
              </div>
              <!-- Strength indicator -->
              @if (f['password'].value) {
                <div class="mt-2">
                  <div class="flex gap-1.5 mb-1">
                    @for (segment of [1, 2, 3, 4]; track segment) {
                      <div class="flex-1 h-1 rounded-full transition-colors duration-300"
                           [class.bg-red-400]="passwordStrength() === 'weak' && segment === 1"
                           [class.bg-amber-400]="passwordStrength() === 'medium' && segment <= 2"
                           [class.bg-green-400]="passwordStrength() === 'strong' && segment <= 4"
                           [class.bg-slate-700]="!isSegmentActive(segment)">
                      </div>
                    }
                  </div>
                  <p class="text-xs"
                     [class.text-red-400]="passwordStrength() === 'weak'"
                     [class.text-amber-400]="passwordStrength() === 'medium'"
                     [class.text-green-400]="passwordStrength() === 'strong'">
                    {{ strengthLabel() }}
                  </p>
                </div>
              }
              @if (f['password'].invalid && f['password'].touched) {
                <span class="text-xs text-red-400 mt-1 block">
                  @if (f['password'].errors?.['required']) { La contraseña es obligatoria. }
                  @else if (f['password'].errors?.['minlength']) { Mínimo 8 caracteres. }
                </span>
              }
            </div>

            <!-- Confirm password -->
            <div class="mb-5">
              <label for="reg-confirm" class="block text-sm font-medium text-slate-200 mb-1.5">Confirmar contraseña</label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors"
                     [class.text-slate-400]="!passwordsMatch()"
                     [class.text-green-400]="passwordsMatch() && !!f['confirmPassword'].value"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     aria-hidden="true">
                  @if (passwordsMatch() && f['confirmPassword'].value) {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  } @else {
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-width="1.5"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 11V7a5 5 0 0110 0v4"/>
                  }
                </svg>
                <input
                  id="reg-confirm"
                  type="password"
                  formControlName="confirmPassword"
                  placeholder="Repite tu contraseña"
                  autocomplete="new-password"
                  class="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                />
              </div>
              @if (form.errors?.['passwordsMismatch'] && f['confirmPassword'].touched) {
                <span class="text-xs text-red-400 mt-1 block">Las contraseñas no coinciden.</span>
              }
            </div>

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
                Creando tu cuenta...
              } @else {
                Crear cuenta gratis
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              }
            </button>

          </form>

          <!-- Terms -->
          <p class="text-center text-xs text-slate-400 mt-4 leading-relaxed">
            Al registrarte aceptas los
            <a routerLink="/legal/terms" class="text-blue-400 hover:text-blue-300 transition-colors">
              Términos de servicio
            </a>
            y la
            <a routerLink="/legal/privacy" class="text-blue-400 hover:text-blue-300 transition-colors">
              Política de privacidad
            </a>
          </p>

          <p class="text-center text-sm text-slate-400 mt-5">
            ¿Ya tienes cuenta?
            <a routerLink="/auth/login" class="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Inicia sesión
            </a>
          </p>

        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  errorMsg = signal('');

  form = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch }
  );

  get f() {
    return this.form.controls;
  }

  // ─── Computed: fortaleza de contraseña ─────────────────────────────────────
  readonly passwordStrength = computed<PasswordStrength>(() => {
    const pwd = this.f['password'].value ?? '';
    if (!pwd) return 'empty';
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    const score = [hasUpper, hasLower, hasNumber, hasSpecial, pwd.length >= 12].filter(Boolean).length;
    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
  });

  readonly strengthLabel = computed(() => {
    const map: Record<PasswordStrength, string> = {
      empty: '',
      weak: 'Débil — añade mayúsculas y números',
      medium: 'Media — añade un símbolo especial',
      strong: 'Fuerte — ¡excelente contraseña!',
    };
    return map[this.passwordStrength()];
  });

  /** Indica si el segmento N del indicador debe estar activo */
  isSegmentActive(segment: number): boolean {
    const strength = this.passwordStrength();
    if (strength === 'weak') return segment === 1;
    if (strength === 'medium') return segment <= 2;
    if (strength === 'strong') return segment <= 4;
    return false;
  }

  /** True si las contraseñas coinciden y el campo confirmación no está vacío */
  passwordsMatch(): boolean {
    return !this.form.errors?.['passwordsMismatch'] && !!this.f['confirmPassword'].value;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    const { firstName, lastName, email, password } = this.form.getRawValue();
    const name = `${firstName} ${lastName}`.trim();

    this.auth.register({ name, email: email!, password: password! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/courses']);
      },
      error: (err: { status: number }) => {
        this.loading.set(false);
        this.errorMsg.set(err.status === 409 ? 'Este correo ya está registrado.' : 'Ocurrió un error. Inténtalo de nuevo.');
      },
    });
  }
}