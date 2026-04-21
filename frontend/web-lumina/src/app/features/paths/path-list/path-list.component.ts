// features/paths/path-list/path-list.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-path-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="page-container text-center py-20">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                  bg-sky-50 border border-sky-200 mb-6">
        <svg class="w-8 h-8 text-sky-500" fill="none" viewBox="0 0 24 24"
             stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0
                   011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0
                   0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
        </svg>
      </div>
      <h1 class="text-2xl font-bold  text-slate-100">Rutas de Aprendizaje</h1>
      <p class=" text-slate-100 mt-2 max-w-md mx-auto">
        Estamos diseñando rutas estructuradas para llevarte de cero a experto.
        ¡Muy pronto!
      </p>
      <a routerLink="/courses" class="btn btn-primary mt-6 text-sm">
        Explorar cursos disponibles
      </a>
    </div>
  `,
})
export class PathListComponent {}