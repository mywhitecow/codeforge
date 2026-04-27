// core/models/user.model.ts
// ─────────────────────────────────────────────────────────────────────────────
// CAMBIOS vs versión anterior:
//   1. Se añade `UserRole` como union type canónico y fuente de verdad de roles
//   2. `User.role` es campo requerido — el backend SIEMPRE debe devolverlo
//   3. Se añade `subscriptionTier` para el modelo de acceso de Estudiante
//   4. `enrolledCourseIds` se mantiene — los Estudiantes tienen cursos inscritos
//   5. `ownedCourseIds` para Instructores (cursos que ellos crearon)
// ─────────────────────────────────────────────────────────────────────────────

/** Roles del sistema. Orden de privilegio: admin > instructor > student */
export type UserRole = 'admin' | 'instructor' | 'student';

/**
 * Niveles de suscripción del Estudiante.
 * `free`    → solo cursos gratuitos
 * `basic`   → cursos hasta tier "basic"
 * `premium` → acceso total
 */
export type SubscriptionTier = 'free' | 'basic' | 'premium';

export interface User {
  id:               string;
  name:             string;
  email:            string;
  role:             UserRole;

  // ── Perfil ────────────────────────────────────────────────────────────────
  avatarUrl?:       string;
  bio?:             string;
  phone?:           string;
  dateOfBirth?:     string;   // ISO date string
  isActive?:        boolean;
  lastLoginAt?:     string;
  createdAt:        string;

  // ── Seguridad (flags, no se exponen los IDs) ──────────────────────────────
  hasPassword?:     boolean;  // false si se registró solo con OAuth (password=null)
  hasGoogle?:       boolean;
  hasGithub?:       boolean;

  // ── Estudiante ──────────────────────────────────────────────────────────
  enrolledCourseIds: string[];
  subscriptionTier?: SubscriptionTier;

  // ── Instructor ──────────────────────────────────────────────────────────
  ownedCourseIds?: string[];
}