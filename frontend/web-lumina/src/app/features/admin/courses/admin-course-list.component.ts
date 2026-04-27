import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../courses/services/course.service';
import { Course } from '../../../core/models/course.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-course-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-container">
      <div class="flex justify-between items-center mb-8">
        <h1 class="section-title mb-0">Gestión de Cursos</h1>
        <a routerLink="/admin/courses/new" class="btn btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo Curso
        </a>
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
          Error al cargar cursos. Intenta nuevamente.
        </div>
      } @else {
        <div class="card overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-700/50 bg-slate-800/30 text-slate-300 text-sm">
                <th class="py-4 px-6 font-medium">Curso</th>
                <th class="py-4 px-6 font-medium">Nivel</th>
                <th class="py-4 px-6 font-medium">Precio</th>
                <th class="py-4 px-6 font-medium">Estado</th>
                <th class="py-4 px-6 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (course of courses(); track course.id) {
                <tr class="border-b border-slate-700/50 hover:bg-slate-800/20 transition-colors">
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                      @if (course.thumbnailUrl || $any(course).thumbnail_url) {
                        <img [src]="course.thumbnailUrl || $any(course).thumbnail_url" alt="Portada" class="w-10 h-10 rounded-md object-cover">
                      } @else {
                        <div class="w-10 h-10 rounded-md bg-slate-700 flex items-center justify-center text-xl">
                          📚
                        </div>
                      }
                      <div>
                        <div class="font-medium text-slate-200 line-clamp-1">{{ course.title }}</div>
                        <div class="text-xs text-slate-500">{{ course.durationHours || $any(course).duration }} horas</div>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-6 text-sm text-slate-400 capitalize">
                    {{ course.level }}
                  </td>
                  <td class="py-4 px-6 text-sm">
                    <span class="font-medium text-slate-300">
                      {{ course.price === 0 ? 'Gratis' : ('$' + course.price) }}
                    </span>
                  </td>
                  <td class="py-4 px-6">
                    @if ($any(course).is_active !== false) {
                      <span class="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Público
                      </span>
                    } @else {
                      <span class="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                        Oculto
                      </span>
                    }
                  </td>
                  <td class="py-4 px-6 text-right">
                    <a [routerLink]="['/admin/courses', course.id, 'edit']" class="btn btn-ghost btn-sm text-sky-400 hover:text-sky-300 hover:bg-sky-400/10">
                      Editar
                    </a>
                  </td>
                </tr>
              }
              
              @if (courses().length === 0) {
                <tr>
                  <td colspan="5" class="py-8 text-center text-slate-400">
                    No hay cursos registrados en la plataforma.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class AdminCourseListComponent implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly toast = inject(ToastService);

  courses = signal<Course[]>([]);
  loading = signal(true);
  error = signal(false);

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading.set(true);
    this.error.set(false);
    this.courseService.getAll().subscribe({
      next: (res) => {
        this.courses.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
        this.toast.error('Error al cargar la lista de cursos');
      }
    });
  }
}
