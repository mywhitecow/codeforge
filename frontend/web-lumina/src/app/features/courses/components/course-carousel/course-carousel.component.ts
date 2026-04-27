
// features/courses/components/course-carousel/course-carousel.component.ts
import {
  Component,
  inject,
  signal,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { Course } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-carousel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="carousel-container mb-12">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-slate-100">Cursos Destacados</h2>
          <p class="text-slate-400 mt-1">Explora nuestros cursos más populares</p>
        </div>

        <!-- Navigation buttons -->
        <div class="flex gap-2">
          <button
            (click)="scrollLeft()"
            class="p-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors"
            aria-label="Anterior">
            <svg class="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            (click)="scrollRight()"
            class="p-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors"
            aria-label="Siguiente">
            <svg class="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Carousel -->
      @if (loading()) {
        <div class="flex justify-center items-center py-20">
          <svg class="animate-spin w-8 h-8 text-sky-500" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      } @else if (error()) {
        <div class="text-center py-10">
          <p class="text-slate-300">No se pudieron cargar los cursos destacados</p>
        </div>
      } @else {
        <div #carouselContainer class="carousel-wrapper relative overflow-hidden">
          <div #carouselTrack
               class="carousel-track flex gap-6 transition-transform duration-500 ease-out"
               [style.transform]="'translateX(-' + currentPosition() + 'px)'">
            @for (course of courses(); track course.id) {
              <div class="carousel-item flex-shrink-0 w-72">
                <a [routerLink]="['/courses', course.id]"
                   class="card group cursor-pointer block h-full">

                  <!-- Thumbnail -->
                  <div class="relative overflow-hidden h-40 bg-gradient-to-br from-sky-100 to-blue-200 rounded-lg">
                    @if (course.thumbnailUrl) {
                      <img [src]="course.thumbnailUrl"
                           [alt]="course.title"
                           class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                           loading="lazy" />
                    } @else {
                      <div class="flex items-center justify-center h-full">
                        <svg class="w-10 h-10 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                        </svg>
                      </div>
                    }

                    <!-- Badge nivel -->
                    <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-semibold"
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
                  <div class="p-3">
                    <h3 class="font-semibold text-slate-100 text-sm leading-snug group-hover:text-sky-600 transition-colors line-clamp-2">
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
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921 -.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07 -3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38 -1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        }
                      </div>
                      <span class="text-xs text-gray-400">({{ course.totalReviews }})</span>
                    </div>

                    <!-- Footer: precio y duración -->
                    <div class="flex items-center justify-between mt-3">
                      <span class="font-bold text-slate-100">
                        @if (course.price === 0) {
                          <span class="text-green-600">Gratis</span>
                        } @else {
                          $ {{ course.price.toFixed(2) }}
                        }
                      </span>
                      <span class="text-xs text-slate-500 flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" stroke-width="2"/>
                          <path stroke-linecap="round" stroke-width="2" d="M12 6v6l4 2"/>
                        </svg>
                        {{ course.durationHours }}h
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            }
          </div>

          <!-- Gradient overlays for scroll indication -->
          <div class="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none"></div>
          <div class="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .carousel-container {
      width: 100%;
    }

    .carousel-wrapper {
      padding: 10px 0;
    }

    .carousel-track {
      display: flex;
      gap: 1.5rem;
    }

    .carousel-item {
      flex: 0 0 auto;
    }
  `]
})
export class CourseCarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly courseService = inject(CourseService);

  courses = signal<Course[]>([]);
  loading = signal(true);
  error = signal(false);
  currentPosition = signal(0);

  private carouselContainer!: HTMLElement;
  private carouselTrack!: HTMLElement;
  private resizeObserver?: ResizeObserver;

  readonly levelLabels: Record<string, string> = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  };

  ngOnInit(): void {
    this.loadCourses();
  }

  ngAfterViewInit(): void {
    // Setup resize observer to reset position on window resize
    this.resizeObserver = new ResizeObserver(() => {
      this.currentPosition.set(0);
    });

    if (this.carouselContainer) {
      this.resizeObserver.observe(this.carouselContainer);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  loadCourses(): void {
    this.loading.set(true);
    this.error.set(false);

    this.courseService.getAll().subscribe({
      next: (courses) => {
        // Take first 20 courses for carousel
        this.courses.set(courses.slice(0, 20));
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  setContainerRefs(container: HTMLElement, track: HTMLElement): void {
    this.carouselContainer = container;
    this.carouselTrack = track;
  }

  scrollLeft(): void {
    if (!this.carouselContainer) return;

    const cardWidth = 288; // w-72 (18rem = 288px)
    const gap = 24; // gap-6 (1.5rem = 24px)
    const totalItemWidth = cardWidth + gap;
    const containerWidth = this.carouselContainer.offsetWidth;
    const maxScroll = Math.max(0, (this.courses().length * totalItemWidth) - containerWidth);

    const newPosition = Math.max(0, this.currentPosition() - containerWidth * 0.8);
    this.currentPosition.set(newPosition);
  }

  scrollRight(): void {
    if (!this.carouselContainer) return;

    const cardWidth = 288;
    const gap = 24;
    const totalItemWidth = cardWidth + gap;
    const containerWidth = this.carouselContainer.offsetWidth;
    const maxScroll = Math.max(0, (this.courses().length * totalItemWidth) - containerWidth - gap);

    const newPosition = Math.min(maxScroll, this.currentPosition() + containerWidth * 0.8);
    this.currentPosition.set(newPosition);
  }
}