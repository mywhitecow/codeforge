// features/paths/path-detail/path-detail.component.ts
import {
  Component, OnInit, inject, signal, ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { PathService } from '../services/path.service';
import { CourseService } from '../../courses/services/course.service';
import { LearningPath } from '../models/learning-path.model';
import { Course } from '../../../core/models/course.model';

/** Maps level → numeric weight for badge/bar */
const LEVEL_WEIGHT: Record<string, number> = {
  beginner: 1, intermediate: 2, advanced: 3,
};
const LEVEL_LABEL: Record<string, string> = {
  beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado',
};
const LEVEL_COLOR: Record<string, string> = {
  beginner: 'bg-emerald-500 text-white',
  intermediate: 'bg-yellow-500 text-black',
  advanced: 'bg-red-500 text-white',
};
const LEVEL_BAR: Record<string, number> = {
  beginner: 33, intermediate: 66, advanced: 100,
};

@Component({
  selector: 'app-path-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <!-- Loading skeleton -->
      <div class="page-container py-12 px-4 md:px-8 max-w-4xl mx-auto animate-pulse">
        <div class="h-8 w-2/3 bg-slate-700 rounded-lg mb-4"></div>
        <div class="h-4 w-1/2 bg-slate-700/50 rounded mb-12"></div>
        @for (i of [1,2,3]; track i) {
          <div class="h-24 bg-slate-800 rounded-2xl mb-4"></div>
        }
      </div>
    } @else if (!path()) {
      <!-- Not found -->
      <div class="page-container py-24 text-center px-4">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
          <svg class="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">Ruta no encontrada</h2>
        <p class="text-slate-400 mb-8">La ruta de aprendizaje que buscas no existe.</p>
        <a routerLink="/paths" class="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all active:scale-95">
          ← Volver a Rutas
        </a>
      </div>
    } @else {
      <div class="min-h-screen" style="background-color:#0f172a;">
        <!-- Hero Header -->
        <div class="relative overflow-hidden border-b border-slate-800"
             style="background: linear-gradient(135deg, #0f172a 0%, #0d1f3c 100%);">
          <div class="absolute inset-0 pointer-events-none opacity-30"
               style="background: radial-gradient(ellipse at 20% 50%, rgba(56,189,248,0.15) 0%, transparent 60%);">
          </div>
          <div class="page-container max-w-4xl mx-auto px-4 md:px-8 py-12 relative z-10">
            <a routerLink="/paths"
               class="inline-flex items-center gap-2 text-slate-400 hover:text-sky-400 text-sm font-medium mb-8 transition-colors group">
              <svg class="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Todas las rutas
            </a>

            <div class="flex items-start gap-5">
              <!-- Icon -->
              <div class="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
                          bg-gradient-to-br shadow-lg"
                   [ngClass]="getIconBg(path()!.color)">
                {{ path()!.icon }}
              </div>
              <div>
                <div class="flex flex-wrap gap-2 mb-2">
                  <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/20">
                    {{ path()!.courseCount }} cursos
                  </span>
                  <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-700 text-slate-300">
                    {{ path()!.duration }}
                  </span>
                  @for (tag of path()!.tags.slice(0,3); track tag) {
                    <span class="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {{ tag }}
                    </span>
                  }
                </div>
                <h1 class="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight"
                    style="text-wrap: balance;">
                  {{ path()!.title }}
                </h1>
                <p class="text-slate-400 mt-3 max-w-2xl leading-relaxed">
                  {{ path()!.longDescription }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Courses section -->
        <div class="page-container max-w-4xl mx-auto px-4 md:px-8 py-12">
          <div class="flex items-center gap-3 mb-8">
            <span class="w-1.5 h-8 rounded-full bg-gradient-to-b from-sky-400 to-blue-600"></span>
            <h2 class="text-xl font-bold text-white">Cursos de esta ruta</h2>
            <span class="ml-auto text-xs text-slate-500 font-medium uppercase tracking-wider">
              ordenados de menor a mayor dificultad
            </span>
          </div>

          <!-- Difficulty legend -->
          <div class="flex items-center gap-4 mb-8 flex-wrap">
            <div class="flex items-center gap-1.5 text-xs text-slate-400">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Principiante
            </div>
            <div class="flex items-center gap-1.5 text-xs text-slate-400">
              <span class="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>Intermedio
            </div>
            <div class="flex items-center gap-1.5 text-xs text-slate-400">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>Avanzado
            </div>
          </div>

          <!-- Course cards — ordered list -->
          <div class="flex flex-col gap-4">
            @for (course of orderedCourses(); track course.id; let i = $index) {
              <a [routerLink]="['/courses', course.id]" class="course-row group flex items-start gap-4 bg-slate-800/60 rounded-2xl border border-slate-700/80
                          p-5 hover:border-sky-500/30 transition-all duration-300 animate-fade-in-up cursor-pointer"
                   [style.animation-delay]="(i * 0.07) + 's'">

                <!-- Step number -->
                <div class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg
                            border border-slate-600 bg-slate-900 text-slate-400 group-hover:border-sky-500/40
                            group-hover:text-sky-400 transition-all">
                  {{ i + 1 }}
                </div>

                <!-- Thumbnail -->
                @if (course.thumbnailUrl) {
                  <div class="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden hidden sm:block">
                    <img [src]="course.thumbnailUrl" [alt]="course.title"
                         class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                  </div>
                }

                <!-- Info -->
                <div class="flex-grow min-w-0">
                  <div class="flex items-start justify-between gap-3 flex-wrap">
                    <h3 class="font-semibold text-slate-100 group-hover:text-sky-300 transition-colors leading-snug">
                      {{ course.title }}
                    </h3>
                    <!-- Level badge -->
                    <span class="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
                          [ngClass]="levelColor(course.level)">
                      {{ levelLabel(course.level) }}
                    </span>
                  </div>

                  <p class="text-xs text-slate-400 mt-1 mb-3 line-clamp-2">
                    {{ course.shortDescription || course.description }}
                  </p>

                  <!-- Difficulty bar -->
                  <div class="flex items-center gap-3">
                    <div class="flex-grow h-1.5 bg-slate-700 rounded-full overflow-hidden max-w-xs">
                      <div class="h-full rounded-full transition-all duration-700"
                           [style.width]="levelBar(course.level) + '%'"
                           [ngClass]="levelBarColor(course.level)">
                      </div>
                    </div>
                    <span class="text-xs text-slate-500 whitespace-nowrap">
                      {{ course.durationHours }}h · {{ course.instructor }}
                    </span>
                  </div>
                </div>
              </a>
            }
          </div>

          <!-- CTA -->
          <div class="mt-12 text-center">
            <a routerLink="/courses/catalogo"
               class="inline-flex items-center gap-2 px-8 py-3.5 min-h-[44px]
                      bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl
                      transition-all duration-200 shadow-lg shadow-sky-500/20 hover:shadow-sky-400/30 active:scale-95">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              Ver todos los cursos
            </a>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .course-row {
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }
    .course-row:hover {
      box-shadow: 0 0 0 1px rgba(56,189,248,0.15), 0 8px 24px rgba(0,0,0,0.4);
      transform: translateX(4px);
    }
    .animate-fade-in-up {
      animation: detail-fade-up 0.5s ease both;
    }
    @keyframes detail-fade-up {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class PathDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pathService = inject(PathService);
  private courseService = inject(CourseService);

  path = signal<LearningPath | undefined>(undefined);
  courses = signal<Course[]>([]);
  loading = signal(true);

  /** Courses pre-sorted according to courseIds order in the path */
  orderedCourses() {
    const path = this.path();
    if (!path) return [];
    const map = new Map(this.courses().map(c => [c.id, c]));
    return path.courseIds
      .map(id => map.get(id))
      .filter((c): c is Course => !!c);
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id') ?? '';
        return this.pathService.getById(id);
      }),
    ).subscribe(foundPath => {
      this.path.set(foundPath);
      if (foundPath) {
        this.courseService.getAll().subscribe(all => {
          this.courses.set(all);
          this.loading.set(false);
        });
      } else {
        this.loading.set(false);
      }
    });
  }

  levelLabel(level: string): string { return LEVEL_LABEL[level] ?? level; }
  levelColor(level: string): string { return LEVEL_COLOR[level] ?? 'bg-slate-600 text-white'; }
  levelBar(level: string): number { return LEVEL_BAR[level] ?? 50; }
  levelBarColor(level: string): string {
    return {
      beginner: 'bg-emerald-500',
      intermediate: 'bg-yellow-500',
      advanced: 'bg-red-500',
    }[level] ?? 'bg-sky-500';
  }
  getIconBg(color: string): string {
    const map: Record<string, string> = {
      'from-sky-500 to-blue-600': 'bg-sky-900/40 border border-sky-700/40',
      'from-emerald-500 to-teal-600': 'bg-emerald-900/40 border border-emerald-700/40',
      'from-purple-500 to-violet-600': 'bg-purple-900/40 border border-purple-700/40',
      'from-orange-500 to-amber-600': 'bg-orange-900/40 border border-orange-700/40',
      'from-pink-500 to-rose-600': 'bg-pink-900/40 border border-pink-700/40',
      'from-yellow-500 to-amber-500': 'bg-yellow-900/40 border border-yellow-700/40',
    };
    return map[color] ?? 'bg-slate-800';
  }
}
