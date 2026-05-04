// features/schools/school-list/school-list.component.ts
import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { School } from '../../../core/models/school.model';
import { SchoolService } from '../services/school.service';

@Component({
  selector: 'app-school-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-slate-900 text-slate-100">

      <!-- ── HERO ─────────────────────────────────────────────── -->
      <section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 py-20 px-6">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        </div>
        <div class="relative max-w-5xl mx-auto text-center">
          <span class="inline-block px-4 py-1.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-semibold tracking-widest uppercase mb-5">
            CodeForge Academy
          </span>
          <h1 class="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
            Escuelas
          </h1>
          <p class="text-slate-400 text-lg max-w-2xl mx-auto">
            Elige tu área de especialización y aprende con cursos estructurados, guiados por expertos del sector.
          </p>
        </div>
      </section>

      <!-- ── LOADING ───────────────────────────────────────────── -->
      @if (loading()) {
        <div class="flex items-center justify-center py-32">
          <div class="flex flex-col items-center gap-4">
            <div class="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div>
            <p class="text-slate-500 text-sm">Cargando escuelas…</p>
          </div>
        </div>
      }

      <!-- ── ERROR ─────────────────────────────────────────────── -->
      @if (error()) {
        <div class="max-w-xl mx-auto py-24 px-6 text-center">
          <span class="text-5xl mb-4 block">⚠️</span>
          <h2 class="text-xl font-semibold text-slate-200 mb-2">No se pudo cargar</h2>
          <p class="text-slate-500 mb-6">{{ error() }}</p>
          <button (click)="loadSchools()"
                  class="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 rounded-lg text-white font-medium transition-colors">
            Reintentar
          </button>
        </div>
      }

      <!-- ── CONTENT ────────────────────────────────────────────── -->
      @if (!loading() && !error()) {
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

          <!-- Escuelas Destacadas -->
          @if (featuredSchools().length > 0) {
            <section class="mb-16">
              <div class="flex items-center gap-3 mb-8">
                <span class="w-1 h-7 rounded-full bg-sky-500 block"></span>
                <h2 class="text-2xl font-bold text-slate-100">Escuelas Destacadas</h2>
                <span class="px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 text-xs font-semibold">
                  {{ featuredSchools().length }}
                </span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                @for (school of featuredSchools(); track school.id) {
                  <a [routerLink]="['/schools', school.id]"
                     class="school-card group block bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-sky-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 transition-all duration-300">

                    <!-- Color band -->
                    <div class="h-1.5 w-full" [style.background]="school.color"></div>

                    <div class="p-6">
                      <div class="flex items-start justify-between mb-4">
                        <div class="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-lg"
                             [style.background]="school.color + '22'">
                          {{ school.icon }}
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
                              [style.background]="school.color + '22'"
                              [style.color]="school.color">
                          {{ schoolService.getCategoryLabel(school.category) }}
                        </span>
                      </div>

                      <h3 class="font-bold text-slate-100 text-base leading-snug group-hover:text-sky-400 transition-colors mb-2 line-clamp-2">
                        {{ school.name }}
                      </h3>
                      <p class="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-5">
                        {{ school.description }}
                      </p>

                      <div class="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-700/60 pt-4">
                        <span class="flex items-center gap-1">
                          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                          </svg>
                          {{ school.courseIds?.length ?? 0 }} cursos
                        </span>
                        @if (school.studentCount) {
                          <span class="flex items-center gap-1">
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            {{ formatCount(school.studentCount) }}
                          </span>
                        }
                      </div>
                    </div>
                  </a>
                }
              </div>
            </section>
          }

          <!-- Todas las Escuelas -->
          <section>
            <div class="flex items-center gap-3 mb-8">
              <span class="w-1 h-7 rounded-full bg-violet-500 block"></span>
              <h2 class="text-2xl font-bold text-slate-100">Todas las Escuelas</h2>
              <span class="px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-400 text-xs font-semibold">
                {{ allSchools().length }}
              </span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              @for (school of allSchools(); track school.id) {
                <a [routerLink]="['/schools', school.id]"
                   class="school-card group block bg-slate-800/60 rounded-xl border border-slate-700/60 overflow-hidden hover:border-violet-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 transition-all duration-300">

                  <div class="h-1 w-full" [style.background]="school.color"></div>

                  <div class="p-5 flex items-start gap-4">
                    <div class="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center text-2xl"
                         [style.background]="school.color + '22'">
                      {{ school.icon }}
                    </div>
                    <div class="min-w-0">
                      <h3 class="font-semibold text-slate-100 text-sm group-hover:text-violet-400 transition-colors mb-1 line-clamp-1">
                        {{ school.name }}
                      </h3>
                      <p class="text-slate-500 text-xs line-clamp-2 mb-2">{{ school.description }}</p>
                      <span class="text-[10px] font-semibold"
                            [style.color]="school.color">
                        {{ school.courseIds?.length ?? 0 }} cursos · {{ formatCount(school.studentCount ?? 0) }} estudiantes
                      </span>
                    </div>
                  </div>
                </a>
              }
            </div>
          </section>

        </div>
      }

    </div>
  `,
  styles: [`
    .school-card {
      transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                  box-shadow 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                  border-color 0.25s ease;
    }
    .school-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(56,189,248,0.08);
    }
  `]
})
export class SchoolListComponent implements OnInit {
  readonly schoolService = inject(SchoolService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly featuredSchools = signal<School[]>([]);
  readonly allSchools = signal<School[]>([]);

  ngOnInit(): void {
    this.loadSchools();
  }

  loadSchools(): void {
    this.loading.set(true);
    this.error.set(null);

    this.schoolService.getAllSchools().subscribe({
      next: (schools) => {
        this.featuredSchools.set(schools.filter(s => s.featured));
        this.allSchools.set(schools);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('No se pudieron cargar las escuelas. Intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }

  formatCount(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
    return n.toString();
  }
}