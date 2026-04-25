// features/instructor/routes.ts
// ─────────────────────────────────────────────────────────────────────────────
// Rutas del panel de instructor.
//
// Restricción de ownership:
//   El guard de ruta solo valida el ROL (admin | instructor).
//   La validación de ownership (¿este instructor es dueño de ESTE curso?)
//   se hace en el COMPONENTE, no en el guard — porque necesita datos del curso.
//   En producción: el backend también valida ownership en cada endpoint.
//
// Estructura:
//   /instructor                   → Dashboard del instructor
//   /instructor/courses           → Mis cursos
//   /instructor/courses/new       → Crear curso
//   /instructor/courses/:id/edit  → Editar mi curso
//   /instructor/courses/:id/students → Estudiantes inscritos
// ─────────────────────────────────────────────────────────────────────────────
import { Routes } from '@angular/router';
import { instructorGuard } from '../../core/guards/role.guard';

export const INSTRUCTOR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [instructorGuard],
    loadComponent: () =>
      import('./dashboard/instructor-dashboard.component').then(
        m => m.InstructorDashboardComponent
      ),
  },
  {
    path: 'courses',
    canActivate: [instructorGuard],
    loadComponent: () =>
      import('./courses/instructor-course-list.component').then(
        m => m.InstructorCourseListComponent
      ),
  },
  {
    path: 'courses/new',
    canActivate: [instructorGuard],
    loadComponent: () =>
      import('./courses/instructor-course-form.component').then(
        m => m.InstructorCourseFormComponent
      ),
  },
  {
    path: 'courses/:id/edit',
    canActivate: [instructorGuard],
    loadComponent: () =>
      import('./courses/instructor-course-form.component').then(
        m => m.InstructorCourseFormComponent
      ),
  },
  {
    path: 'courses/:id/students',
    canActivate: [instructorGuard],
    loadComponent: () =>
      import('./students/instructor-students.component').then(
        m => m.InstructorStudentsComponent
      ),
  },
];