// core/services/auth.service.ts
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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly _currentUser = signal<User | null>(null);
  private readonly _token = signal<string | null>(
    this.isBrowser ? localStorage.getItem('lumina_token') : null
  );

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  login(email: string, password: string) {
    return this.api.post<AuthResponse>('auth/login', { email, password }).pipe(
      tap(({ token, user }) => {
        if (this.isBrowser) {
          localStorage.setItem('lumina_token', token);
        }
        this._token.set(token);
        this._currentUser.set(user);
      })
    );
  }

  register(data: { name: string; email: string; password: string }) {
    return this.api.post<AuthResponse>('auth/register', data).pipe(
      tap(({ token, user }) => {
        if (this.isBrowser) {
          localStorage.setItem('lumina_token', token);
        }
        this._token.set(token);
        this._currentUser.set(user);
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
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