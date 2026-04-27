import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-detail-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen && course) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
           (click)="closeModal()">
        
        <div class="bg-slate-800 rounded-xl shadow-2xl w-full max-w-[600px] overflow-hidden transform transition-all"
             (click)="$event.stopPropagation()">
          
          <!-- Image Header -->
          <div class="relative h-48 sm:h-64 bg-slate-700">
            @if (course.thumbnailUrl) {
              <img [src]="course.thumbnailUrl" [alt]="course.title" class="w-full h-full object-cover" />
            }
            <button class="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    (click)="closeModal()" aria-label="Cerrar modal">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6 sm:p-8">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span class="px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm"
                    [class.bg-green-500]="course.level === 'beginner'"
                    [class.text-white]="course.level === 'beginner'"
                    [class.bg-yellow-500]="course.level === 'intermediate'"
                    [class.text-white]="course.level === 'intermediate'"
                    [class.bg-red-500]="course.level === 'advanced'"
                    [class.text-white]="course.level === 'advanced'">
                {{ levelLabels[course.level] }}
              </span>
              <div class="flex items-center text-amber-400 font-medium">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921 -.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07 -3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38 -1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span>{{ course.rating.toFixed(1) }} ({{ course.totalReviews }} reseñas)</span>
              </div>
            </div>

            <h2 class="text-2xl font-bold text-white mb-2">{{ course.title }}</h2>
            <p class="text-slate-300 text-sm mb-6 leading-relaxed">{{ course.description }}</p>

            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-slate-700/50 p-3 rounded-lg">
                <p class="text-xs text-slate-400 mb-1">Instructor</p>
                <p class="text-sm font-medium text-white flex items-center">
                  <svg class="w-4 h-4 mr-2 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {{ course.instructor }}
                </p>
              </div>
              <div class="bg-slate-700/50 p-3 rounded-lg">
                <p class="text-xs text-slate-400 mb-1">Duración</p>
                <p class="text-sm font-medium text-white flex items-center">
                  <svg class="w-4 h-4 mr-2 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ course.durationHours }} horas
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between mt-8 pt-4 border-t border-slate-700">
              <div>
                <p class="text-xs text-slate-400">Precio del curso</p>
                <p class="text-2xl font-bold text-white">
                  @if (course.price === 0) {
                    <span class="text-green-500">Gratis</span>
                  } @else {
                    $ {{ course.price.toFixed(2) }}
                  }
                </p>
              </div>
              <div class="flex gap-3">
                <button class="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors font-medium text-sm"
                        (click)="closeModal()">
                  Cerrar
                </button>
                <button class="px-6 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white transition-colors font-medium text-sm shadow-lg shadow-sky-500/30"
                        (click)="closeModal()">
                  Inscribirse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class CourseDetailModalComponent {
  @Input() course: Course | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  readonly levelLabels: Record<string, string> = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  };

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isOpen) {
      this.closeModal();
    }
  }

  closeModal() {
    this.close.emit();
  }
}
