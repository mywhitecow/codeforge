// features/instructor/dashboard/instructor-dashboard.component.ts
import {
  Component,
  inject,
  signal,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../courses/services/course.service';
import { PermissionService } from '../../../core/services/permission.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="mb-8">
        <p class="text-sm text-sky-400 font-medium uppercase tracking-widest mb-1">
          Panel de instructor
        </p>
        <h1 class="text-3xl font-bold text-slate-100">
          Hola, {{ userName() }}
        </h1>
        <p class="text-slate-400 mt-1">
          Gestiona tus cursos y revisa el progreso de tus estudiantes.
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div class="card p-5">
          <p class="text-3xl font-bold text-slate-100">{{ myCourses().length }}</p>
          <p class="text-sm text-slate-400 mt-1">Mis cursos</p>
        </div>
        <div class="card p-5">
          <p class="text-3xl font-bold text-slate-100">—</p>
          <p class="text-sm text-slate-400 mt-1">Estudiantes totales</p>
        </div>
        <div class="card p-5 hidden lg:block">
          <p class="text-3xl font-bold text-slate-100">—</p>
          <p class="text-sm text-slate-400 mt-1">Rating promedio</p>
        </div>
      </div>

      <!-- Acciones principales -->
      <div class="flex gap-3 mb-8 flex-wrap">
        <a routerLink="/instructor/courses/new" class="btn btn-primary text-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4v16m8-8H4"/>
          </svg>
          Crear nuevo curso
        </a>
        <a routerLink="/instructor/courses" class="btn btn-ghost text-sm">
          Ver todos mis cursos →
        </a>
      </div>

      <!-- Mis cursos recientes -->
      <h2 class="section-title">Mis cursos recientes</h2>

      @if (loading()) {
        <div class="flex justify-center py-10">
          <svg class="animate-spin w-6 h-6 text-sky-500" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      }

      @if (!loading()) {
        @if (myCourses().length === 0) {
          <div class="card p-8 text-center">
            <p class="text-4xl mb-3">📝</p>
            <p class="text-slate-300 font-medium">Aún no tienes cursos creados</p>
            <p class="text-slate-500 text-sm mt-1 mb-4">
              Crea tu primer curso y empieza a llegar a más estudiantes.
            </p>
            <a routerLink="/instructor/courses/new" class="btn btn-primary text-sm">
              Crear mi primer curso
            </a>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            @for (course of myCourses().slice(0, 6); track course.id) {
              <div class="card p-4 flex gap-3">
                <div class="w-14 h-14 rounded-lg bg-slate-700 shrink-0 overflow-hidden">
                  @if (course.thumbnailUrl) {
                    <img [src]="course.thumbnailUrl" [alt]="course.title"
                         class="w-full h-full object-cover" />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center text-xl">📚</div>
                  }
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-slate-200 text-sm line-clamp-2 leading-snug">
                    {{ course.title }}
                  </p>
                  <div class="flex gap-2 mt-2">
                    <a [routerLink]="['/instructor/courses', course.id, 'edit']"
                       class="text-xs text-sky-400 hover:text-sky-300 transition-colors">
                      Editar
                    </a>
                    <span class="text-slate-700">·</span>
                    <a [routerLink]="['/instructor/courses', course.id, 'students']"
                       class="text-xs text-slate-400 hover:text-slate-200 transition-colors">
                      Estudiantes
                    </a>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      }

    </div>
  `,
})
export class InstructorDashboardComponent implements OnInit {
  private readonly auth    = inject(AuthService);
  private readonly courses = inject(CourseService);
  private readonly perms   = inject(PermissionService);

  myCourses = signal<Course[]>([]);
  loading   = signal(true);

  readonly userName = () => this.auth.currentUser()?.name?.split(' ')[0] ?? 'Instructor';

  ngOnInit(): void {
    // El filtrado por instructor se hace aquí o idealmente en el servicio
    // enviando el instructorId al backend.
    // Por ahora filtramos del lado cliente según los ownedCourseIds del usuario.
    const ownedIds = this.auth.currentUser()?.ownedCourseIds ?? [];

    this.courses.getAll().subscribe({
      next: (all) => {
        this.myCourses.set(
          this.perms.isAdmin()
            ? all                                      // Admin ve todos
            : all.filter(c => ownedIds.includes(c.id)) // Instructor solo los suyos
        );
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}