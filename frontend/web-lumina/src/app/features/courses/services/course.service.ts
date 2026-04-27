// features/courses/services/course.service.ts
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Course, CourseDetail } from '../../../core/models/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly api = inject(ApiService);

  getAll(filters?: { level?: string; search?: string }) {
    return this.api.get<Course[]>('courses', filters as Record<string, string>);
  }

  getById(id: string) {
    return this.api.get<CourseDetail>(`courses/${id}`);
  }

  create(data: any) {
    return this.api.post<{ message: string; course: Course }>('courses', data);
  }

  update(id: string, data: any) {
    return this.api.put<{ message: string; course: Course }>(`courses/${id}`, data);
  }

  delete(id: string) {
    return this.api.delete<{ message: string }>(`courses/${id}`);
  }
}