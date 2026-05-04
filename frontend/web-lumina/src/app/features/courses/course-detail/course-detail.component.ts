// features/courses/course-detail/course-detail.component.ts
import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../services/course.service';
import { CartService } from '../../../core/services/cart.service';
import { CourseDetail, CourseSyllabus } from '../../../core/models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FormsModule],
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
        <div class="flex flex-col items-center justify-center py-20 gap-4">
          <svg class="animate-spin w-10 h-10 text-sky-500" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p class="text-slate-400 text-sm">Cargando información del curso...</p>
        </div>
      }

      <!-- Error -->
      @if (error()) {
        <div class="text-center py-20">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg class="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <p class="text-slate-300 font-medium text-lg">Curso no encontrado.</p>
          <p class="text-slate-500 text-sm mt-1">El curso que buscas no existe o fue eliminado.</p>
          <a routerLink="/courses" class="mt-6 btn btn-primary text-sm inline-flex">
            Ver catálogo
          </a>
        </div>
      }

      <!-- Contenido -->
      @if (course(); as c) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- ── Columna izquierda: info principal ───────────────────── -->
          <div class="lg:col-span-2">

            <!-- Breadcrumb tags -->
            <div class="flex gap-2 mb-3 flex-wrap">
              @for (tag of c.tags; track tag) {
                <span class="px-2.5 py-0.5 bg-sky-50 text-sky-600 text-xs
                             font-medium rounded-full border border-sky-200">
                  {{ tag }}
                </span>
              }
              @if (c.isPremium) {
                <span class="px-2.5 py-0.5 bg-amber-50 text-amber-600 text-xs
                             font-medium rounded-full border border-amber-200">
                  ⭐ Premium
                </span>
              }
            </div>

            <h1 class="text-2xl md:text-3xl font-bold text-slate-100 leading-tight">
              Curso: {{ c.title }}
            </h1>

            <p class="text-slate-400 mt-3 leading-relaxed">{{ c.description }}</p>

            <!-- Meta info -->
            <div class="flex flex-wrap gap-4 mt-4 text-sm text-slate-400">
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
                {{ c.durationHours }} horas totales
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                {{ c.rating.toFixed(1) }}
                <span class="text-slate-500">
                  (Ver {{ c.totalReviews.toLocaleString() }} opiniones)
                </span>
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {{ c.enrolledCount.toLocaleString() }} estudiantes
              </span>
              <!-- Nivel -->
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                {{ levelLabels[c.level] }}
              </span>
            </div>

            <!-- Prerequisitos -->
            @if (c.prerequisites.length > 0) {
              <div class="mt-6 p-4 bg-amber-950/40 border border-amber-800/60 rounded-xl">
                <h3 class="font-semibold text-amber-400 text-sm mb-2">Requisitos previos</h3>
                <ul class="space-y-1">
                  @for (prereq of c.prerequisites; track prereq) {
                    <li class="text-amber-300 text-sm flex items-start gap-2">
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

            <!-- ── Temario / Syllabus ──────────────────────────────── -->
            @if (c.syllabus.length > 0) {
              <div class="mt-8">
                <h2 class="text-xl font-bold text-slate-100 mb-1">Temario del curso</h2>
                <p class="text-slate-400 text-sm mb-4">
                  {{ c.syllabus.length }} secciones •
                  {{ totalLessons() }} lecciones •
                  {{ c.durationHours }} horas de contenido
                </p>

                <!-- Buscador interno -->
                <div class="relative mb-4">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
                  </svg>
                  <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    placeholder="Busca dentro de este curso"
                    id="syllabus-search"
                    class="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600
                           text-slate-200 placeholder-slate-500 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
                           transition-colors" />
                  @if (searchQuery) {
                    <button (click)="searchQuery = ''"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  }
                </div>

                <!-- Resultado de búsqueda vacío -->
                @if (searchQuery && filteredSyllabus().length === 0) {
                  <p class="text-slate-500 text-sm text-center py-8">
                    No se encontraron lecciones para "{{ searchQuery }}"
                  </p>
                }

                <!-- Secciones Acordeón -->
                <div class="space-y-3">
                  @for (section of filteredSyllabus(); track section.sectionTitle; let i = $index) {
                    <div class="border border-slate-700 rounded-xl overflow-hidden">
                      <!-- Header de sección (toggle) -->
                      <button
                        type="button"
                        (click)="toggleSection(i)"
                        class="w-full px-4 py-3 bg-slate-800/80 flex items-center justify-between
                               hover:bg-slate-700/60 transition-colors text-left">
                        <span class="font-medium text-slate-200 text-sm">
                          {{ i + 1 }}. {{ section.sectionTitle }}
                        </span>
                        <div class="flex items-center gap-3 shrink-0 ml-2">
                          <span class="text-xs text-slate-500">
                            {{ section.lessons.length }} lecciones ·
                            {{ sectionDuration(section) }}
                          </span>
                          <svg class="w-4 h-4 text-slate-400 transition-transform duration-200"
                               [class.rotate-180]="isSectionOpen(i)"
                               fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  stroke-width="2" d="M19 9l-7 7-7-7"/>
                          </svg>
                        </div>
                      </button>

                      <!-- Lecciones (colapsable) -->
                      @if (isSectionOpen(i)) {
                        <ul class="divide-y divide-slate-700/50">
                          @for (lesson of section.lessons; track lesson.title) {
                            <li class="px-4 py-3 flex items-center justify-between text-sm">
                              <label class="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                                <!-- Checkbox decorativo -->
                                <span class="w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors"
                                      [class.border-sky-500]="lesson.isCompleted"
                                      [class.bg-sky-500]="lesson.isCompleted"
                                      [class.border-slate-600]="!lesson.isCompleted">
                                  @if (lesson.isCompleted) {
                                    <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                                    </svg>
                                  }
                                </span>
                                <!-- Icono play -->
                                <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none"
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
                                <span class="text-slate-300 truncate">{{ lesson.title }}</span>
                              </label>
                              <span class="text-xs text-slate-500 shrink-0 ml-3">
                                {{ formatDuration(lesson.durationMinutes) }}
                              </span>
                            </li>
                          }
                        </ul>
                      }
                    </div>
                  }
                </div>
              </div>
            }

          </div>

          <!-- ── Columna derecha: compra (sticky) ──────────────────── -->
          <div class="lg:col-span-1">
            <div class="sticky top-24 card p-6">

              <!-- Thumbnail -->
              @if (c.thumbnailUrl) {
                <img [src]="c.thumbnailUrl" [alt]="c.title"
                     class="w-full h-40 object-cover rounded-lg mb-4" />
              }

              <!-- Precio -->
              <div class="mb-1">
                @if (c.isPremium) {
                  <div class="text-lg font-bold text-amber-400">Incluido en Premium</div>
                  <p class="text-xs text-slate-400 mt-0.5">Suscríbete y accede a todos los cursos</p>
                } @else {
                  <div class="text-3xl font-bold text-slate-100">
                    @if (c.price === 0) {
                      <span class="text-green-400">Gratis</span>
                    } @else {
                      Cómpralo por <span>$ </span>{{ c.price.toFixed(2) }} USD
                    }
                  </div>
                }
              </div>

              <!-- CTA -->
              @if (c.isPremium) {
                <a routerLink="/premium"
                   class="btn btn-primary w-full justify-center py-3 mt-4 text-center block">
                  ⭐ Ver planes Premium
                </a>
              } @else {
                <button
                  (click)="addToCart(c)"
                  id="add-to-cart-btn"
                  class="btn btn-primary w-full justify-center py-3 mt-4"
                  [class.opacity-60]="inCart()"
                  [disabled]="inCart()">
                  {{ inCart() ? '✓ En el carrito' : 'Agregar al carrito' }}
                </button>
                @if (inCart()) {
                  <a routerLink="/cart"
                     class="btn btn-outline !text-sky-600 !border-sky-500 w-full
                            justify-center py-2.5 mt-2 text-sm text-center block">
                    Ver carrito →
                  </a>
                }
              }

              <!-- Garantía -->
              <p class="text-xs text-slate-500 text-center mt-4">
                30 días de garantía de devolución
              </p>

              <!-- Incluye -->
              <ul class="mt-4 space-y-2 text-sm text-slate-300">
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
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-500 shrink-0" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Acceso en móvil y escritorio
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

  // Buscador interno del syllabus
  searchQuery = '';

  // Acordeón: Set con los índices de secciones abiertas
  private openSections = signal<Set<number>>(new Set([0])); // primera sección abierta por defecto

  // Syllabus filtrado por el buscador
  filteredSyllabus = computed<CourseSyllabus[]>(() => {
    const c = this.course();
    if (!c) return [];
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return c.syllabus;

    return c.syllabus
      .map(section => ({
        ...section,
        lessons: section.lessons.filter(l =>
          l.title.toLowerCase().includes(q)
        ),
      }))
      .filter(s => s.lessons.length > 0 || s.sectionTitle.toLowerCase().includes(q));
  });

  // Total de lecciones
  totalLessons = computed<number>(() => {
    const c = this.course();
    if (!c) return 0;
    return c.syllabus.reduce((acc, s) => acc + s.lessons.length, 0);
  });

  readonly levelLabels: Record<string, string> = {
    beginner: 'Nivel Básico',
    intermediate: 'Nivel Intermedio',
    advanced: 'Nivel Avanzado',
  };

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

  /** Abre/cierra una sección del acordeón */
  toggleSection(index: number): void {
    const current = new Set(this.openSections());
    if (current.has(index)) {
      current.delete(index);
    } else {
      current.add(index);
    }
    this.openSections.set(current);
  }

  isSectionOpen(index: number): boolean {
    return this.openSections().has(index);
  }

  /** Formatea minutos a MM:SS (ej: 65 → "1:05", 10 → "10:00") */
  formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) {
      return `${h}h ${m > 0 ? m + 'min' : ''}`.trim();
    }
    return `${minutes}min`;
  }

  /** Duración total de una sección */
  sectionDuration(section: CourseSyllabus): string {
    const total = section.lessons.reduce((acc, l) => acc + l.durationMinutes, 0);
    return this.formatDuration(total);
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