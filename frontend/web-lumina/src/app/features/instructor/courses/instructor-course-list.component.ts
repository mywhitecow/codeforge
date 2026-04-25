// features/instructor/courses/instructor-course-list.component.ts
// ─────────────────────────────────────────────────────────────────────────────
// Lista de cursos del Instructor, filtrada por ownership.
// El Admin que accede a esta URL ve todos los cursos (útil para gestión cruzada).
// ─────────────────────────────────────────────────────────────────────────────
import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../courses/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { PermissionService } from '../../../core/services/permission.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-instructor-course-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="page-container">

      <div class="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <p class="text-sm text-sky-400 font-medium uppercase tracking-widest mb-1">
            Instructor
          </p>
          <h1 class="text-3xl font-bold text-slate-100">Mis Cursos</h1>
          <p class="text-slate-400 mt-1">
            {{ myCourses().length }} cursos creados
          </p>
        </div>
        <a routerLink="/instructor/courses/new" class="btn btn-primary">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo curso
        </a>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-20">
          <svg class="animate-spin w-8 h-8 text-sky-500" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      }

      @if (!loading()) {
        @if (myCourses().length === 0) {
          <div class="card p-12 text-center">
            <p class="text-5xl mb-4">🎓</p>
            <p class="text-xl font-semibold text-slate-200">Sin cursos todavía</p>
            <p class="text-slate-400 mt-2 mb-6 max-w-sm mx-auto">
              Crea tu primer curso y comienza a compartir tu conocimiento.
            </p>
            <a routerLink="/instructor/courses/new" class="btn btn-primary">
              Crear primer curso
            </a>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (course of myCourses(); track course.id) {
              <div class="card group">
                <!-- Thumbnail -->
                <div class="relative h-40 overflow-hidden bg-gradient-to-br
                            from-sky-900 to-slate-800">
                  @if (course.thumbnailUrl) {
                    <img [src]="course.thumbnailUrl" [alt]="course.title"
                         class="w-full h-full object-cover group-hover:scale-105
                                transition-transform duration-300" />
                  } @else {
                    <div class="flex items-center justify-center h-full text-4xl">📚</div>
                  }
                  <!-- Badge nivel -->
                  <span class="absolute top-2 left-2 px-2.5 py-0.5 rounded-md
                               text-xs font-semibold bg-black/50 text-white">
                    {{ levelLabel(course.level) }}
                  </span>
                </div>

                <!-- Info -->
                <div class="p-4">
                  <h3 class="font-semibold text-slate-100 text-sm line-clamp-2 leading-snug mb-1">
                    {{ course.title }}
                  </h3>
                  <div class="flex items-center justify-between mt-1">
                    <span class="text-xs text-slate-500">
                      {{ course.durationHours }}h · {{ course.totalReviews }} reseñas
                    </span>
                    <span class="font-bold text-sm text-slate-200">
                      @if (course.price === 0) {
                        <span class="text-green-500">Gratis</span>
                      } @else {
                        {{ '$' + course.price.toFixed(2) }}
                      }
                    </span>
                  </div>
                </div>

                <!-- Acciones -->
                <div class="border-t border-slate-700/50 px-4 py-3 flex gap-2">
                  <a [routerLink]="['/instructor/courses', course.id, 'edit']"
                     class="btn btn-ghost text-xs py-1.5 px-3 flex-1 justify-center">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0
                               002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828
                               15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Editar
                  </a>
                  <a [routerLink]="['/instructor/courses', course.id, 'students']"
                     class="btn btn-ghost text-xs py-1.5 px-3 flex-1 justify-center
                            text-slate-400 hover:text-white">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2
                               c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0
                               015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
                               m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0
                               3 3 0 016 0z"/>
                    </svg>
                    Estudiantes
                  </a>
                </div>
              </div>
            }
          </div>
        }
      }

    </div>
  `,
})
export class InstructorCourseListComponent implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly auth          = inject(AuthService);
  private readonly perms         = inject(PermissionService);

  private allCourses = signal<Course[]>([]);
  loading            = signal(true);

  // Computed: Admin ve todos; Instructor solo los suyos
  readonly myCourses = computed(() => {
    if (this.perms.isAdmin()) return this.allCourses();
    const ownedIds = this.auth.currentUser()?.ownedCourseIds ?? [];
    return this.allCourses().filter(c => ownedIds.includes(c.id));
  });

  ngOnInit(): void {
    this.courseService.getAll().subscribe({
      next:  c => { this.allCourses.set(c); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  levelLabel(level: string): string {
    const map: Record<string, string> = {
      beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado',
    };
    return map[level] ?? level;
  }
}