// features/schools/school-detail/school-detail.component.ts
import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, of } from 'rxjs';

import { School } from '../../../core/models/school.model';
import { Course } from '../../../core/models/course.model';
import { SchoolService } from '../services/school.service';
import { CourseCardComponent } from '../../courses/components/course-card/course-card.component';
import { CourseDetailModalComponent } from '../../courses/components/course-detail-modal/course-detail-modal.component';

// ── Mock sidebar data ────────────────────────────────────────────
interface FeaturedStudent {
  name: string;
  avatar: string;
  achievement: string;
  courseCompleted: string;
}

interface RecentPost {
  author: string;
  avatar: string;
  title: string;
  timeAgo: string;
  tags: string[];
}

const MOCK_STUDENTS: FeaturedStudent[] = [
  { name: 'Sofía M.', avatar: '👩‍💻', achievement: '100% en el camino React', courseCompleted: 'Introducción a React' },
  { name: 'Juan P.', avatar: '👨‍💻', achievement: 'Proyecto final aprobado', courseCompleted: 'Angular Avanzado' },
  { name: 'Valentina R.', avatar: '👩‍🎨', achievement: 'Portfolio publicado', courseCompleted: 'Diseño UX/UI' },
  { name: 'Miguel A.', avatar: '🧑‍💻', achievement: 'Certificado obtenido', courseCompleted: 'Node.js y Microservicios' },
];

const MOCK_POSTS: RecentPost[] = [
  { author: 'Ana García', avatar: '👩‍🏫', title: '¿Cómo escalar una app Angular sin perder performance?', timeAgo: 'Hace 2h', tags: ['Angular', 'Performance'] },
  { author: 'Carlos López', avatar: '🧑‍🏫', title: 'Hooks que deberías conocer en React 18', timeAgo: 'Hace 5h', tags: ['React', 'Hooks'] },
  { author: 'María R.', avatar: '👩‍💻', title: 'Introducción a Node.js con ESM modules', timeAgo: 'Hace 1d', tags: ['Node.js', 'Backend'] },
  { author: 'David T.', avatar: '🧑‍💻', title: 'Python para análisis de datos: primeros pasos', timeAgo: 'Hace 2d', tags: ['Python', 'Data'] },
];

