// search-bar.component.ts
// Buscador minimalista con Tailwind CSS - sin badge de dificultad

import {
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Course } from '../../../core/models/course.model';
import { CourseService } from '../../../features/courses/services/course.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, ClickOutsideDirective],
  template: `
    <div
      class="relative w-full max-w-md mx-auto"
      clickOutside
      (clickOutside)="closeDropdown()"
    >
      <!-- Icono lupa -->
      <svg
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <!-- Input de búsqueda -->
      <input
        id="search-bar-input"
        type="search"
        [(ngModel)]="searchTerm"
        (input)="onInput()"
        (focus)="onFocus()"
        placeholder="Buscar cursos, rutas..."
        class="w-full bg-[#1a1d27] border border-white/10 rounded-xl py-2.5 pl-9 pr-9 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
        aria-label="Buscar en Lumina"
        aria-autocomplete="list"
        aria-controls="search-dropdown"
        [attr.aria-expanded]="showDropdown()"
        autocomplete="off"
      />

      <!-- Botón borrar -->
      @if (searchTerm()) {
        <button
          (click)="clearSearch()"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition p-1 rounded-full"
          aria-label="Borrar búsqueda"
          type="button"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" />
          </svg>
        </button>
      }

      <!-- Dropdown de resultados (mismo ancho que el input) -->
      @if (showDropdown()) {
        <ul
          id="search-dropdown"
          class="absolute top-full mt-2 left-0 right-0 w-full bg-[#1a1d27] border border-white/10 rounded-xl shadow-2xl backdrop-blur-sm max-h-96 overflow-y-auto z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150"
          role="listbox"
        >
          @for (course of filteredCourses(); track course.id) {
            <li
              class="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-white/5 focus:bg-white/5 outline-none rounded-lg mx-1 my-0.5"
              role="option"
              (click)="navigateTo(course)"
              (keydown.enter)="navigateTo(course)"
              tabindex="0"
            >
              <!-- Icono del curso (fijo) -->
              <div class="flex-shrink-0 text-indigo-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 9h6M9 13h4" stroke-linecap="round" />
                </svg>
              </div>

              <!-- Contenedor de texto (título + descripción) -->
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-white" [innerHTML]="highlight(course.title)"></div>
                @if (course.shortDescription) {
                  <div class="text-xs text-gray-400 truncate">{{ course.shortDescription }}</div>
                }
              </div>
            </li>
          }

          @empty {
            <li class="flex items-center justify-center gap-2 px-4 py-6 text-sm text-gray-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" stroke-linecap="round" />
              </svg>
              <span>Sin resultados para "<strong class="text-white">{{ searchTerm() }}</strong>"</span>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [
    // No se necesita CSS adicional porque usamos Tailwind.
    // Si no tienes animaciones de Tailwind, puedes añadir esto manualmente:
    `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-in {
      animation: fadeIn 0.15s ease-out forwards;
    }
    `,
  ],
})
export class SearchBarComponent {
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);

  searchTerm = signal('');
  private isOpen = signal(false);

  filteredCourses = computed<Course[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return [];
    return this.courseService.getAllCourses().filter(
      (course) =>
        course.title.toLowerCase().includes(term) ||
        (course.shortDescription ?? '').toLowerCase().includes(term) ||
        course.tags.some((tag) => tag.toLowerCase().includes(term)) ||
        course.instructor.toLowerCase().includes(term)
    );
  });

  showDropdown = computed(() => this.isOpen() && this.searchTerm().trim().length > 0);

  @HostListener('keydown.escape')
  onEscape(): void {
    this.closeDropdown();
  }

  onInput(): void {
    this.isOpen.set(true);
  }

  onFocus(): void {
    if (this.searchTerm().trim()) {
      this.isOpen.set(true);
    }
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.isOpen.set(false);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  navigateTo(course: Course): void {
    this.isOpen.set(false);
    this.searchTerm.set('');
    this.router.navigate(['/courses', course.id]);
  }

  highlight(text: string): string {
    const term = this.searchTerm().trim();
    if (!term) return text;
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(
      new RegExp(`(${escaped})`, 'gi'),
      '<mark class="bg-yellow-300 text-black font-semibold px-0.5 rounded">$1</mark>'
    );
  }
}