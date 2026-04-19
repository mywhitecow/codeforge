// core/models/user.model.ts
// Única fuente de verdad para User — no duplicar en course.model.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  enrolledCourseIds: string[];
  createdAt: string;
}