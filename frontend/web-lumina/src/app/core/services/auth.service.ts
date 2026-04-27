
import {
  Injectable, inject, signal, computed, PLATFORM_ID, OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError, switchMap, filter, take } from 'rxjs/operators';

import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { ToastService } from './toast.service';

// ─── Constants ────────────────────────────────────────────────────────────
const TOKEN_KEY = 'codeforge_token';
const REFRESH_KEY = 'codeforge_refresh';

// Refresh when token has less than this time remaining (ms)
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

// ─── Types ────────────────────────────────────────────────────────────────
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface RefreshResponse {
  accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // ─── State ──────────────────────────────────────────────────────────────
  private readonly _currentUser = signal<User | null>(null);
  private readonly _token = signal<string | null>(
    this.isBrowser ? sessionStorage.getItem(TOKEN_KEY) : null
  );

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => {
    const token = this._token();
    if (!token) return false;
    // Also verify token hasn't expired locally (avoids pointless API calls)
    return !this.isTokenExpired(token);
  });

  /** True sólo cuando tenemos el objeto User completo cargado desde el backend */
  readonly hasProfileData = computed(() => this._currentUser() !== null);

  // ─── Refresh token race-condition prevention ─────────────────────────────
  // BehaviorSubject(true) = "not currently refreshing"
  // BehaviorSubject(false) = "refresh in progress — queue callers"
  private readonly refreshReady$ = new BehaviorSubject<boolean>(true);
  private isRefreshing = false;

  // ─── Auto-logout timer ───────────────────────────────────────────────────
  private logoutTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // On app boot: if we have a token, schedule its expiry handler and restore user.
    // IMPORTANTE: loadCurrentUser() hace una petición HTTP que pasa por el
    // authInterceptor, el cual intenta inyectar AuthService. Si llamamos esto
    // directamente en el constructor (mientras AuthService se está creando),
    // Angular detecta una dependencia circular (NG0200).
    // La solución: diferir con setTimeout(0) para que el constructor termine
    // de ejecutarse primero y Angular marque AuthService como listo.
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
    }

    const token = this._token();
    if (token && !this.isTokenExpired(token)) {
      this.scheduleTokenExpiry(token);
      // Defer HTTP call until after Angular fully constructs AuthService
      setTimeout(() => this.loadCurrentUser().subscribe(), 0);
    } else if (token) {
      // Token expirado al arrancar → limpiar
      this.clearSession();
    }
  }

  ngOnDestroy(): void {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);
  }

  // ─── Public API ─────────────────────────────────────────────────────────

  /**
   * Carga el perfil del usuario autenticado desde /auth/me y actualiza _currentUser.
   * Si falla (token inválido), cierra la sesión automáticamente.
   */
  loadCurrentUser(): Observable<User> {
    return this.api.get<User>('auth/me').pipe(
      tap(user => this._currentUser.set(user)),
      catchError(err => {
        this.clearSession();
        return throwError(() => err);
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/login', { email, password }).pipe(
      tap(res => this.persistSession(res)),
      catchError(err => throwError(() => err))
    );
  }

  register(data: { name: string; email: string; password: string; role_id: number }): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/register', data).pipe(
      tap(res => this.persistSession(res))
    );
  }

  logout(): void {
    // Best-effort server-side token invalidation (fire and forget)
    const refreshToken = this.isBrowser
      ? localStorage.getItem(REFRESH_KEY)
      : null;

    if (refreshToken) {
      this.http
        .post(`${environment.apiUrl}/auth/logout`, { refreshToken })
        .subscribe({ error: () => { /* ignore — local cleanup already done */ } });
    }

    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this._token();
  }

  /**
   * Persiste un token recibido externamente (login OAuth o respuesta Sanctum
   * con clave 'token' en lugar de 'accessToken') y actualiza el signal interno.
   * Llamar esto en lugar de setear localStorage directamente, para que el guard
   * vea isAuthenticated() = true inmediatamente sin recargar la página.
   */
  acceptExternalToken(token: string): void {
    if (this.isBrowser) sessionStorage.setItem(TOKEN_KEY, token);
    this._token.set(token);
    this.scheduleTokenExpiry(token);
  }

  /**
   * Actualiza el signal de usuario actual sin recargar la página.
   * Útil después de guardar cambios de perfil desde el backend.
   */
  acceptExternalUser(user: User): void {
    this._currentUser.set(user);
  }

  // ─── Token refresh (called by auth.interceptor) ──────────────────────────
  /**
   * Refreshes the access token using the stored refresh token.
   * Handles concurrent callers: only ONE refresh request fires;
   * others queue and receive the new token once it's available.
   */
  refreshAccessToken(): Observable<string> {
    if (this.isRefreshing) {
      // Another call is already refreshing — wait for it
      return this.refreshReady$.pipe(
        filter(ready => ready),
        take(1),
        switchMap(() => {
          const token = this._token();
          if (!token) return throwError(() => new Error('No token after refresh'));
          return [token];
        })
      );
    }

    this.isRefreshing = true;
    this.refreshReady$.next(false);

    const refreshToken = this.isBrowser
      ? sessionStorage.getItem(REFRESH_KEY)
      : null;

    if (!refreshToken) {
      this.handleRefreshFailure();
      return throwError(() => new Error('No refresh token'));
    }

    return this.http
      .post<RefreshResponse>(
        `${environment.apiUrl}/auth/refresh`,
        { refreshToken }
      )
      .pipe(
        tap(res => {
          this.storeToken(res.accessToken);
          this.isRefreshing = false;
          this.refreshReady$.next(true);
        }),
        switchMap(res => [res.accessToken]),
        catchError(err => {
          this.handleRefreshFailure();
          return throwError(() => err);
        })
      );
  }

  needsRefresh(): boolean {
    const token = this._token();
    if (!token) return false;
    const expiry = this.parseJwtExpiry(token);
    if (!expiry) return false;
    return expiry - Date.now() < REFRESH_THRESHOLD_MS;
  }

  // ─── Private helpers ────────────────────────────────────────────────────

  private persistSession(res: AuthResponse): void {
    this.storeToken(res.accessToken);

    if (this.isBrowser) {
      // SECURITY NOTE: Ideally, refreshToken should be in an HttpOnly cookie
      // set by the server. Since we don't control the backend here, we store
      // it in sessionStorage. Production consideration: move to HttpOnly cookie.
      sessionStorage.setItem(REFRESH_KEY, res.refreshToken);
    }

    this._currentUser.set(res.user);
    this.scheduleTokenExpiry(res.accessToken);
  }

  private storeToken(token: string): void {
    if (this.isBrowser) sessionStorage.setItem(TOKEN_KEY, token);
    this._token.set(token);
    this.scheduleTokenExpiry(token);
  }

  private clearSession(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_KEY);
    }
    this._token.set(null);
    this._currentUser.set(null);
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  private scheduleTokenExpiry(token: string): void {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);

    const expiry = this.parseJwtExpiry(token);
    if (!expiry) return;

    const msUntilExpiry = expiry - Date.now();
    if (msUntilExpiry <= 0) {
      this.clearSession();
      return;
    }

    this.logoutTimer = setTimeout(() => {
      this.clearSession();
      // No redirigir automáticamente para permitir que el usuario siga como invitado
      // ToastService is injected lazily here to avoid circular deps
      inject(ToastService)?.warning('Tu sesión expiró. Puedes seguir navegando como invitado.');
    }, msUntilExpiry);
  }

  private handleRefreshFailure(): void {
    this.isRefreshing = false;
    this.refreshReady$.next(true);
    this.clearSession();
    // No redirigir automáticamente al login
  }

  /**
   * Parses a JWT payload without external dependencies.
   * Returns expiry timestamp in milliseconds, or null if unparseable.
   */
  private parseJwtExpiry(token: string): number | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded.exp ? decoded.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const expiry = this.parseJwtExpiry(token);
    if (!expiry) return false; // No expiry claim → treat as valid
    return Date.now() >= expiry;
  }
}