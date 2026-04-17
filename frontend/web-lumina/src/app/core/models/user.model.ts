// core/models/user.model.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  enrolledCourseIds: string[];
  createdAt: string;
}