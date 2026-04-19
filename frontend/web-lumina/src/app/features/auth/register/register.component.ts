// features/auth/register/register.component.ts
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
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Validador personalizado: confirmar contraseñas
function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const pass    = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pass === confirm ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-[#0B172C] to-[#0F2040]
                flex items-center justify-center px-4 py-12">

      <div class="w-full max-w-md">

        <!-- Logo -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-2.5">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" fill="url(#reg-grad)" />
              <path d="M10 22 L16 10 L22 22 Z" fill="none" stroke="white"
                    stroke-width="2" stroke-linejoin="round" />
              <circle cx="16" cy="14" r="2" fill="white" />
              <defs>
                <linearGradient id="reg-grad" x1="0" y1="0" x2="32" y2="32"
                                gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stop-color="#38BDF8" />
                  <stop offset="100%" stop-color="#0EA5E9" />
                </linearGradient>
              </defs>
            </svg>
            <span class="text-2xl font-bold text-gradient-blue">LUMINA</span>
          </a>
          <h1 class="text-white text-2xl font-semibold mt-4">Crea tu cuenta</h1>
          <p class="text-gray-400 mt-1 text-sm">Empieza a aprender hoy, gratis</p>
        </div>

        <div class="bg-white rounded-2xl p-8 shadow-2xl">

          @if (errorMsg()) {
            <div class="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg
                        text-red-700 text-sm flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" class="shrink-0">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ errorMsg() }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>

            <!-- Nombre completo -->
            <div class="form-field mb-4">
              <label for="reg-name">Nombre completo</label>
              <input
                id="reg-name"
                type="text"
                formControlName="name"
                placeholder="María García"
                autocomplete="name"
              />
              @if (f['name'].invalid && f['name'].touched) {
                <span class="form-error">
                  @if (f['name'].errors?.['required']) { El nombre es obligatorio. }
                  @else if (f['name'].errors?.['minlength']) { Mínimo 2 caracteres. }
                </span>
              }
            </div>

            <!-- Email -->
            <div class="form-field mb-4">
              <label for="reg-email">Correo electrónico</label>
              <input
                id="reg-email"
                type="email"
                formControlName="email"
                placeholder="tu@correo.com"
                autocomplete="email"
              />
              @if (f['email'].invalid && f['email'].touched) {
                <span class="form-error">
                  @if (f['email'].errors?.['required']) { El correo es obligatorio. }
                  @else if (f['email'].errors?.['email']) { Ingresa un correo válido. }
                </span>
              }
            </div>

            <!-- Password -->
            <div class="form-field mb-4">
              <label for="reg-password">Contraseña</label>
              <input
                id="reg-password"
                type="password"
                formControlName="password"
                placeholder="••••••••"
                autocomplete="new-password"
              />
              @if (f['password'].invalid && f['password'].touched) {
                <span class="form-error">
                  @if (f['password'].errors?.['required']) { La contraseña es obligatoria. }
                  @else if (f['password'].errors?.['minlength']) { Mínimo 8 caracteres. }
                </span>
              }
            </div>

            <!-- Confirm password -->
            <div class="form-field mb-6">
              <label for="reg-confirm">Confirmar contraseña</label>
              <input
                id="reg-confirm"
                type="password"
                formControlName="confirmPassword"
                placeholder="••••••••"
                autocomplete="new-password"
              />
              @if (form.errors?.['passwordsMismatch'] && f['confirmPassword'].touched) {
                <span class="form-error">Las contraseñas no coinciden.</span>
              }
            </div>

            <button
              type="submit"
              class="btn btn-primary w-full justify-center py-3"
              [disabled]="loading()"
            >
              @if (loading()) {
                <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Creando cuenta...
              } @else {
                Crear cuenta gratis
              }
            </button>
          </form>

          <p class="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?
            <a routerLink="/auth/login"
               class="text-sky-500 font-medium hover:text-sky-600 transition-colors">
              Inicia sesión
            </a>
          </p>

        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private readonly fb     = inject(FormBuilder);
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);

  loading  = signal(false);
  errorMsg = signal('');

  form = this.fb.group(
    {
      name:            ['', [Validators.required, Validators.minLength(2)]],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch }
  );

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    const { name, email, password } = this.form.getRawValue();

    this.auth.register({ name: name!, email: email!, password: password! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/courses']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(
          err.status === 409
            ? 'Este correo ya está registrado.'
            : 'Ocurrió un error. Inténtalo de nuevo.'
        );
      },
    });
  }
}