// core/directives/has-permission.directive.ts
// ─────────────────────────────────────────────────────────────────────────────
// DISEÑO: Structural Directive para RBAC en templates
//
// Por qué una directiva y no *ngIf con PermissionService:
//   ❌ *ngIf="permissionService.can('courses:delete')"
//      → Acopla el template a PermissionService, repite la importación,
//        difícil de refactorizar si cambia el nombre del permiso.
//   ✅ *hasPermission="'courses:delete'"
//      → Declarativo, semántico, encapsula la lógica.
//
// Uso:
//   <button *hasPermission="'courses:delete'">Eliminar</button>
//   <button *hasPermission="['courses:create', 'courses:update']">Editar</button>
//
// También soporta "else":
//   <div *hasPermission="'reports:view'; else noAccess">Dashboard</div>
//   <ng-template #noAccess><p>Sin acceso</p></ng-template>
// ─────────────────────────────────────────────────────────────────────────────
import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
} from '@angular/core';
import { PermissionService, Permission } from '../services/permission.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnInit {
  private readonly permissions  = inject(PermissionService);
  private readonly templateRef  = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);

  private requiredPermissions: Permission[] = [];
  private elseTemplateRef: TemplateRef<unknown> | null = null;
  private hasView = false;

  @Input()
  set hasPermission(value: Permission | Permission[]) {
    this.requiredPermissions = Array.isArray(value) ? value : [value];
    this.updateView();
  }

  @Input()
  set hasPermissionElse(templateRef: TemplateRef<unknown>) {
    this.elseTemplateRef = templateRef;
    this.updateView();
  }

  ngOnInit(): void {
    // Reaccionar a cambios de usuario (logout/login/cambio de rol)
    // Effect garantiza que la vista se actualice si el rol cambia en runtime
    effect(() => {
      // Leer el rol actual (reactivo)
      const _ = this.permissions.currentRole();
      this.updateView();
    });
  }

  private updateView(): void {
    const hasAccess = this.requiredPermissions.length === 0
      ? true
      : this.requiredPermissions.some(p => this.permissions.can(p));

    if (hasAccess && !this.hasView) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasAccess) {
      this.viewContainer.clear();
      if (this.elseTemplateRef) {
        this.viewContainer.createEmbeddedView(this.elseTemplateRef);
      }
      this.hasView = false;
    }
  }
}

// ── Variante para roles (no permisos atómicos) ───────────────────────────────
// Útil cuando quieres mostrar contenido según el rol directamente.
//
// Uso:
//   <nav *hasRole="'admin'">Panel de admin</nav>
//   <nav *hasRole="['admin', 'instructor']">Panel de gestión</nav>

@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit {
  private readonly permissions  = inject(PermissionService);
  private readonly templateRef  = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);

  private allowedRoles: string[] = [];
  private hasView = false;

  @Input()
  set hasRole(value: string | string[]) {
    this.allowedRoles = Array.isArray(value) ? value : [value];
    this.updateView();
  }

  ngOnInit(): void {
    effect(() => {
      const _ = this.permissions.currentRole();
      this.updateView();
    });
  }

  private updateView(): void {
    const role     = this.permissions.currentRole();
    const hasAccess = role !== null && this.allowedRoles.includes(role);

    if (hasAccess && !this.hasView) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasAccess) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}