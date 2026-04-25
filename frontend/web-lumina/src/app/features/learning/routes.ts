// features/learning/routes.ts
import { Routes } from '@angular/router';
import { LearningPlaceholderComponent } from './learning-placeholder.component';

export const LEARNING_ROUTES: Routes = [
  { path: '', component: LearningPlaceholderComponent },
  { path: '**', component: LearningPlaceholderComponent },
];
