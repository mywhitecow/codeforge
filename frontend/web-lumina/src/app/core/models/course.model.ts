// core/models/course.model.ts
// CORREGIDO: eliminado el interface User duplicado — ver user.model.ts

export interface Course {
  category: any;
  id: string;
  title: string;
  shortDescription?: string;
  description: string;
  instructor: string;
  thumbnailUrl: string;
  price: number;
  rating: number;
  totalReviews: number;
  durationHours: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  schoolId?: string;
  pathId?: string;
  isPremium?: boolean;
}

export interface CourseDetail extends Course {
  syllabus: CourseSyllabus[];
  prerequisites: string[];
  enrolledCount: number;
}

export interface CourseSyllabus {
  sectionTitle: string;
  lessons: CourseSyllabusLesson[];
}

export interface CourseSyllabusLesson {
  title: string;
  durationMinutes: number;
  isCompleted?: boolean;
}