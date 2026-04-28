import { Component, inject, signal, OnInit, OnDestroy, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../services/course.service';
import { Course } from '../../../core/models/course.model';
import { CourseCardComponent } from '../components/course-card/course-card.component';
import { CourseDetailModalComponent } from '../components/course-detail-modal/course-detail-modal.component';
import { CourseGridComponent } from '../components/course-grid/course-grid.component';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-course-catalog',
  standalone: true,
  imports: [CommonModule, CourseCardComponent, CourseDetailModalComponent, CourseGridComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container py-8 px-4 md:px-8 max-w-7xl mx-auto">
      
      <!-- Header -->
      <div class="mb-10 text-center md:text-left">
        <h1 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Catálogo de cursos</h1>
        <p class="text-slate-400 mt-3 text-lg">Aprende con los mejores expertos de la industria</p>
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
          </div>

          @if (courses().length === 0) {
            <div class="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700 border-dashed">
              <p class="text-xl font-medium text-slate-300">No hay cursos disponibles en este momento</p>
              <p class="text-sm mt-2 text-slate-500">Vuelve más tarde para ver nuestras novedades.</p>
            </div>
          } @else {
            <!-- The Carousel Container -->
            <div class="relative group">
              <!-- Fade masks -->
              <div class="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none md:w-12"></div>
              <div class="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none md:w-12"></div>
              
              <swiper-container
                #swiper
                slides-per-view="auto"
                space-between="24"
                loop="true"
                autoplay-delay="3000"
                autoplay-disable-on-interaction="false"
                autoplay-pause-on-mouse-enter="true"
                class="w-full pb-8 pt-2"
              >
                @for (course of courses(); track course.id; let i = $index) {
                  <swiper-slide style="width: auto;">
                    <app-course-card [course]="course" [isFirst]="i === 0" (showDetails)="openCourseModal($event)" />
                  </swiper-slide>
                }
              </swiper-container>
            </div>
          }
        </div>

        <app-course-grid></app-course-grid>
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
export class CourseCatalogComponent implements OnInit, OnDestroy {
  private readonly courseService = inject(CourseService);

  courses = signal<Course[]>([]);
  loading = signal(true);
  error = signal(false);

  // Modal state
  isModalOpen = signal(false);
  selectedCourse = signal<Course | null>(null);

  @ViewChild('swiper') swiperRef?: ElementRef;

  ngOnInit(): void {
    this.loadCourses();
  }

  ngOnDestroy(): void {
    if (this.swiperRef?.nativeElement?.swiper) {
      this.swiperRef.nativeElement.swiper.destroy();
    }
  }

  loadCourses(): void {
    this.loading.set(true);
    this.error.set(false);

    this.courseService.getAll().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
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
