import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserService, PaginatedResponse } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="page-container">
      <div class="flex justify-between items-center mb-8">
        <h1 class="section-title mb-0">Gestión de Usuarios</h1>
        <!-- We won't add a create button here for now, usually users register themselves. -->
      </div>

      @if (loading()) {
        <div class="flex justify-center items-center py-20">
          <svg class="animate-spin w-8 h-8 text-sky-500" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      } @else if (error()) {
        <div class="card p-12 text-center text-red-400">
          Error al cargar usuarios. Intenta nuevamente.
        </div>
      } @else {
        <div class="card overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-700/50 bg-slate-800/30 text-slate-300 text-sm">
                <th class="py-4 px-6 font-medium">Nombre</th>
                <th class="py-4 px-6 font-medium">Email</th>
                <th class="py-4 px-6 font-medium">Rol</th>
                <th class="py-4 px-6 font-medium">Estado</th>
                <th class="py-4 px-6 font-medium">Registro</th>
                <th class="py-4 px-6 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr class="border-b border-slate-700/50 hover:bg-slate-800/20 transition-colors">
                  <td class="py-4 px-6 font-medium text-slate-200">
                    <div class="flex items-center gap-3">
                      @if (user.avatarUrl) {
                        <img [src]="user.avatarUrl" alt="Avatar" class="w-8 h-8 rounded-full">
                      } @else {
                        <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                          {{ user.name.charAt(0).toUpperCase() }}
                        </div>
                      }
                      {{ user.name }}
                    </div>
                  </td>
                  <td class="py-4 px-6 text-slate-400 text-sm">{{ user.email }}</td>
                  <td class="py-4 px-6 text-sm">
                    <span class="px-2 py-1 rounded-md text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
                      {{ user.role_id === 1 ? 'Admin' : (user.role_id === 3 ? 'Instructor' : 'Estudiante') }}
                    </span>
                  </td>
                  <td class="py-4 px-6">
                    @if (user.isActive) {
                      <span class="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Activo
                      </span>
                    } @else {
                      <span class="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                        Inactivo
                      </span>
                    }
                  </td>
                  <td class="py-4 px-6 text-slate-500 text-sm">
                    {{ user.createdAt | date:'shortDate' }}
                  </td>
                  <td class="py-4 px-6 text-right">
                    <a [routerLink]="['/admin/users', user.id]" class="btn btn-ghost btn-sm text-sky-400 hover:text-sky-300 hover:bg-sky-400/10">
                      Editar
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          
          <!-- Paginación Básica -->
          @if (totalPages() > 1) {
            <div class="p-4 border-t border-slate-700/50 flex justify-between items-center text-sm">
              <span class="text-slate-400">Página {{ currentPage() }} de {{ totalPages() }}</span>
              <div class="flex gap-2">
                <button 
                  [disabled]="currentPage() === 1"
                  (click)="changePage(currentPage() - 1)"
                  class="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  Anterior
                </button>
                <button 
                  [disabled]="currentPage() === totalPages()"
                  (click)="changePage(currentPage() + 1)"
                  class="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  Siguiente
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AdminUserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly toast = inject(ToastService);

  users = signal<(User & { role_id?: number, isActive?: boolean })[]>([]);
  loading = signal(true);
  error = signal(false);
  
  currentPage = signal(1);
  totalPages = signal(1);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(page: number = 1) {
    this.loading.set(true);
    this.error.set(false);
    this.userService.getUsers(page).subscribe({
      next: (res) => {
        // En Laravel las variables vienen en snake_case (ej. is_active), 
        // pero mapeamos al DTO que espera camelCase si es necesario,
        // aunque el backend puede devolver el raw json.
        // Asumiendo que el User object tiene is_active o isActive.
        const mappedUsers = res.data.map((u: any) => ({
          ...u,
          isActive: u.is_active !== undefined ? u.is_active : u.isActive,
          createdAt: u.created_at || u.createdAt
        }));
        this.users.set(mappedUsers);
        this.currentPage.set(res.current_page);
        this.totalPages.set(res.last_page);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
        this.toast.error('Error al cargar la lista de usuarios');
      }
    });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.loadUsers(page);
    }
  }
}
