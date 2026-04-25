// features/user-profile/profile/profile.component.ts
import {
  Component,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="page-container max-w-3xl">

      <h1 class="section-title">Mi perfil</h1>

      @if (auth.currentUser(); as user) {

        <!-- Avatar + nombre -->
        <div class="card p-6 flex items-center gap-5 mb-6">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br
                      from-sky-400 to-blue-600 flex items-center
                      justify-center text-white text-2xl font-bold shrink-0">
            {{ initial(user.name) }}
          </div>
          <div>
            <h2 class="text-xl font-semibold text-slate-100">{{ user.name }}</h2>
            <p class="text-slate-400 text-sm mt-0.5">{{ user.email }}</p>
            <p class="text-slate-500 text-xs mt-1">
              Miembro desde {{ formatDate(user.createdAt) }}
            </p>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="card p-5 text-center">
            <p class="text-3xl font-bold text-sky-400">
              {{ user.enrolledCourseIds.length }}
            </p>
            <p class="text-slate-400 text-sm mt-1">Cursos inscritos</p>
          </div>
          <div class="card p-5 text-center">
            <p class="text-3xl font-bold text-green-400">0</p>
            <p class="text-slate-400 text-sm mt-1">Completados</p>
          </div>
          <div class="card p-5 text-center">
            <p class="text-3xl font-bold text-amber-400">0</p>
            <p class="text-slate-400 text-sm mt-1">Certificados</p>
          </div>
        </div>

        <!-- Acciones -->
        <div class="card p-6">
          <h3 class="font-semibold text-slate-200 mb-4">Cuenta</h3>
          <div class="space-y-3">
            <a routerLink="/courses"
               class="flex items-center justify-between p-3 rounded-xl
                      hover:bg-white/5 transition-colors group">
              <span class="text-slate-300 group-hover:text-white text-sm">
                Explorar más cursos
              </span>
              <svg class="w-4 h-4 text-slate-500 group-hover:text-sky-400"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
            <button
              (click)="auth.logout()"
              class="w-full flex items-center justify-between p-3 rounded-xl
                     hover:bg-red-900/20 transition-colors group text-left"
            >
              <span class="text-red-400 group-hover:text-red-300 text-sm font-medium">
                Cerrar sesión
              </span>
              <svg class="w-4 h-4 text-red-500" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0
                         01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3
                         3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>

      } @else {

        <!-- Usuario no autenticado (no debería llegar aquí por el guard) -->
        <div class="text-center py-20">
          <p class="text-slate-400 mb-4">No has iniciado sesión.</p>
          <a routerLink="/auth/login" class="btn btn-primary">
            Iniciar sesión
          </a>
        </div>

      }

    </div>
  `,
})
export class ProfileComponent {
  readonly auth = inject(AuthService);

  initial(name: string): string {
    return name?.charAt(0).toUpperCase() ?? '?';
  }

  formatDate(isoString: string): string {
    try {
      return new Date(isoString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
      });
    } catch {
      return '';
    }
  }
}