@Component({
  selector: 'app-school-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CourseCardComponent, CourseDetailModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-slate-900 text-slate-100">

      <!-- ── BACK NAV ──────────────────────────────────────────── -->
      <div class="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
          <a routerLink="/schools"
             class="flex items-center gap-1.5 text-slate-400 hover:text-sky-400 text-sm transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Escuelas
          </a>
          <span class="text-slate-700">/</span>
          <span class="text-slate-300 text-sm font-medium truncate">{{ school()?.name }}</span>
        </div>
      </div>

      <!-- ── LOADING ───────────────────────────────────────────── -->
      @if (loading()) {
        <div class="flex items-center justify-center py-40">
          <div class="flex flex-col items-center gap-4">
            <div class="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div>
            <p class="text-slate-500 text-sm">Cargando escuela…</p>
          </div>
        </div>
      }

      <!-- ── NOT FOUND ─────────────────────────────────────────── -->
      @if (!loading() && !school()) {
        <div class="max-w-xl mx-auto py-32 text-center px-6">
          <span class="text-6xl mb-4 block">🏫</span>
          <h2 class="text-2xl font-bold text-slate-200 mb-3">Escuela no encontrada</h2>
          <p class="text-slate-500 mb-6">No pudimos encontrar la escuela que buscas.</p>
          <a routerLink="/schools"
             class="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 rounded-lg text-white font-medium transition-colors inline-block">
            Volver a Escuelas
          </a>
        </div>
      }

      <!-- ── CONTENT ────────────────────────────────────────────── -->
      @if (!loading() && school(); as s) {

        <!-- Hero de la Escuela -->
        <section class="relative overflow-hidden"
                 [style.background]="'linear-gradient(135deg, #0f172a 0%, ' + (s.color ?? '#38bdf8') + '18 100%)'">
          <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div class="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
                 [style.background]="s.color"></div>
          </div>
          <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div class="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl flex-shrink-0"
                   [style.background]="(s.color ?? '#38bdf8') + '22'">
                {{ s.icon }}
              </div>
              <div class="flex-1 min-w-0">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 inline-block"
                      [style.background]="(s.color ?? '#38bdf8') + '22'"
                      [style.color]="s.color ?? '#38bdf8'">
                  {{ schoolService.getCategoryLabel(s.category) }}
                </span>
                <h1 class="text-3xl md:text-4xl font-extrabold text-slate-100 mb-2">{{ s.name }}</h1>
                <p class="text-slate-400 text-base max-w-2xl">{{ s.description }}</p>
              </div>

              <!-- Stats -->
              <div class="flex gap-6 mt-2 sm:mt-0 flex-shrink-0">
                <div class="text-center">
                  <p class="text-2xl font-bold" [style.color]="s.color">{{ courses().length }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">Cursos</p>
                </div>
                @if (s.studentCount) {
                  <div class="text-center">
                    <p class="text-2xl font-bold" [style.color]="s.color">{{ formatCount(s.studentCount) }}</p>
                    <p class="text-xs text-slate-500 mt-0.5">Estudiantes</p>
                  </div>
                }
                @if (s.instructorCount) {
                  <div class="text-center">
                    <p class="text-2xl font-bold" [style.color]="s.color">{{ s.instructorCount }}</p>
                    <p class="text-xs text-slate-500 mt-0.5">Instructores</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </section>

        <!-- ── DOS COLUMNAS ──────────────────────────────────────── -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="flex flex-col lg:flex-row gap-10">

            <!-- Columna izquierda: cursos -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-7">
                <span class="w-1 h-7 rounded-full block" [style.background]="s.color"></span>
                <h2 class="text-xl font-bold text-slate-100">Cursos de esta escuela</h2>
              </div>

              @if (coursesLoading()) {
                <div class="flex items-center gap-3 py-16 justify-center">
                  <div class="w-8 h-8 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div>
                  <span class="text-slate-500 text-sm">Cargando cursos…</span>
                </div>
              } @else if (courses().length === 0) {
                <div class="py-20 text-center">
                  <span class="text-5xl mb-4 block">📚</span>
                  <p class="text-slate-400 text-lg font-semibold mb-1">Próximamente</p>
                  <p class="text-slate-600 text-sm">Esta escuela aún no tiene cursos publicados.</p>
                </div>
              } @else {
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  @for (course of courses(); track course.id; let i = $index) {
                    <app-course-card
                      [course]="course"
                      [isFirst]="i === 0"
                      (showDetails)="openModal($event)"
                    />
                  }
                </div>
              }
            </div>

            <!-- Columna derecha: sidebar -->
            <aside class="w-full lg:w-80 flex-shrink-0 space-y-8">

              <!-- Estudiantes destacados -->
              <div class="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div class="px-5 py-4 border-b border-slate-700 flex items-center gap-2">
                  <span class="text-lg">🏆</span>
                  <h3 class="font-bold text-slate-100 text-sm">Estudiantes Destacados</h3>
                </div>
                <ul class="divide-y divide-slate-700/50">
                  @for (student of students; track student.name) {
                    <li class="px-5 py-4 flex items-center gap-3 hover:bg-slate-700/30 transition-colors">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-slate-700 flex-shrink-0">
                        {{ student.avatar }}
                      </div>
                      <div class="min-w-0">
                        <p class="text-slate-200 text-xs font-semibold truncate">{{ student.name }}</p>
                        <p class="text-slate-500 text-xs truncate">{{ student.achievement }}</p>
                        <p class="text-[10px] truncate mt-0.5" [style.color]="s.color">{{ student.courseCompleted }}</p>
                      </div>
                    </li>
                  }
                </ul>
              </div>

              <!-- Publicaciones recientes (timeline) -->
              <div class="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div class="px-5 py-4 border-b border-slate-700 flex items-center gap-2">
                  <span class="text-lg">📰</span>
                  <h3 class="font-bold text-slate-100 text-sm">Publicaciones Recientes</h3>
                </div>
                <ul class="px-5 py-4 space-y-5">
                  @for (post of posts; track post.title; let last = $last) {
                    <li class="relative pl-5">
                      <!-- Timeline dot + line -->
                      <span class="absolute left-0 top-1.5 w-2 h-2 rounded-full block"
                            [style.background]="s.color ?? '#38bdf8'"></span>
                      @if (!last) {
                        <span class="absolute left-[3px] top-4 bottom-0 w-px bg-slate-700 block"></span>
                      }

                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-base">{{ post.avatar }}</span>
                        <span class="text-slate-400 text-xs">{{ post.author }}</span>
                        <span class="ml-auto text-[10px] text-slate-600">{{ post.timeAgo }}</span>
                      </div>
                      <p class="text-slate-200 text-xs font-medium leading-snug mb-2">{{ post.title }}</p>
                      <div class="flex flex-wrap gap-1">
                        @for (tag of post.tags; track tag) {
                          <span class="px-1.5 py-0.5 rounded text-[10px] bg-slate-700 text-slate-400">#{{ tag }}</span>
                        }
                      </div>
                    </li>
                  }
                </ul>
              </div>

            </aside>
          </div>
        </div>
      }

    </div>

    <!-- ── MODAL ───────────────────────────────────────────────── -->
    @if (selectedCourse()) {
      <app-course-detail-modal
        [course]="selectedCourse()!"
        [isOpen]="true"
        (close)="closeModal()"
      />
    }
  `,
  styles: []
})
export class SchoolDetailComponent implements OnInit {
  readonly schoolService = inject(SchoolService);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(true);
  readonly coursesLoading = signal(false);
  readonly school = signal<School | undefined>(undefined);
  readonly courses = signal<Course[]>([]);
  readonly selectedCourse = signal<Course | null>(null);

  readonly students = MOCK_STUDENTS;
  readonly posts = MOCK_POSTS;

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id') ?? '';
        this.loading.set(true);
        this.coursesLoading.set(true);
        return this.schoolService.getSchoolById(id);
      })
    ).subscribe({
      next: (school) => {
        this.school.set(school);
        this.loading.set(false);

        if (school) {
          this.schoolService.getCoursesBySchool(school.id).subscribe({
            next: (courses) => {
              this.courses.set(courses);
              this.coursesLoading.set(false);
            },
            error: () => this.coursesLoading.set(false)
          });
        } else {
          this.coursesLoading.set(false);
        }
      },
      error: () => {
        this.loading.set(false);
        this.coursesLoading.set(false);
      }
    });
  }

  openModal(course: Course): void {
    this.selectedCourse.set(course);
  }

  closeModal(): void {
    this.selectedCourse.set(null);
  }

  formatCount(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
    return n.toString();
  }
}
