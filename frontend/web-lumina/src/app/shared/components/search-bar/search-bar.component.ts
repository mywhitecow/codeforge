// search-bar.component.ts
// Archivo: frontend/web-codeforge-academy/src/app/shared/components/search-bar/search-bar.component.ts
//
// CAMBIOS vs versión original:
//  1. El input usa la clase global "input-search" (definida en styles.scss)
//     en vez de solo clases Tailwind utilitarias → funciona aunque Tailwind tarde en cargar
//  2. El SVG del ícono tiene width/height explícitos como atributos HTML
//     → nunca se mostrará gigante aunque CSS no cargue aún
//  3. Añadido title para accesibilidad

import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="relative w-full">

      <!-- Ícono lupa — width/height como ATRIBUTOS HTML para que nunca sea gigante -->
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        style="flex-shrink:0"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" stroke-width="2" />
        <path d="M21 21l-4.35-4.35" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <!-- Input -->
      <input
        type="search"
        [(ngModel)]="searchTerm"
        (keyup.enter)="onSearch()"
        placeholder="Buscar cursos, rutas, escuelas..."
        class="input-search"
        aria-label="Buscar en CodeForge Academy"
        autocomplete="off"
      />

      <!-- Botón borrar -->
      @if (searchTerm()) {
        <button
          (click)="clearSearch()"
          class="absolute right-3 top-1/2 -translate-y-1/2
                 text-gray-400 hover:text-white transition-colors"
          aria-label="Borrar búsqueda"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12"
                  stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      }

    </div>
  `,
})
export class SearchBarComponent {
  searchTerm = signal('');
  search = output<string>();

  onSearch(): void {
    const term = this.searchTerm().trim();
    if (term) {
      this.search.emit(term);
    }
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }
}