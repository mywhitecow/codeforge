import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-user-detail',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="page-container max-w-3xl">
      <div class="flex items-center gap-4 mb-8">
        <button (click)="goBack()" class="btn btn-ghost px-3">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </button>
        <h1 class="section-title mb-0">Editar Usuario</h1>
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
          Error al cargar los datos del usuario.
        </div>
      } @else {
        <div class="card p-8">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nombre -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">Nombre Completo</label>
                <input 
                  type="text" 
                  formControlName="name"
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                >
                @if (f['name'].touched && f['name'].invalid) {
                  <p class="text-red-400 text-xs">El nombre es requerido.</p>
                }
              </div>

              <!-- Email -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">Correo Electrónico</label>
                <input 
                  type="email" 
                  formControlName="email"
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                >
                @if (f['email'].touched && f['email'].invalid) {
                  <p class="text-red-400 text-xs">Ingresa un correo válido.</p>
                }
              </div>

              <!-- Rol -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">Rol del Usuario</label>
                <select 
                  formControlName="role_id"
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all appearance-none"
                >
                  <option [value]="1">Administrador</option>
                  <option [value]="2">Estudiante</option>
                  <option [value]="3">Instructor</option>
                </select>
              </div>

              <!-- Estado (Activo/Inactivo) -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">Estado de Cuenta</label>
                <select 
                  formControlName="is_active"
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all appearance-none"
                >
                  <option [value]="true">Activo (Permitir acceso)</option>
                  <option [value]="false">Inactivo (Bloquear acceso)</option>
                </select>
                <p class="text-xs text-slate-500 mt-1">Marcar como inactivo equivale a suspender la cuenta sin borrar sus datos.</p>
              </div>
            </div>

            <!-- Contraseña opcional -->
            <div class="space-y-2 pt-4 border-t border-slate-700/50">
              <label class="block text-sm font-medium text-slate-300">Cambiar Contraseña (Opcional)</label>
              <input 
                type="password" 
                formControlName="password"
                placeholder="Dejar en blanco para mantener la actual"
                class="w-full md:w-1/2 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              >
              @if (f['password'].touched && f['password'].invalid) {
                <p class="text-red-400 text-xs">La contraseña debe tener al menos 8 caracteres.</p>
              }
            </div>

            <!-- Acciones -->
            <div class="flex justify-end gap-3 pt-6 border-t border-slate-700/50">
              <button type="button" (click)="goBack()" class="btn btn-ghost">
                Cancelar
              </button>
              <button 
                type="submit" 
                [disabled]="form.invalid || saving()"
                class="btn btn-primary min-w-[120px] flex justify-center"
              >
                @if (saving()) {
                  <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                } @else {
                  Guardar Cambios
                }
              </button>
            </div>
          </form>
        </div>
        
        <!-- Zona de Peligro -->
        <div class="mt-8 border border-red-500/30 rounded-2xl p-6 bg-red-500/5">
          <h3 class="text-red-400 font-semibold mb-2">Zona de Peligro</h3>
          <p class="text-sm text-slate-400 mb-4">
            Puedes desactivar rápidamente la cuenta desde aquí. Si necesitas un borrado físico, deberás contactar al administrador de base de datos.
          </p>
          <button 
            type="button" 
            (click)="toggleActiveStatus()"
            class="px-4 py-2 rounded-xl text-sm font-medium border transition-all"
            [class.border-red-500]="isActive()"
            [class.text-red-400]="isActive()"
            [class.hover:bg-red-500/10]="isActive()"
            [class.border-emerald-500]="!isActive()"
            [class.text-emerald-400]="!isActive()"
            [class.hover:bg-emerald-500/10]="!isActive()"
          >
            {{ isActive() ? 'Desactivar Cuenta (Soft Delete)' : 'Reactivar Cuenta' }}
          </button>
        </div>
      }
    </div>
  `,
})
export class AdminUserDetailComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  userId = signal<string>('');
  loading = signal(true);
  error = signal(false);
  saving = signal(false);
  
  // Track status separately for the Danger Zone button
  isActive = signal(true);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role_id: [2, Validators.required],
    is_active: [true],
    password: ['', Validators.minLength(8)]
  });

  get f() { return this.form.controls; }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId.set(id);
      this.loadUser(id);
    } else {
      this.goBack();
    }
  }

  loadUser(id: string) {
    this.loading.set(true);
    this.userService.getUser(id).subscribe({
      next: (user: any) => {
        // Mapeo seguro de variables en snake_case a camelCase para el form
        const activeStatus = user.is_active !== undefined ? user.is_active : user.isActive;
        
        this.form.patchValue({
          name: user.name,
          email: user.email,
          role_id: user.role_id,
          is_active: activeStatus
        });
        
        this.isActive.set(activeStatus);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
        this.toast.error('No se pudo cargar el usuario');
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    
    this.saving.set(true);
    
    // Preparar payload, excluir password si está vacío
    const formValue = this.form.value;
    const payload: any = {
      name: formValue.name,
      email: formValue.email,
      role_id: Number(formValue.role_id),
      is_active: String(formValue.is_active) === 'true' // asegurar booleano
    };
    
    if (formValue.password) {
      payload.password = formValue.password;
    }

    this.userService.updateUser(this.userId(), payload).subscribe({
      next: () => {
        this.toast.success('Usuario actualizado correctamente');
        this.saving.set(false);
        this.goBack();
      },
      error: (err) => {
        this.saving.set(false);
        this.toast.error(err.error?.message || 'Error al actualizar usuario');
      }
    });
  }

  toggleActiveStatus() {
    if (confirm(`¿Estás seguro que deseas ${this.isActive() ? 'desactivar' : 'reactivar'} esta cuenta?`)) {
      const newStatus = !this.isActive();
      
      // Si estamos desactivando, podemos usar el endpoint destroy o simplemente un update parcial
      // Vamos a usar un update parcial para ser consistentes y permitir reactivación
      this.userService.updateUser(this.userId(), { is_active: newStatus }).subscribe({
        next: () => {
          this.isActive.set(newStatus);
          this.form.patchValue({ is_active: newStatus });
          this.toast.success(`Cuenta ${newStatus ? 'reactivada' : 'desactivada'} exitosamente`);
        },
        error: () => {
          this.toast.error('Error al cambiar el estado de la cuenta');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/users']);
  }
}
