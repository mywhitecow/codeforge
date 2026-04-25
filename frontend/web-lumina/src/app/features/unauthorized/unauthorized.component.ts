// features/unauthorized/unauthorized.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-container flex items-center justify-center min-h-[60vh]">
      <div class="card p-12 text-center max-w-md mx-auto">
        <p class="text-6xl mb-4">🔒</p>
        <h1 class="text-2xl font-bold text-slate-100 mb-2">Acceso denegado</h1>
        <p class="text-slate-400 mb-6">
          No tienes permisos para acceder a esta sección.
        </p>
        <a routerLink="/courses" class="btn btn-primary">Volver al inicio</a>
      </div>
    </div>
  `,
})
export class UnauthorizedComponent {}
