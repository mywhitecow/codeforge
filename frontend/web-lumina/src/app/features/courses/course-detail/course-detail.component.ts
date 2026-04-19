// features/courses/course-detail/course-detail.component.ts
import {
  Component,
  inject,
  signal,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../services/course.service';
import { CartService } from '../../../core/services/cart.service';
import { CourseDetail } from '../../../core/models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="page-container max-w-5xl">

      <!-- Back -->
      <a routerLink="/courses"
         class="inline-flex items-center gap-1.5 text-sm text-gray-500
                hover:text-sky-500 transition-colors mb-6">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 19l-7-7 7-7"/>
        </svg>
        Volver al catálogo
      </a>

      <!-- Loading -->
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

      <!-- Error -->
      @if (error()) {
        <div class="text-center py-20">
          <p class="text-gray-600 font-medium text-lg">Curso no encontrado.</p>
          <a routerLink="/courses" class="mt-4 btn btn-primary text-sm inline-flex">
            Ver catálogo
          </a>
        </div>
      }

      <!-- Contenido -->
      @if (course(); as c) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Columna izquierda: info principal -->
          <div class="lg:col-span-2">

            <!-- Breadcrumb tags -->
            <div class="flex gap-2 mb-3 flex-wrap">
              @for (tag of c.tags; track tag) {
                <span class="px-2.5 py-0.5 bg-sky-50 text-sky-600 text-xs
                             font-medium rounded-full border border-sky-200">
                  {{ tag }}
                </span>
              }
            </div>

            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {{ c.title }}
            </h1>

            <p class="text-gray-600 mt-3 leading-relaxed">{{ c.description }}</p>

            <!-- Meta info -->
            <div class="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7
                           7 0 00-7-7z"/>
                </svg>
                {{ c.instructor }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke-width="2"/>
                  <path stroke-linecap="round" stroke-width="2" d="M12 6v6l4 2"/>
                </svg>
                {{ c.durationHours }} horas
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                {{ c.rating.toFixed(1) }} ({{ c.totalReviews }} reseñas)
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {{ c.enrolledCount.toLocaleString() }} estudiantes
              </span>
            </div>

            <!-- Prerequisitos -->
            @if (c.prerequisites.length > 0) {
              <div class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <h3 class="font-semibold text-amber-800 text-sm mb-2">Prerequisitos</h3>
                <ul class="space-y-1">
                  @for (prereq of c.prerequisites; track prereq) {
                    <li class="text-amber-700 text-sm flex items-start gap-2">
                      <svg class="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24"
                           stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                      {{ prereq }}
                    </li>
                  }
                </ul>
              </div>
            }

            <!-- Syllabus -->
            @if (c.syllabus.length > 0) {
              <div class="mt-8">
                <h2 class="section-title">Contenido del curso</h2>
                <div class="space-y-3">
                  @for (section of c.syllabus; track section.sectionTitle; let i = $index) {
                    <div class="border border-gray-200 rounded-xl overflow-hidden">
                      <div class="px-4 py-3 bg-gray-50 flex items-center justify-between">
                        <span class="font-medium text-gray-800 text-sm">
                          Sección {{ i + 1 }}: {{ section.sectionTitle }}
                        </span>
                        <span class="text-xs text-gray-500">
                          {{ section.lessons.length }} lecciones
                        </span>
                      </div>
                      <ul class="divide-y divide-gray-100">
                        @for (lesson of section.lessons; track lesson.title) {
                          <li class="px-4 py-2.5 flex items-center justify-between
                                     text-sm text-gray-700">
                            <span class="flex items-center gap-2">
                              <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none"
                                   viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M14.752 11.168l-3.197-2.132A1 1 0
                                         0010 9.87v4.263a1 1 0 001.555.832l3.197
                                         -2.132a1 1 0 000-1.664z"/>
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              {{ lesson.title }}
                            </span>
                            <span class="text-xs text-gray-400 shrink-0 ml-2">
                              {{ lesson.durationMinutes }}min
                            </span>
                          </li>
                        }
                      </ul>
                    </div>
                  }
                </div>
              </div>
            }

          </div>

          <!-- Columna derecha: compra (sticky) -->
          <div class="lg:col-span-1">
            <div class="sticky top-24 card p-6">

              <!-- Thumbnail -->
              @if (c.thumbnailUrl) {
                <img [src]="c.thumbnailUrl" [alt]="c.title"
                     class="w-full h-40 object-cover rounded-lg mb-4" />
              }

              <!-- Precio -->
              <div class="text-3xl font-bold text-gray-900 mb-1">
                @if (c.price === 0) {
                  <span class="text-green-600">Gratis</span>
                } @else {
                  $ {{ c.price.toFixed(2) }}
                }
              </div>

              <!-- CTA -->
              <button
                (click)="addToCart(c)"
                class="btn btn-primary w-full justify-center py-3 mt-4"
                [class.opacity-60]="inCart()"
                [disabled]="inCart()"
              >
                {{ inCart() ? '✓ En el carrito' : 'Agregar al carrito' }}
              </button>

              @if (inCart()) {
                <a routerLink="/cart"
                   class="btn btn-outline !text-sky-600 !border-sky-500 w-full
                          justify-center py-2.5 mt-2 text-sm">
                  Ver carrito →
                </a>
              }

              <!-- Garantía -->
              <p class="text-xs text-gray-400 text-center mt-4">
                30 días de garantía de devolución
              </p>

              <!-- Incluye -->
              <ul class="mt-4 space-y-2 text-sm text-gray-600">
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-500 shrink-0" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Acceso de por vida
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-500 shrink-0" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Certificado de finalización
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-500 shrink-0" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  {{ c.durationHours }} horas de contenido
                </li>
              </ul>

            </div>
          </div>

        </div>
      }

    </div>
  `,
})
export class CourseDetailComponent implements OnInit {
  private readonly route         = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);
  private readonly cartService   = inject(CartService);
  private readonly router        = inject(Router);

  course  = signal<CourseDetail | null>(null);
  loading = signal(true);
  error   = signal(false);
  inCart  = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/courses']);
      return;
    }

    this.courseService.getById(id).subscribe({
      next: (course) => {
        this.course.set(course);
        this.loading.set(false);
        // Verificar si ya está en el carrito
        this.inCart.set(
          !!this.cartService.items().find(i => i.courseId === course.id)
        );
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  addToCart(course: CourseDetail): void {
    this.cartService.addItem({
      courseId:     course.id,
      title:        course.title,
      price:        course.price,
      thumbnailUrl: course.thumbnailUrl,
      addedAt:      new Date().toISOString(),
    });
    this.inCart.set(true);
  }
}