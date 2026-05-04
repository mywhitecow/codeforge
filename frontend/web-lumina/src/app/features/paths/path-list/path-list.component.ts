// features/paths/path-list/path-list.component.ts
import {
  Component, OnInit, OnDestroy, signal,
  ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild,
  inject, PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { PathService } from '../services/path.service';
import { LearningPath } from '../models/learning-path.model';

register();

@Component({
  selector: 'app-path-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="paths-page min-h-screen" style="background-color:#0f172a;">

      <!-- ── Hero header ── -->
      <div class="relative overflow-hidden border-b border-slate-800"
           style="background: linear-gradient(135deg,#0f172a 0%,#0d1f3c 100%);">
        <div class="absolute inset-0 pointer-events-none opacity-40"
             style="background: radial-gradient(ellipse at 15% 60%, rgba(56,189,248,0.13) 0%, transparent 55%),
                                radial-gradient(ellipse at 85% 30%, rgba(139,92,246,0.10) 0%, transparent 50%);"></div>

        <div class="page-container max-w-7xl mx-auto px-4 md:px-8 py-14 relative z-10">

          <!-- Badge -->
          <span class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5
                        rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 mb-6 anim-up">
            <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
            Rutas estructuradas de aprendizaje
          </span>

          <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 anim-up"
              style="text-wrap: balance; animation-delay:.05s;">
            Elige tu ruta y
            <span class="text-gradient-blue"> escala como profesional</span>
          </h1>
          <p class="text-slate-400 text-lg max-w-2xl leading-relaxed anim-up"
             style="animation-delay:.1s;">
            Cada ruta reúne cursos ordenados por dificultad — de principiante a experto —
            para que avances sin perderte.
          </p>
        </div>
      </div>

      <!-- ── Carousel section ── -->
      <div class="page-container max-w-7xl mx-auto px-4 md:px-8 py-12">

        <!-- Section heading + nav buttons -->
        <div class="flex items-center gap-3 mb-8 anim-up" style="animation-delay:.15s;">
          <span class="w-1.5 h-8 rounded-full bg-gradient-to-b from-sky-400 to-violet-500"></span>
          <h2 class="text-2xl font-bold text-white">Rutas Destacadas</h2>
          <!-- Prev / Next navigation buttons -->
          <div class="ml-auto flex items-center gap-2">
            <button id="path-swiper-prev"
                    (click)="slidePrev()"
                    class="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700
                           flex items-center justify-center text-slate-400
                           hover:bg-slate-700 hover:border-sky-500/50 hover:text-sky-400
                           transition-all duration-200"
                    aria-label="Anterior">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button id="path-swiper-next"
                    (click)="slideNext()"
                    class="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700
                           flex items-center justify-center text-slate-400
                           hover:bg-slate-700 hover:border-sky-500/50 hover:text-sky-400
                           transition-all duration-200"
                    aria-label="Siguiente">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Loading state -->
        @if (loading()) {
          <div class="flex flex-col items-center justify-center py-24 gap-4">
            <div class="relative">
              <div class="w-16 h-16 rounded-full border-4 border-slate-700"></div>
              <div class="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-sky-500 animate-spin"></div>
            </div>
            <p class="text-slate-400 text-sm animate-pulse">Cargando rutas...</p>
          </div>
        }

        <!-- Carousel — shown when loaded -->
        @if (!loading() && paths().length > 0) {
          <div class="anim-up" style="animation-delay:.2s;">
            <swiper-container
              #swiper
              slides-per-view="auto"
              space-between="24"
              loop="true"
              grab-cursor="true"
              [attr.autoplay-delay]="isBrowser ? '3500' : null"
              autoplay-disable-on-interaction="false"
              autoplay-pause-on-mouse-enter="true"
              class="path-swiper w-full py-3"
            >
              @for (path of paths(); track path.id; let i = $index) {
                <swiper-slide class="path-slide">

                  <!-- Card: the entire card is a routerLink anchor -->
                  <a [routerLink]="['/paths', path.id]"
                     id="path-card-{{ path.id }}"
                     class="path-card flex flex-col h-full
                              bg-slate-800/80 border border-slate-700/80 rounded-2xl
                              overflow-hidden cursor-pointer group"
                     [style.animation-delay]="(i * 0.06) + 's'">

                    <!-- Colored top band -->
                    <div class="h-1.5 w-full bg-gradient-to-r flex-shrink-0"
                         [ngClass]="path.color"></div>

                    <div class="p-6 flex flex-col flex-grow">

                      <!-- Icon row -->
                      <div class="flex items-start justify-between mb-4">
                        <div class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl
                                     bg-slate-900/70 border border-slate-700/60 flex-shrink-0">
                          {{ path.icon }}
                        </div>
                        <div class="flex flex-col items-end gap-1 text-right">
                          <span class="text-xs font-semibold px-2.5 py-1 rounded-full
                                        bg-sky-500/10 border border-sky-500/20 text-sky-400">
                            {{ path.courseCount }} cursos
                          </span>
                          <span class="text-xs text-slate-500">{{ path.duration }}</span>
                        </div>
                      </div>

                      <!-- Title -->
                      <h3 class="text-lg font-bold text-slate-100 leading-snug mb-2
                                  group-hover:text-sky-300 transition-colors duration-200">
                        {{ path.title }}
                      </h3>

                      <!-- Description -->
                      <p class="text-sm text-slate-400 line-clamp-2 mb-4 flex-grow leading-relaxed">
                        {{ path.shortDescription }}
                      </p>

                      <!-- Difficulty bar -->
                      <div class="mb-5">
                        <div class="flex items-center gap-2">
                          <div class="flex-grow h-1.5 rounded-full bg-slate-700 overflow-hidden">
                            <div class="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 w-full"></div>
                          </div>
                          <span class="text-xs text-slate-500 whitespace-nowrap flex-shrink-0">
                            Principiante → Avanzado
                          </span>
                        </div>
                      </div>

                      <!-- Tags -->
                      <div class="flex flex-wrap gap-1.5 mb-5">
                        @for (tag of path.tags.slice(0, 3); track tag) {
                          <span class="text-xs px-2 py-0.5 rounded-full bg-slate-700/80
                                        text-slate-400 border border-slate-600/50">
                            {{ tag }}
                          </span>
                        }
                        @if (path.tags.length > 3) {
                          <span class="text-xs px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-500">
                            +{{ path.tags.length - 3 }}
                          </span>
                        }
                      </div>

                      <!-- CTA — always visible, never hidden -->
                      <div class="ver-ruta-btn mt-auto w-full flex items-center justify-center gap-2
                                 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold
                                 bg-slate-700 text-slate-200
                                 group-hover:bg-sky-500 group-hover:text-white
                                 transition-all duration-200 active:scale-95">
                        <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                        </svg>
                        Ver ruta
                      </div>

                    </div>
                  </a>

                </swiper-slide>
              }
            </swiper-container>
          </div>
        }

        <!-- ── All paths grid ── -->
        @if (!loading() && paths().length > 0) {
          <div class="mt-16 anim-up" style="animation-delay:.3s;">
            <div class="flex items-center gap-3 mb-8">
              <span class="w-1.5 h-8 rounded-full bg-gradient-to-b from-violet-400 to-pink-500"></span>
              <h2 class="text-2xl font-bold text-white">Todas las rutas</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              @for (path of paths(); track path.id; let i = $index) {
                <a [routerLink]="['/paths', path.id]"
                   id="path-grid-{{ path.id }}"
                   class="group flex items-start gap-4 bg-slate-800/60 border border-slate-700/80
                           rounded-2xl p-5 hover:border-sky-500/30 transition-all duration-300 anim-up"
                   [style.animation-delay]="(i * 0.06 + 0.35) + 's'">

                  <!-- Icon -->
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl
                               bg-slate-900 border border-slate-700 group-hover:border-sky-500/30 transition-colors">
                    {{ path.icon }}
                  </div>

                  <div class="flex-grow min-w-0">
                    <h3 class="font-semibold text-slate-100 group-hover:text-sky-300
                                transition-colors leading-snug mb-1">
                      {{ path.title }}
                    </h3>
                    <p class="text-xs text-slate-400 line-clamp-2 mb-2">{{ path.shortDescription }}</p>
                    <div class="flex items-center gap-3">
                      <span class="text-xs text-sky-400 font-medium">{{ path.courseCount }} cursos</span>
                      <span class="text-slate-600 text-xs">·</span>
                      <span class="text-xs text-slate-500">{{ path.duration }}</span>
                    </div>
                  </div>

                  <!-- Arrow -->
                  <svg class="flex-shrink-0 w-5 h-5 text-slate-600 group-hover:text-sky-400
                               group-hover:translate-x-0.5 transition-all self-center"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              }
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    /* ── Swiper overflow fix ──
       Swiper's shadow DOM applies overflow:hidden to the container.
       We override it so cards aren't clipped on hover/scale. */
    .path-swiper {
      overflow: visible !important;
    }

    /* Each slide: fixed width so cards are uniform */
    .path-slide {
      width: 88vw !important;
      max-width: 320px !important;
      height: auto !important;      /* let Swiper equalize heights */
    }

    /* Card hover lift */
    .path-card {
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      transition: transform 0.28s cubic-bezier(0.22,1,0.36,1),
                  box-shadow 0.28s cubic-bezier(0.22,1,0.36,1),
                  border-color 0.2s ease;
    }
    .path-card:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: 0 0 24px rgba(56,189,248,0.12), 0 12px 32px rgba(0,0,0,0.45);
      border-color: rgba(56,189,248,0.35) !important;
    }

    /* "Ver ruta" button — ALWAYS visible (no opacity/visibility tricks) */
    .ver-ruta-btn {
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
    }

    /* Entrance animation */
    .anim-up {
      animation: pl-fade-up 0.5s ease both;
    }
    @keyframes pl-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class PathListComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly pathService = inject(PathService);

  paths   = signal<LearningPath[]>([]);
  loading = signal(true);

  @ViewChild('swiper') swiperRef?: ElementRef;

  ngOnInit(): void {
    this.pathService.getAll().subscribe(data => {
      this.paths.set(data);
      this.loading.set(false);
    });
  }

  /** Called by the Anterior/Siguiente buttons */
  slidePrev(): void {
    this.swiperRef?.nativeElement?.swiper?.slidePrev();
  }

  slideNext(): void {
    this.swiperRef?.nativeElement?.swiper?.slideNext();
  }

  ngOnDestroy(): void {
    if (this.swiperRef?.nativeElement?.swiper) {
      this.swiperRef.nativeElement.swiper.destroy(true, true);
    }
  }
}