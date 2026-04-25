// features/admin/courses/admin-course-form.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-course-form',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-container">
      <h1 class="section-title">Formulario de Curso</h1>
      <div class="card p-12 text-center">
        <p class="text-5xl mb-4">🚧</p>
        <p class="text-xl font-semibold text-slate-200">En construcción</p>
        <p class="text-slate-400 mt-2 mb-6">Esta sección está siendo desarrollada.</p>
        <a routerLink="/admin/courses" class="btn btn-ghost">← Volver a cursos</a>
      </div>
    </div>
  `,
})
export class AdminCourseFormComponent {}
