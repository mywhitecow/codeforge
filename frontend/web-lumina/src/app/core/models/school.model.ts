// core/models/school.model.ts

export interface School {
  id: string;
  name: string;
  description: string;
  icon: string;           // emoji o URL de icono
  featured: boolean;
  category: SchoolCategory;
  courseIds?: string[];
  studentCount?: number;
  instructorCount?: number;
  color?: string;         // color de acento para la card
}

export type SchoolCategory =
  | 'programming'
  | 'design'
  | 'marketing'
  | 'languages'
  | 'data'
  | 'devops'
  | 'business'
  | 'security';
