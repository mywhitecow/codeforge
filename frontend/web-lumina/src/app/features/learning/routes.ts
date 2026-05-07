import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/role.guard';
import { LearnCourseComponent } from './learn-course/learn-course.component';

export const LEARNING_ROUTES: Routes = [
  {
    path: 'course/:id',
    component: LearnCourseComponent,
    canActivate: [authGuard],
  },
  {
    path: 'course/:id/quiz',
    component: LearnCourseComponent,
    canActivate: [authGuard],
  },
  {
    path: 'exam/:courseId',
    loadComponent: () =>
      import('./exam/exam.component').then(m => m.ExamComponent),
    canActivate: [authGuard],
  },
  {
    path: 'exam-results',
    loadComponent: () =>
      import('./exam-results/exam-results.component').then(m => m.ExamResultsComponent),
    canActivate: [authGuard],
  },
];