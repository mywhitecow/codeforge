import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card group flex flex-col h-full bg-slate-800 rounded-lg overflow-hidden shadow-lg border border-slate-700 w-[90vw] md:w-[220px] lg:w-[280px] flex-shrink-0 cursor-pointer"
         (click)="showDetails.emit(course)">
      
      <!-- Thumbnail -->
      <div class="relative overflow-hidden h-40 bg-gradient-to-br from-sky-900 to-slate-800">
        @if (course.thumbnailUrl) {
          <img [src]="course.thumbnailUrl"
               [alt]="course.title"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
               loading="lazy" />
        } @else {
          <div class="flex items-center justify-center h-full">
            <svg class="w-10 h-10 text-sky-500 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
        }

        <!-- Badge nivel -->
        <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-semibold shadow-sm"
              [class.bg-green-500]="course.level === 'beginner'"
              [class.text-white]="course.level === 'beginner'"
              [class.bg-yellow-500]="course.level === 'intermediate'"
              [class.text-white]="course.level === 'intermediate'"
              [class.bg-red-500]="course.level === 'advanced'"
              [class.text-white]="course.level === 'advanced'">
          {{ levelLabels[course.level] }}
        </span>
      </div>

      <!-- Info -->
      <div class="p-4 flex flex-col flex-grow">
        <h3 class="font-semibold text-slate-100 text-base leading-snug group-hover:text-sky-400 transition-colors line-clamp-2 mb-1">
          {{ course.title }}
        </h3>
        
        <p class="text-xs text-slate-400 mb-3 line-clamp-2 flex-grow">
          {{ course.shortDescription || course.description }}
        </p>

        <!-- Rating & Reviews -->
        <div class="flex items-center gap-1 mt-auto">
          <span class="text-amber-400 text-xs font-bold">{{ course.rating.toFixed(1) }}</span>
          <div class="flex gap-0.5">
            @for (star of [1,2,3,4,5]; track star) {
              <svg class="w-3 h-3" viewBox="0 0 20 20"
                   [class.text-amber-400]="star <= course.rating"
                   [class.text-slate-600]="star > course.rating"
                   fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921 -.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07 -3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38 -1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            }
          </div>
          <span class="text-xs text-slate-500 ml-1">({{ course.totalReviews }})</span>
        </div>

        <button class="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-md transition-colors"
                (click)="onButtonClick($event)">
          Ver detalles
        </button>
      </div>
    </div>
  `
})
export class CourseCardComponent {
  @Input({ required: true }) course!: Course;
  @Output() showDetails = new EventEmitter<Course>();

  readonly levelLabels: Record<string, string> = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  };

  onButtonClick(event: Event) {
    event.stopPropagation();
    this.showDetails.emit(this.course);
  }
}
