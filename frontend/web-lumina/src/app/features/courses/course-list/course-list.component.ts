// features/courses/course-list/course-list.component.ts
import {
  Component,
  inject,
  signal,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { CourseService } from '../services/course.service';
import { Course } from '../../../core/models/course.model';
import { CourseCarouselComponent } from '../components/course-carousel/course-carousel.component';
@Component({
  selector: 'app-course-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CourseCarouselComponent],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-100">Catálogo de cursos</h1>
        <p class="text-slate-400 mt-2">Aprende con los mejores expertos de la industria</p>
      </div>
       <!-- Carousel de cursos destacados -->
      <app-course-carousel />

      <!-- Filtros de nivel -->
      <div class="flex gap-2 mb-6 flex-wrap">
        @for (level of levels; track level.value) {
          <button
            (click)="selectedLevel.set(level.value); loadCourses()"
            class="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
            [class.bg-sky-500]="selectedLevel() === level.value"
            [class.text-white]="selectedLevel() === level.value"
            [class.border-sky-500]="selectedLevel() === level.value"
            [class.text-slate-300]="selectedLevel() !== level.value"
            [class.border-slate-600]="selectedLevel() !== level.value"
            [class.hover:bg-gray-50]="selectedLevel() !== level.value"
            [class.bg-transparent]="selectedLevel() !== level.value"
          >
            {{ level.label }}
          </button>
        }
      </div>

      <!-- Loading state -->
      @if (loading()) {
        <div class="flex justify-center items-center py-20">
          <svg class="animate-spin w-8 h-8 text-sky-500" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      }

      <!-- Error state -->
      @if (error()) {
        <div class="text-center py-20">
          <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732
                     4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p class="text-slate-300 font-medium">No se pudieron cargar los cursos.</p>
          <button (click)="loadCourses()"
                  class="mt-4 btn btn-primary text-sm">
            Reintentar
          </button>
        </div>
      }

      <!-- Grid de cursos -->
      @if (!loading() && !error()) {
        @if (courses().length === 0) {
          <div class="text-center py-20">
            <p class="text-lg font-medium text-slate-300">No hay cursos disponibles</p>
            <p class="text-sm mt-1 text-slate-500">Vuelve pronto, estamos agregando más contenido</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (course of courses(); track course.id) {
              <a [routerLink]="['/courses', course.id]"
                 class="card group cursor-pointer block">

                <!-- Thumbnail -->
                <div class="relative overflow-hidden h-44 bg-gradient-to-br
                            from-sky-100 to-blue-200">
                  @if (course.thumbnailUrl) {
                    <img [src]="course.thumbnailUrl"
                         [alt]="course.title"
                         class="w-full h-full object-cover group-hover:scale-105
                                transition-transform duration-300"
                         loading="lazy" />
                  } @else {
                    <div class="flex items-center justify-center h-full">
                      <svg class="w-12 h-12 text-sky-300" fill="none"
                           viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              stroke-width="1.5"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168
                                 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477
                                 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0
                                 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5
                                 18c-1.746 0-3.332.477-4.5 1.253"/>
                      </svg>
                    </div>
                  }

                  <!-- Badge nivel -->
                  <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs
                               font-semibold"
                        [class.bg-green-100]="course.level === 'beginner'"
                        [class.text-green-700]="course.level === 'beginner'"
                        [class.bg-yellow-100]="course.level === 'intermediate'"
                        [class.text-yellow-700]="course.level === 'intermediate'"
                        [class.bg-red-100]="course.level === 'advanced'"
                        [class.text-red-700]="course.level === 'advanced'">
                    {{ levelLabels[course.level] }}
                  </span>
                </div>

                <!-- Info -->
                <div class="p-4">
                  <h3 class="font-semibold text-slate-100 text-sm leading-snug
                             group-hover:text-sky-600 transition-colors line-clamp-2">
                    {{ course.title }}
                  </h3>
                  <p class="text-xs text-slate-400 mt-1">{{ course.instructor }}</p>

                  <!-- Rating -->
                  <div class="flex items-center gap-1 mt-2">
                    <span class="text-amber-500 text-xs font-bold">
                      {{ course.rating.toFixed(1) }}
                    </span>
                    <div class="flex gap-0.5">
                      @for (star of [1,2,3,4,5]; track star) {
                        <svg class="w-3 h-3" viewBox="0 0 20 20"
                             [class.text-amber-400]="star <= course.rating"
                             [class.text-gray-200]="star > course.rating"
                             fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07
                                   3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588
                                   1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921
                                   -.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175
                                   0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07
                                   -3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38
                                   -1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      }
                    </div>
                    <span class="text-xs text-gray-400">({{ course.totalReviews }})</span>
                  </div>

                  <!-- Footer: precio y duración -->
                  <div class="flex items-center justify-between mt-3">
                    <span class="font-bold text-emerald-400 text-xs">
                      Disponible con Premium
                    </span>
                    <span class="text-xs text-slate-500 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                           stroke="currentColor">
                        <circle cx="12" cy="12" r="10" stroke-width="2"/>
                        <path stroke-linecap="round" stroke-width="2"
                              d="M12 6v6l4 2"/>
                      </svg>
                      {{ course.durationHours }}h
                    </span>
                  </div>
                </div>

              </a>
            }
          </div>
        }
      }

    </div>
  `,
})
export class CourseListComponent implements OnInit {
  private readonly courseService = inject(CourseService);

  courses       = signal<Course[]>([]);
  loading       = signal(true);
  error         = signal(false);
  selectedLevel = signal<string>('');

  readonly levels = [
    { value: '',             label: 'Todos'          },
    { value: 'beginner',     label: 'Principiante'   },
    { value: 'intermediate', label: 'Intermedio'     },
    { value: 'advanced',     label: 'Avanzado'       },
  ];

  readonly levelLabels: Record<string, string> = {
    beginner:     'Principiante',
    intermediate: 'Intermedio',
    advanced:     'Avanzado',
  };

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading.set(true);
    this.error.set(false);

    const filters = this.selectedLevel()
      ? { level: this.selectedLevel() }
      : undefined;

    this.courseService.getAll(filters).subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}