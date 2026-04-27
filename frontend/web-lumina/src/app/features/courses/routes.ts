// features/courses/routes.ts
import { Routes } from '@angular/router';
import { CourseCatalogComponent } from './course-catalog/course-catalog.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';

export const COURSE_ROUTES: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: CourseCatalogComponent },
  { path: ':id', component: CourseDetailComponent },
];