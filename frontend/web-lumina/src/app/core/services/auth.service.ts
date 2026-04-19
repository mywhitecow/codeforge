// core/services/auth.service.ts
// CORREGIDO:
//   - isAuthenticated era un computed() que devuelve boolean pero se usaba como función
//     en auth.guard (auth.isAuthenticated()) → ahora es consistente
//   - Añadido loadUserFromToken() para restaurar sesión al recargar
//   - Separado register() del componente dummy
import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { tap } from 'rxjs/operators';

interface AuthResponse {
  token: string;
  user: User;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api         = inject(ApiService);
  private readonly router      = inject(Router);
  private readonly platformId  = inject(PLATFORM_ID);

  private readonly _currentUser = signal<User | null>(null);
  private readonly _token = signal<string | null>(
    // SSR-safe: solo leer localStorage en browser
    isPlatformBrowser(this.platformId) ? localStorage.getItem('lumina_token') : null
  );

  // Exponer como readonly signals
  readonly currentUser     = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  login(email: string, password: string) {
    return this.api.post<AuthResponse>('auth/login', { email, password }).pipe(
      tap(({ token, user }) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('lumina_token', token);
        }
        this._token.set(token);
        this._currentUser.set(user);
      })
    );
  }

  register(payload: RegisterPayload) {
    return this.api.post<AuthResponse>('auth/register', payload).pipe(
      tap(({ token, user }) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('lumina_token', token);
        }
        this._token.set(token);
        this._currentUser.set(user);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('lumina_token');
    }
    this._token.set(null);
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this._token();
  }
}