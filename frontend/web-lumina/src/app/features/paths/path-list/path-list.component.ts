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
                        rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 mb-6 animate-fade-in-up">
            <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
            Rutas estructuradas de aprendizaje
          </span>

          <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 animate-fade-in-up"
              style="text-wrap: balance; animation-delay:.05s;">
            Elige tu ruta y
            <span class="text-gradient-blue"> escala como profesional</span>
          </h1>
          <p class="text-slate-400 text-lg max-w-2xl leading-relaxed animate-fade-in-up"
             style="animation-delay:.1s;">
            Cada ruta reúne cursos ordenados por dificultad — de principiante a experto —
            para que avances sin perderte.
          </p>
        </div>
      </div>

      <!-- ── Carousel section ── -->
      <div class="page-container max-w-7xl mx-auto px-4 md:px-8 py-12">

        <!-- Section heading -->
        <div class="flex items-center gap-3 mb-8 animate-fade-in-up" style="animation-delay:.15s;">
          <span class="w-1.5 h-8 rounded-full bg-gradient-to-b from-sky-400 to-violet-500"></span>
          <h2 class="text-2xl font-bold text-white">Rutas Destacadas</h2>
          <span class="ml-auto text-xs text-slate-500 font-medium uppercase tracking-wider hidden sm:block">
            Desliza para explorar
          </span>
        </div>

        <!-- Loading -->
        @if (loading()) {
          <div class="flex flex-col items-center justify-center py-24 gap-4">
            <div class="relative">
              <div class="w-16 h-16 rounded-full border-4 border-slate-700"></div>
              <div class="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-sky-500 animate-spin"></div>
            </div>
            <p class="text-slate-400 text-sm animate-pulse">Cargando rutas...</p>
          </div>
        }

        <!-- Carousel -->
        @if (!loading() && paths().length > 0) {
          <div class="relative group carousel-outer animate-fade-in-up" style="animation-delay:.2s;">
            <!-- Fade masks -->
            <div class="absolute top-0 bottom-0 left-0 w-8 md:w-14 bg-gradient-to-r from-[#0f172a] to-transparent z-10 pointer-events-none rounded-l-2xl"></div>
            <div class="absolute top-0 bottom-0 right-0 w-8 md:w-14 bg-gradient-to-l from-[#0f172a] to-transparent z-10 pointer-events-none rounded-r-2xl"></div>

            <!-- Drag hint -->
            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5
                         text-slate-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
              Arrastra para explorar
            </div>

            <swiper-container
              #swiper
              slides-per-view="auto"
              space-between="24"
              loop="true"
              [attr.autoplay-delay]="isBrowser ? '3200' : null"
              autoplay-disable-on-interaction="false"
              autoplay-pause-on-mouse-enter="true"
              grab-cursor="true"
              class="w-full pb-10 pt-2"
            >
              @for (path of paths(); track path.id; let i = $index) {
                <swiper-slide style="width:auto;">
                  <!-- Card wrapper (relative for popup) -->
                  <div class="path-card-wrapper group/card relative"
                       [style.animation-delay]="(i * 0.06) + 's'">

                    <!-- ── Main Card ── -->
                    <div class="path-card flex flex-col w-[88vw] sm:w-[300px] lg:w-[320px]
                                 bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden
                                 cursor-pointer transition-all duration-300
                                 group-hover/card:border-sky-500/30">

                      <!-- Color band top -->
                      <div class="h-1.5 w-full bg-gradient-to-r rounded-t-2xl"
                           [ngClass]="path.color"></div>

                      <div class="p-6 flex flex-col flex-grow">
                        <!-- Icon + meta -->
                        <div class="flex items-center justify-between mb-4">
                          <div class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl
                                       bg-slate-900/70 border border-slate-700/60">
                            {{ path.icon }}
                          </div>
                          <div class="flex flex-col items-end gap-1">
                            <span class="text-xs font-semibold px-2.5 py-1 rounded-full
                                          bg-sky-500/10 border border-sky-500/20 text-sky-400">
                              {{ path.courseCount }} cursos
                            </span>
                            <span class="text-xs text-slate-500">{{ path.duration }}</span>
                          </div>
                        </div>

                        <!-- Title & desc -->
                        <h3 class="text-lg font-bold text-slate-100 leading-snug mb-2
                                    group-hover/card:text-sky-300 transition-colors">
                          {{ path.title }}
                        </h3>
                        <p class="text-sm text-slate-400 line-clamp-2 mb-4 flex-grow">
                          {{ path.shortDescription }}
                        </p>

                        <!-- Tags -->
                        <div class="flex flex-wrap gap-1.5 mb-5">
                          @for (tag of path.tags.slice(0,3); track tag) {
                            <span class="text-xs px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-400 border border-slate-600/50">
                              {{ tag }}
                            </span>
                          }
                          @if (path.tags.length > 3) {
                            <span class="text-xs px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-500">
                              +{{ path.tags.length - 3 }}
                            </span>
                          }
                        </div>

                        <!-- CTA -->
                        <a [routerLink]="['/paths', path.id]"
                           class="path-cta w-full flex items-center justify-center gap-2 py-2.5 min-h-[44px]
                                   bg-slate-700 hover:bg-sky-500 text-slate-200 hover:text-white
                                   text-sm font-semibold rounded-xl transition-all duration-200 active:scale-95">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                          </svg>
                          Ver ruta
                        </a>
                      </div>
                    </div>

                    <!-- ── Hover Popup ── -->
                    <div class="path-popup absolute left-1/2 -translate-x-1/2 top-0 w-[320px] z-50
                                 bg-slate-900 border border-sky-500/30 rounded-2xl shadow-2xl p-6
                                 opacity-0 invisible scale-95
                                 group-hover/card:opacity-100 group-hover/card:visible group-hover/card:scale-100
                                 transition-all duration-200 origin-top pointer-events-none group-hover/card:pointer-events-auto">

                      <div class="flex items-start gap-3 mb-4">
                        <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl
                                     bg-slate-800 border border-slate-700">
                          {{ path.icon }}
                        </div>
                        <div>
                          <h4 class="font-bold text-white leading-snug">{{ path.title }}</h4>
                          <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs text-sky-400 font-medium">{{ path.courseCount }} cursos</span>
                            <span class="text-slate-600">·</span>
                            <span class="text-xs text-slate-500">{{ path.duration }}</span>
                          </div>
                        </div>
                      </div>

                      <p class="text-sm text-slate-300 leading-relaxed mb-5">
                        {{ path.longDescription }}
                      </p>

                      <!-- Difficulty preview -->
                      <div class="mb-5">
                        <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">Progresión de dificultad</p>
                        <div class="flex items-center gap-2">
                          <div class="flex-grow h-2 rounded-full bg-slate-700 overflow-hidden">
                            <div class="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500"></div>
                          </div>
                          <span class="text-xs text-slate-400 whitespace-nowrap">Principiante → Avanzado</span>
                        </div>
                      </div>

                      <!-- Tags -->
                      <div class="flex flex-wrap gap-1.5 mb-5">
                        @for (tag of path.tags; track tag) {
                          <span class="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {{ tag }}
                          </span>
                        }
                      </div>

                      <a [routerLink]="['/paths', path.id]"
                         class="block w-full text-center py-3 bg-sky-500 hover:bg-sky-400 text-white
                                 font-semibold rounded-xl transition-all active:scale-95 text-sm shadow-lg shadow-sky-500/20">
                        Comenzar esta ruta →
                      </a>
                    </div>

                  </div>
                </swiper-slide>
              }
            </swiper-container>
          </div>
        }

        <!-- ── All paths grid (below carousel) ── -->
        @if (!loading() && paths().length > 0) {
          <div class="mt-16 animate-fade-in-up" style="animation-delay:.3s;">
            <div class="flex items-center gap-3 mb-8">
              <span class="w-1.5 h-8 rounded-full bg-gradient-to-b from-violet-400 to-pink-500"></span>
              <h2 class="text-2xl font-bold text-white">Todas las rutas</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              @for (path of paths(); track path.id; let i = $index) {
                <a [routerLink]="['/paths', path.id]"
                   class="group flex items-start gap-4 bg-slate-800/60 border border-slate-700/80
                           rounded-2xl p-5 hover:border-sky-500/30 transition-all duration-300 animate-fade-in-up"
                   [style.animation-delay]="(i * 0.06 + 0.35) + 's'">

                  <!-- Icon -->
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl
                               bg-slate-900 border border-slate-700 group-hover:border-sky-500/30 transition-colors">
                    {{ path.icon }}
                  </div>

                  <div class="flex-grow min-w-0">
                    <h3 class="font-semibold text-slate-100 group-hover:text-sky-300 transition-colors leading-snug mb-1">
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
                  <svg class="flex-shrink-0 w-5 h-5 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5
                               transition-all self-center" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    .path-card {
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      transition: transform 0.3s cubic-bezier(0.22,1,0.36,1),
                  box-shadow 0.3s cubic-bezier(0.22,1,0.36,1),
                  border-color 0.3s ease;
    }

    .path-card:hover {
      transform: scale(1.02) rotate(0.4deg);
      box-shadow: 0 0 20px rgba(56,189,248,0.12),
                  0 8px 30px rgba(0,0,0,0.4);
    }

    /* Popup should never go off-screen horizontally */
    .path-popup {
      max-width: 90vw;
    }

    /* Card wrapper must have enough height for popup overlay */
    .path-card-wrapper {
      display: flex;
    }

    /* animate-fade-in-up local override */
    .animate-fade-in-up {
      animation: pl-fade-up 0.5s ease both;
    }

    @keyframes pl-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
  `],
})
export class PathListComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly pathService = inject(PathService);

  paths  = signal<LearningPath[]>([]);
  loading = signal(true);

  @ViewChild('swiper') swiperRef?: ElementRef;

  ngOnInit(): void {
    this.pathService.getAll().subscribe(data => {
      this.paths.set(data);
      this.loading.set(false);
    });
  }

  ngOnDestroy(): void {
    if (this.swiperRef?.nativeElement?.swiper) {
      this.swiperRef.nativeElement.swiper.destroy(true, true);
    }
  }
}