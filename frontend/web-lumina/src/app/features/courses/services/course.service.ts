// features/courses/services/course.service.ts
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Course, CourseDetail } from '../../../core/models/course.model';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Angular Avanzado: Patrones y RxJS',
    shortDescription: 'Domina Angular con patrones avanzados y programación reactiva con RxJS.',
    description: 'En este curso aprenderás a estructurar aplicaciones Angular escalables, implementar patrones de diseño modernos y dominar el uso de RxJS para el manejo de flujos asíncronos complejos. Incluye proyectos reales y best practices de la industria.',
    instructor: 'Ana García',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&q=80',
    price: 49.99,
    rating: 4.8,
    totalReviews: 1240,
    durationHours: 12,
    level: 'advanced',
    tags: ['Angular', 'RxJS', 'Frontend'],
    category: undefined
  },
  {
    id: '2',
    title: 'Introducción a React y Hooks',
    shortDescription: 'Crea tu primera aplicación con React desde cero.',
    description: 'Descubre el ecosistema de React, aprende a crear componentes reutilizables, manejar el estado con Hooks y gestionar efectos secundarios. Ideal para quienes inician en el mundo del desarrollo frontend moderno.',
    instructor: 'Carlos López',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
    price: 29.99,
    rating: 4.6,
    totalReviews: 890,
    durationHours: 8,
    level: 'beginner',
    tags: ['React', 'JavaScript', 'Frontend'],
    category: undefined
  },
  {
    id: '3',
    title: 'Node.js y Microservicios',
    shortDescription: 'Construye backends escalables con Node y arquitectura de microservicios.',
    description: 'Aprende a diseñar y construir APIs robustas con Node.js, Express y MongoDB. Descubre cómo dividir un monolito en microservicios, comunicarlos a través de eventos y desplegarlos usando Docker.',
    instructor: 'María Rodríguez',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80',
    price: 59.99,
    rating: 4.9,
    totalReviews: 2100,
    durationHours: 20,
    level: 'advanced',
    tags: ['Node.js', 'Backend', 'Microservices'],
    category: undefined
  },
  {
    id: '4',
    title: 'Fundamentos de Python',
    shortDescription: 'El lenguaje de mayor crecimiento en el mundo.',
    description: 'Aprende a programar desde cero con Python. Veremos estructuras de datos, control de flujo, funciones, programación orientada a objetos y una introducción al análisis de datos.',
    instructor: 'David Torres',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=80',
    price: 19.99,
    rating: 4.5,
    totalReviews: 3200,
    durationHours: 10,
    level: 'beginner',
    tags: ['Python', 'Programming'],
    category: undefined
  },
  {
    id: '5',
    title: 'Diseño UX/UI para Desarrolladores',
    shortDescription: 'Mejora el aspecto visual y la experiencia de tus aplicaciones.',
    description: 'Curso práctico donde aprenderás los principios del diseño de interfaces y experiencia de usuario. Aprenderás a usar Figma y a implementar sistemas de diseño para que tus apps se vean profesionales.',
    instructor: 'Laura Méndez',
    thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    price: 39.99,
    rating: 4.7,
    totalReviews: 450,
    durationHours: 6,
    level: 'intermediate',
    tags: ['UX', 'UI', 'Design'],
    category: undefined
  },
  {
    id: '6',
    title: 'DevOps y CI/CD con GitHub Actions',
    shortDescription: 'Automatiza tus flujos de trabajo y despliegues.',
    description: 'Aprende las mejores prácticas de integración y entrega continua (CI/CD) utilizando GitHub Actions. Veremos cómo correr tests automáticos, hacer linting de código y desplegar a producción sin esfuerzo.',
    instructor: 'Javier Ruiz',
    thumbnailUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&q=80',
    price: 54.99,
    rating: 4.8,
    totalReviews: 670,
    durationHours: 15,
    level: 'intermediate',
    tags: ['DevOps', 'CI/CD', 'GitHub'],
    category: undefined
  },
  {
    id: '7',
    title: 'Mastering TypeScript',
    shortDescription: 'Eleva tu código JavaScript a otro nivel con tipos fuertes.',
    description: 'Domina los conceptos avanzados de TypeScript: genéricos, tipos condicionales, decoradores y utility types. Aprende a escribir código más seguro y mantenible.',
    instructor: 'Elena Silva',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&q=80',
    price: 44.99,
    rating: 4.9,
    totalReviews: 1100,
    durationHours: 9,
    level: 'intermediate',
    tags: ['TypeScript', 'JavaScript'],
    category: undefined
  },
  {
    id: '8',
    title: 'Machine Learning Básico',
    shortDescription: 'Introducción a la inteligencia artificial y algoritmos de ML.',
    description: 'Un curso introductorio donde aprenderás a entrenar tus primeros modelos de regresión y clasificación usando Scikit-Learn y Python. Ideal para dar tus primeros pasos en IA.',
    instructor: 'Roberto Castro',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80',
    price: 69.99,
    rating: 4.7,
    totalReviews: 890,
    durationHours: 25,
    level: 'advanced',
    tags: ['AI', 'Machine Learning', 'Python'],
    category: undefined
  }
];

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly api = inject(ApiService);

  getAll(filters?: { level?: string; search?: string }): Observable<Course[]> {
    return this.api.get<Course[]>('courses', filters as Record<string, string>).pipe(
      map(data => {
        if (!data || data.length === 0) {
          let result = MOCK_COURSES;
          if (filters?.level) {
            result = result.filter(c => c.level === filters.level);
          }
          return result;
        }
        return data;
      }),
      catchError(() => {
        let result = MOCK_COURSES;
        if (filters?.level) {
          result = result.filter(c => c.level === filters.level);
        }
        return of(result);
      })
    );
  }

  getById(id: string): Observable<CourseDetail> {
    return this.api.get<CourseDetail>(`courses/${id}`);
  }

  create(data: any): Observable<{ message: string; course: Course }> {
    return this.api.post<{ message: string; course: Course }>('courses', data);
  }

  update(id: string, data: any): Observable<{ message: string; course: Course }> {
    return this.api.put<{ message: string; course: Course }>(`courses/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`courses/${id}`);
  }
}