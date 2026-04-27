import { Component, inject, signal, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../services/course.service';
import { Course } from '../../../core/models/course.model';
import { CourseCardComponent } from '../components/course-card/course-card.component';
import { CourseDetailModalComponent } from '../components/course-detail-modal/course-detail-modal.component';

@Component({
  selector: 'app-course-catalog',
  standalone: true,
  imports: [CommonModule, CourseCardComponent, CourseDetailModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container py-8 px-4 md:px-8 max-w-7xl mx-auto">
      
      <!-- Header -->
      <div class="mb-10 text-center md:text-left">
        <h1 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Catálogo de cursos</h1>
        <p class="text-slate-400 mt-3 text-lg">Aprende con los mejores expertos de la industria</p>
      </div>

      <!-- Filtros de nivel -->
      <div class="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        @for (level of levels; track level.value) {
          <button
            (click)="setFilter(level.value)"
            class="px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap"
            [class.bg-sky-500]="selectedLevel() === level.value"
            [class.text-white]="selectedLevel() === level.value"
            [class.shadow-md]="selectedLevel() === level.value"
            [class.shadow-sky-500/30]="selectedLevel() === level.value"
            [class.bg-slate-800]="selectedLevel() !== level.value"
            [class.text-slate-300]="selectedLevel() !== level.value"
            [class.hover:bg-slate-700]="selectedLevel() !== level.value"
            [class.hover:text-white]="selectedLevel() !== level.value"
          >
            {{ level.label }}
          </button>
        }
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="flex justify-center items-center py-20">
          <svg class="animate-spin w-10 h-10 text-sky-500" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      }

      <!-- Error State -->
      @if (error() && !loading()) {
        <div class="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700">
          <svg class="w-16 h-16 text-red-400 mx-auto mb-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p class="text-slate-300 font-medium text-lg">No se pudieron cargar los cursos.</p>
          <button (click)="loadCourses()" class="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium">
            Reintentar
          </button>
        </div>
      }

      <!-- Carousel Content -->
      @if (!loading() && !error()) {
        <div class="mb-12">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center">
              <span class="w-2 h-8 bg-sky-500 rounded-full mr-3"></span>
              Cursos Destacados
            </h2>
            
            <!-- Carousel Navigation (desktop only) -->
            <div class="hidden md:flex gap-2">
              <button (click)="scrollLeft()" 
                      class="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all hover:text-white"
                      aria-label="Desplazar a la izquierda">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button (click)="scrollRight()" 
                      class="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all hover:text-white"
                      aria-label="Desplazar a la derecha">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

          @if (courses().length === 0) {
            <div class="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700 border-dashed">
              <p class="text-xl font-medium text-slate-300">No hay cursos disponibles para este nivel</p>
              <p class="text-sm mt-2 text-slate-500">Intenta seleccionando otro filtro o vuelve más tarde.</p>
            </div>
          } @else {
            <!-- The Carousel Container -->
            <div class="relative group">
              <!-- Fade masks -->
              <div class="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none md:w-12"></div>
              <div class="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none md:w-12"></div>
              
              <div #carouselContainer 
                   class="flex overflow-x-auto gap-4 md:gap-6 pb-8 pt-2 px-2 snap-x snap-mandatory scroll-smooth"
                   style="scrollbar-width: none; -ms-overflow-style: none;">
                @for (course of courses(); track course.id) {
                  <div class="snap-start snap-always">
                    <app-course-card [course]="course" (showDetails)="openCourseModal($event)" />
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>

    <!-- Modal -->
    <app-course-detail-modal
      [isOpen]="isModalOpen()"
      [course]="selectedCourse()"
      (close)="closeCourseModal()">
    </app-course-detail-modal>
  `,
  styles: [`
    /* Hide scrollbar for Chrome, Safari and Opera */
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    /* Hide scrollbar for IE, Edge and Firefox */
    .scrollbar-hide {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
    
    .page-container {
      background-color: #0f172a; /* slate-900 */
      min-height: 100vh;
    }
  `]
})
export class CourseCatalogComponent implements OnInit {
  private readonly courseService = inject(CourseService);

  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLDivElement>;

  courses = signal<Course[]>([]);
  loading = signal(true);
  error = signal(false);
  
  selectedLevel = signal<string>('');
  
  // Modal state
  isModalOpen = signal(false);
  selectedCourse = signal<Course | null>(null);

  readonly levels = [
    { value: '',             label: 'Todos'          },
    { value: 'beginner',     label: 'Principiante'   },
    { value: 'intermediate', label: 'Intermedio'     },
    { value: 'advanced',     label: 'Avanzado'       },
  ];

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
      next: (data) => {
        this.courses.set(data);
        this.loading.set(false);
        this.resetScroll();
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  setFilter(level: string): void {
    if (this.selectedLevel() !== level) {
      this.selectedLevel.set(level);
      this.loadCourses();
    }
  }

  resetScroll(): void {
    if (this.carouselContainer?.nativeElement) {
      setTimeout(() => {
        this.carouselContainer.nativeElement.scrollTo({ left: 0, behavior: 'smooth' });
      }, 50);
    }
  }

  scrollLeft(): void {
    if (this.carouselContainer?.nativeElement) {
      const container = this.carouselContainer.nativeElement;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.carouselContainer?.nativeElement) {
      const container = this.carouselContainer.nativeElement;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  openCourseModal(course: Course): void {
    this.selectedCourse.set(course);
    this.isModalOpen.set(true);
  }

  closeCourseModal(): void {
    this.isModalOpen.set(false);
    // Add small delay to avoid flicker before unmounting component
    setTimeout(() => {
      if (!this.isModalOpen()) {
        this.selectedCourse.set(null);
      }
    }, 300);
  }
}
