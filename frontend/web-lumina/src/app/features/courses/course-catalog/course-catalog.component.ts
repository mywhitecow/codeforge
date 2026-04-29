import { Component, inject, signal, OnInit, OnDestroy, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
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
      <div class="mb-10 text-center md:text-left animate-fade-in-up">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
            style="text-wrap: balance;">Catálogo de cursos</h1>
        <p class="text-slate-400 mt-3 text-lg max-w-2xl">Aprende con los mejores expertos de la industria</p>
      </div>



      <!-- Loading State -->
      @if (loading()) {
        <div class="flex flex-col justify-center items-center py-24 gap-4">
          <div class="relative">
            <div class="w-16 h-16 rounded-full border-4 border-slate-700"></div>
            <div class="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-sky-500 animate-spin"></div>
          </div>
          <p class="text-slate-400 text-sm font-medium animate-pulse">Cargando cursos...</p>
        </div>
      }

      <!-- Error State -->
      @if (error() && !loading()) {
        <div class="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700 animate-fade-in-up">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
            <svg class="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 5.636a9 9 0 11-12.728 0M12 9v4m0 4h.01"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">No se pudieron cargar los cursos</h3>
          <p class="text-slate-400 mb-8 max-w-md mx-auto">Hubo un problema al conectar con el servidor. Verifica tu conexión e intenta de nuevo.</p>
          <button (click)="loadCourses()" 
                  class="inline-flex items-center gap-2 px-8 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl transition-all font-semibold shadow-lg shadow-sky-500/20 hover:shadow-sky-400/30 active:scale-95">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Reintentar
          </button>
        </div>
      }

      <!-- Carousel Content -->
      @if (!loading() && !error()) {
        <div class="mb-12 animate-fade-in-up" style="animation-delay: 0.1s;">
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
            <div class="relative group carousel-wrapper">
              <!-- Fade masks -->
              <div class="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none md:w-12"></div>
              <div class="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none md:w-12"></div>
              
              <!-- Drag indicator -->
              <div class="absolute bottom-1 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 text-slate-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
                </svg>
                Arrastra para explorar
              </div>
              
              <swiper-container
                #swiper
                slides-per-view="auto"
                space-between="24"
                loop="true"
                [attr.autoplay-delay]="isBrowser ? '3000' : null"
                autoplay-disable-on-interaction="false"
                autoplay-pause-on-mouse-enter="true"
                grab-cursor="true"
                class="w-full pb-8 pt-2"
              >
                @for (course of courses(); track course.id; let i = $index) {
                  <swiper-slide style="width: auto;">
                    <div class="animate-fade-in-up" [style.animation-delay]="(i * 0.05) + 's'">
                      <app-course-card [course]="course" [isFirst]="i === 0" (showDetails)="openCourseModal($event)" />
                    </div>
                  </swiper-slide>
                }
              </swiper-container>
            </div>
          }
        </div>

        <div class="animate-fade-in-up" style="animation-delay: 0.2s;">
          <app-course-grid></app-course-grid>
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

    /* Carousel wrapper subtle hover glow */
    .carousel-wrapper {
      border-radius: 1rem;
      transition: box-shadow 0.3s ease;
    }

    /* Staggered fade-in for cards */
    .animate-fade-in-up {
      animation: catalog-fade-in-up 0.5s ease both;
    }

    @keyframes catalog-fade-in-up {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class CourseCatalogComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);
  private routerSub?: Subscription;

  courses = signal<Course[]>([]);
  loading = signal(true);
  error = signal(false);

  // Modal state
  isModalOpen = signal(false);
  selectedCourse = signal<Course | null>(null);

  @ViewChild('swiper') swiperRef?: ElementRef;

  ngOnInit(): void {
    this.loadCourses();

    // Option A: Listen for NavigationEnd to reload courses when navigating back to this route
    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event.urlAfterRedirects === '/courses/catalogo' || event.url === '/courses/catalogo') {
          this.loadCourses();
        }
      });
  }

  ngOnDestroy(): void {
    // Cleanup router subscription
    this.routerSub?.unsubscribe();

    // Cleanup Swiper instance
    if (this.swiperRef?.nativeElement?.swiper) {
      this.swiperRef.nativeElement.swiper.destroy(true, true);
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
