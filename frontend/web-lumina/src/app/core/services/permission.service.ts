// core/services/permission.service.ts
// ─────────────────────────────────────────────────────────────────────────────
// DISEÑO:
//   - Fuente de verdad centralizada para RBAC
//   - Usa `computed()` de Angular Signals → reactividad automática
//   - No depende de AuthService directamente para evitar circular deps:
//     recibe el user signal como parámetro cuando sea necesario
//   - Expone helpers semánticos (`canManageCourses`, `canViewReports`, etc.)
//     en lugar de comparaciones crudas de string en los componentes
// ─────────────────────────────────────────────────────────────────────────────
import { Injectable, inject, computed } from '@angular/core';
import { AuthService } from './auth.service';
import { UserRole, SubscriptionTier } from '../models/user.model';

// ── Mapa de permisos por rol ──────────────────────────────────────────────────
// Diseño inspirado en el patrón "Permission Matrix" usado en sistemas enterprise.
// Ventaja: agregar un nuevo rol solo requiere extender este mapa.
const ROLE_PERMISSIONS: Record<UserRole, Set<Permission>> = {
  admin: new Set<Permission>([
    'courses:create',
    'courses:read',
    'courses:update',
    'courses:delete',
    'users:create',
    'users:read',
    'users:update',
    'users:delete',
    'reports:view',
    'instructor:manage',
  ]),
  instructor: new Set<Permission>([
    'courses:create',       // Solo sus propios cursos (validación en backend)
    'courses:read',
    'courses:update',       // Solo sus propios cursos
    'students:view',        // Ver estudiantes inscritos en sus cursos
  ]),
  student: new Set<Permission>([
    'courses:read',         // Ver catálogo según suscripción
    'courses:enroll',       // Inscribirse
    'content:access',       // Acceder al contenido
  ]),
};

/** Todas las acciones posibles del sistema */
export type Permission =
  | 'courses:create'
  | 'courses:read'
  | 'courses:update'
  | 'courses:delete'
  | 'courses:enroll'
  | 'users:create'
  | 'users:read'
  | 'users:update'
  | 'users:delete'
  | 'reports:view'
  | 'instructor:manage'
  | 'students:view'
  | 'content:access';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly auth = inject(AuthService);

  // ── Señales derivadas del usuario autenticado ──────────────────────────────

  readonly currentRole = computed(() => this.auth.currentUser()?.role ?? null);

  readonly isAdmin      = computed(() => this.currentRole() === 'admin');
  readonly isInstructor = computed(() => this.currentRole() === 'instructor');
  readonly isStudent    = computed(() => this.currentRole() === 'student');

  readonly subscriptionTier = computed(
    () => this.auth.currentUser()?.subscriptionTier ?? 'free'
  );

  // ── API pública: verificar permiso atómico ─────────────────────────────────

  /**
   * Verifica si el usuario actual tiene un permiso específico.
   * Uso en templates: *hasPermission="'courses:create'"
   * Uso en guards:    permissionService.can('reports:view')
   */
  can(permission: Permission): boolean {
    const role = this.currentRole();
    if (!role) return false;
    return ROLE_PERMISSIONS[role].has(permission);
  }

  /**
   * Verifica si el usuario tiene AL MENOS uno de los permisos dados.
   * Útil para secciones con acceso multi-rol.
   */
  canAny(...permissions: Permission[]): boolean {
    return permissions.some(p => this.can(p));
  }

  /**
   * Verifica si el usuario tiene TODOS los permisos dados.
   */
  canAll(...permissions: Permission[]): boolean {
    return permissions.every(p => this.can(p));
  }

  // ── Helpers semánticos de alto nivel ──────────────────────────────────────
  // Reducen el acoplamiento entre componentes y el sistema de permisos.
  // Los componentes llaman `canManageCourses()` en vez de
  // `permissionService.can('courses:create') && permissionService.can('courses:delete')`

  /** Admin o Instructor pueden crear/editar cursos (con restricciones de ownership en backend) */
  readonly canManageCourses = computed(() =>
    this.can('courses:create') && this.can('courses:update')
  );

  /** Solo Admin puede eliminar cursos o gestionar usuarios */
  readonly canAdministerPlatform = computed(() => this.isAdmin());

  /** Admin puede ver reportes */
  readonly canViewReports = computed(() => this.can('reports:view'));

  /** Instructor puede ver sus estudiantes */
  readonly canViewStudents = computed(() => this.can('students:view'));

  /**
   * Verifica si un Estudiante puede acceder a un curso según su suscripción.
   * `requiredTier` lo define el curso en el backend.
   */
  canAccessCourseContent(requiredTier: SubscriptionTier): boolean {
    if (!this.isStudent()) return true; // Admins/Instructors tienen acceso total
    const tiers: SubscriptionTier[] = ['free', 'basic', 'premium'];
    const userTierIndex     = tiers.indexOf(this.subscriptionTier());
    const requiredTierIndex = tiers.indexOf(requiredTier);
    return userTierIndex >= requiredTierIndex;
  }

  // ── Ownership check ────────────────────────────────────────────────────────

  /**
   * Verifica si el Instructor actual es dueño de un curso específico.
   * Los Admins pueden editar CUALQUIER curso.
   */
  ownsCourse(courseId: string): boolean {
    if (this.isAdmin()) return true;
    const ownedIds = this.auth.currentUser()?.ownedCourseIds ?? [];
    return ownedIds.includes(courseId);
  }
}