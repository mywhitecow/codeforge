// features/schools/services/school.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { School } from '../../../core/models/school.model';
import { Course } from '../../../core/models/course.model';
import { CourseService } from '../../courses/services/course.service';

// ──────────────────────────────────────────────────────────────
// Mock data: 10 escuelas variadas
// ──────────────────────────────────────────────────────────────
export const MOCK_SCHOOLS: School[] = [
  {
    id: 'school-1',
    name: 'Lumina Studio',
    description: 'Domina el stack completo: desde HTML y CSS hasta Angular, React y Node.js. Construye aplicaciones modernas y escalables.',
    icon: '🌐',
    featured: true,
    category: 'programming',
    courseIds: ['1', '2', '3'],
    studentCount: 12400,
    instructorCount: 8,
    color: '#38bdf8',
  },
  {
    id: 'school-2',
    name: 'Escuela de Diseño UX/UI',
    description: 'Aprende a crear experiencias digitales impactantes. Figma, sistemas de diseño, prototipado y principios de usabilidad.',
    icon: '🎨',
    featured: true,
    category: 'design',
    courseIds: ['5'],
    studentCount: 5800,
    instructorCount: 4,
    color: '#a78bfa',
  },
  {
    id: 'school-3',
    name: 'Escuela de Data Science',
    description: 'Extrae valor de los datos. Python, Machine Learning, visualización y análisis estadístico para el mundo real.',
    icon: '📊',
    featured: true,
    category: 'data',
    courseIds: ['4', '8'],
    studentCount: 9200,
    instructorCount: 6,
    color: '#34d399',
  },
  {
    id: 'school-4',
    name: 'Escuela de DevOps & Cloud',
    description: 'Automatiza, escala y despliega con confianza. CI/CD, Docker, Kubernetes y las principales plataformas cloud.',
    icon: '☁️',
    featured: true,
    category: 'devops',
    courseIds: ['6'],
    studentCount: 4300,
    instructorCount: 3,
    color: '#fb923c',
  },
  {
    id: 'school-5',
    name: 'Escuela de TypeScript & JavaScript',
    description: 'Profundiza en el ecosistema JS moderno. Tipos avanzados, patrones funcionales y herramientas de productividad.',
    icon: '⚡',
    featured: false,
    category: 'programming',
    courseIds: ['7'],
    studentCount: 7600,
    instructorCount: 5,
    color: '#facc15',
  },
  {
    id: 'school-6',
    name: 'Escuela de Marketing Digital',
    description: 'SEO, SEM, redes sociales, email marketing y analítica web. Todo lo que necesitas para crecer en el mundo digital.',
    icon: '📢',
    featured: false,
    category: 'marketing',
    courseIds: [],
    studentCount: 3100,
    instructorCount: 4,
    color: '#f472b6',
  },
  {
    id: 'school-7',
    name: 'Escuela de Idiomas',
    description: 'Inglés técnico, escritura profesional y comunicación efectiva para desarrolladores y equipos tecnológicos.',
    icon: '🗣️',
    featured: false,
    category: 'languages',
    courseIds: [],
    studentCount: 2800,
    instructorCount: 6,
    color: '#2dd4bf',
  },
  {
    id: 'school-8',
    name: 'Escuela de Ciberseguridad',
    description: 'Pentesting, análisis de vulnerabilidades, criptografía y defensa de sistemas. Protege el mundo digital.',
    icon: '🔐',
    featured: false,
    category: 'security',
    courseIds: [],
    studentCount: 1900,
    instructorCount: 3,
    color: '#f87171',
  },
  {
    id: 'school-9',
    name: 'Escuela de Negocios Tech',
    description: 'Emprendimiento digital, gestión de productos, metodologías ágiles y liderazgo en equipos de tecnología.',
    icon: '💼',
    featured: false,
    category: 'business',
    courseIds: [],
    studentCount: 2200,
    instructorCount: 5,
    color: '#60a5fa',
  },
  {
    id: 'school-10',
    name: 'Escuela de Python',
    description: 'El lenguaje más versátil del mundo. Automatización, scripting, web scraping, APIs y mucho más.',
    icon: '🐍',
    featured: true,
    category: 'programming',
    courseIds: ['4', '8'],
    studentCount: 15000,
    instructorCount: 9,
    color: '#86efac',
  },
];

@Injectable({ providedIn: 'root' })
export class SchoolService {
  private readonly courseService = inject(CourseService);

  getAllSchools(): Observable<School[]> {
    return of(MOCK_SCHOOLS);
  }

  getFeaturedSchools(): Observable<School[]> {
    return of(MOCK_SCHOOLS.filter(s => s.featured));
  }

  getSchoolById(id: string): Observable<School | undefined> {
    return of(MOCK_SCHOOLS.find(s => s.id === id));
  }

  getCoursesBySchool(schoolId: string): Observable<Course[]> {
    const school = MOCK_SCHOOLS.find(s => s.id === schoolId);
    if (!school || !school.courseIds || school.courseIds.length === 0) {
      return of([]);
    }
    const ids = school.courseIds;
    return this.courseService.getAll().pipe(
      map(courses => courses.filter(c => ids.includes(c.id)))
    );
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      programming: 'Programación',
      design: 'Diseño',
      marketing: 'Marketing',
      languages: 'Idiomas',
      data: 'Datos & IA',
      devops: 'DevOps',
      business: 'Negocios',
      security: 'Seguridad',
    };
    return labels[category] ?? category;
  }
}
