// features/auth/login-success/login-success.component.ts
//
// Destino del redirect OAuth del backend:
//   http://localhost:4200/login-success?token=XXX
//
// Problema con router.navigate + SSR:
//   router.navigate(['/courses']) puede dispararse primero en el contexto SSR
//   del servidor, donde localStorage no existe y el guard ve
//   isAuthenticated()=false → redirige a login.
//
// Solución: window.location.replace('/courses')
//   Fuerza una recarga completa de la página. El cliente Angular arranca
//   de cero, AuthService lee el token de localStorage en su constructor y
//   el guard ve isAuthenticated()=true correctamente.

import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-success',
  standalone: true,
  template: `
    <div style="
      min-height: 100vh;
      background: #0A0F1A;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      font-family: Inter, system-ui, sans-serif;
    ">
      @if (error()) {
        <p style="color:#f87171; font-size:1rem;">{{ error() }}</p>
        <a href="/auth/login" style="color:#60a5fa; font-size:0.875rem;">
          Volver al login
        </a>
      } @else {
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none"
             style="animation: spin 0.8s linear infinite;">
          <circle cx="24" cy="24" r="20" stroke="#1e3a5f" stroke-width="4"/>
          <path d="M24 4a20 20 0 0 1 20 20" stroke="#3B82F6" stroke-width="4"
                stroke-linecap="round"/>
          <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
        </svg>
        <p style="color:#94a3b8; font-size:0.9rem;">Iniciando sesión…</p>
      }
    </div>
  `,
})
export class LoginSuccessComponent implements OnInit {
  private readonly route      = inject(ActivatedRoute);
  private readonly router     = inject(Router);
  private readonly auth       = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);

  error = signal('');

  ngOnInit(): void {
    // Solo ejecutar en el navegador — en SSR no hay localStorage ni window.
    if (!isPlatformBrowser(this.platformId)) return;

    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.error.set('No se recibió un token válido. Intenta iniciar sesión de nuevo.');
      return;
    }

    // 1. Persiste el token en localStorage Y actualiza el signal de AuthService.
    this.auth.acceptExternalToken(token);

    // 2. Navegar a courses en el cliente
    this.router.navigate(['/courses']);
  }
}
