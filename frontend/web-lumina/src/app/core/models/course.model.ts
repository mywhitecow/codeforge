// core/models/user.model.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  enrolledCourseIds: string[];
  createdAt: string;
}

// core/models/course.model.ts
export interface Course {
  id: string;
  title: string;
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
}

export interface CourseDetail extends Course {
  syllabus: CourseSyllabus[];
  prerequisites: string[];
  enrolledCount: number;
}

export interface CourseSyllabus {
  sectionTitle: string;
  lessons: { title: string; durationMinutes: number }[];
}