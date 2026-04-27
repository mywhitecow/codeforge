import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../courses/services/course.service';
import { ToastService } from '../../../core/services/toast.service';
import { PermissionService } from '../../../core/services/permission.service';

@Component({
  selector: 'app-instructor-course-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="page-container max-w-4xl">
      <div class="flex items-center gap-4 mb-8">
        <button (click)="goBack()" class="btn btn-ghost px-3">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </button>
        <h1 class="section-title mb-0">{{ isEditMode() ? 'Editar Curso' : 'Crear Nuevo Curso' }}</h1>
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
          Error al cargar los datos del curso.
        </div>
      } @else {
        <div class="card p-8">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Título -->
              <div class="space-y-2 md:col-span-2">
                <label class="block text-sm font-medium text-slate-300">Título del Curso</label>
                <input 
                  type="text" 
                  formControlName="title"
                  placeholder="Ej: Curso Maestro de Angular 18"
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                >
                @if (f['title'].touched && f['title'].invalid) {
                  <p class="text-red-400 text-xs">El título es requerido.</p>
                }
              </div>

              <!-- Descripción -->
              <div class="space-y-2 md:col-span-2">
                <label class="block text-sm font-medium text-slate-300">Descripción Detallada</label>
                <textarea 
                  formControlName="description"
                  rows="4"
                  placeholder="Explica qué aprenderán los estudiantes..."
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all resize-none"
                ></textarea>
                @if (f['description'].touched && f['description'].invalid) {
                  <p class="text-red-400 text-xs">La descripción es requerida.</p>
                }
              </div>

              <!-- Categoría -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">Categoría</label>
                <select 
                  formControlName="category_id"
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all appearance-none"
                >
                  <option [value]="null" disabled selected>Selecciona una categoría</option>
                  <!-- En un caso real, estas vendrían de una API -->
                  <option [value]="1">Desarrollo Web</option>
                  <option [value]="2">Programación Backend</option>
                  <option [value]="3">Ciencia de Datos</option>
                  <option [value]="4">Ciberseguridad</option>
                  <option [value]="5">Diseño UI/UX</option>
                </select>
                @if (f['category_id'].touched && f['category_id'].invalid) {
                  <p class="text-red-400 text-xs">Debes seleccionar una categoría.</p>
                }
              </div>

              <!-- Nivel -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">Nivel</label>
                <select 
                  formControlName="level"
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all appearance-none"
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>

              <!-- Duración -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">Duración (Horas)</label>
                <input 
                  type="number" 
                  formControlName="duration"
                  min="1"
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                >
                @if (f['duration'].touched && f['duration'].invalid) {
                  <p class="text-red-400 text-xs">Ingresa una duración válida.</p>
                }
              </div>

              <!-- Precio -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">Precio (USD)</label>
                <input 
                  type="number" 
                  formControlName="price"
                  min="0"
                  step="0.01"
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                >
                <p class="text-xs text-slate-500 mt-1">Pon 0 para que el curso sea gratuito.</p>
                @if (f['price'].touched && f['price'].invalid) {
                  <p class="text-red-400 text-xs">El precio es requerido.</p>
                }
              </div>

              <!-- URL de Imagen -->
              <div class="space-y-2 md:col-span-2">
                <label class="block text-sm font-medium text-slate-300">URL de Portada (Opcional)</label>
                <input 
                  type="url" 
                  formControlName="thumbnail_url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                >
              </div>

            </div>

            <!-- Acciones -->
            <div class="flex justify-end gap-3 pt-6 border-t border-slate-700/50">
              <button type="button" (click)="goBack()" class="btn btn-ghost">
                Cancelar
              </button>
              <button 
                type="submit" 
                [disabled]="form.invalid || saving()"
                class="btn btn-primary min-w-[150px] flex justify-center"
              >
                @if (saving()) {
                  <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                } @else {
                  {{ isEditMode() ? 'Guardar Cambios' : 'Crear Curso' }}
                }
              </button>
            </div>
          </form>
        </div>
        
        <!-- Zona de Peligro -->
        @if (isEditMode()) {
          <div class="mt-8 border border-red-500/30 rounded-2xl p-6 bg-red-500/5">
            <h3 class="text-red-400 font-semibold mb-2">Eliminar Curso</h3>
            <p class="text-sm text-slate-400 mb-4">
              Eliminar este curso lo ocultará permanentemente de la plataforma para nuevos estudiantes.
            </p>
            <button 
              type="button" 
              (click)="deleteCourse()"
              class="px-4 py-2 rounded-xl text-sm font-medium border border-red-500 text-red-400 hover:bg-red-500/10 transition-all"
            >
              Eliminar Curso
            </button>
          </div>
        }
      }
    </div>
  `,
})
export class InstructorCourseFormComponent implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly perms = inject(PermissionService);

  courseId = signal<string | null>(null);
  isEditMode = signal(false);
  
  loading = signal(false);
  error = signal(false);
  saving = signal(false);

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category_id: [null, Validators.required],
    level: ['beginner', Validators.required],
    duration: [0, [Validators.required, Validators.min(1)]],
    price: [0, [Validators.required, Validators.min(0)]],
    thumbnail_url: ['']
  });

  get f() { return this.form.controls; }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.courseId.set(id);
      this.loadCourse(id);
    }
  }

  loadCourse(id: string) {
    this.loading.set(true);
    this.courseService.getById(id).subscribe({
      next: (course: any) => {
        this.form.patchValue({
          title: course.title,
          description: course.description,
          category_id: course.category_id,
          level: course.level,
          duration: course.duration,
          price: course.price,
          thumbnail_url: course.thumbnail_url || course.thumbnailUrl || ''
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
        this.toast.error('No se pudo cargar el curso');
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    
    this.saving.set(true);
    const formValue = this.form.value;
    
    const payload = {
      title: formValue.title,
      description: formValue.description,
      category_id: Number(formValue.category_id),
      level: formValue.level,
      duration: Number(formValue.duration),
      price: Number(formValue.price),
      thumbnail_url: formValue.thumbnail_url
    };

    if (this.isEditMode() && this.courseId()) {
      this.courseService.update(this.courseId()!, payload).subscribe({
        next: () => {
          this.toast.success('Curso actualizado correctamente');
          this.saving.set(false);
          this.goBack();
        },
        error: (err: any) => {
          this.saving.set(false);
          this.toast.error(err.error?.message || 'Error al actualizar el curso');
        }
      });
    } else {
      this.courseService.create(payload).subscribe({
        next: () => {
          this.toast.success('Curso creado exitosamente');
          this.saving.set(false);
          this.goBack();
        },
        error: (err: any) => {
          this.saving.set(false);
          this.toast.error(err.error?.message || 'Error al crear el curso');
        }
      });
    }
  }

  deleteCourse() {
    if (confirm('¿Estás seguro que deseas eliminar este curso? Esta acción no se puede deshacer.')) {
      if (this.courseId()) {
        this.courseService.delete(this.courseId()!).subscribe({
          next: () => {
            this.toast.success('Curso eliminado exitosamente');
            this.goBack();
          },
          error: () => {
            this.toast.error('Error al eliminar el curso');
          }
        });
      }
    }
  }

  goBack() {
    if (this.perms.isAdmin()) {
      this.router.navigate(['/admin/courses']);
    } else {
      this.router.navigate(['/instructor/courses']);
    }
  }
}
