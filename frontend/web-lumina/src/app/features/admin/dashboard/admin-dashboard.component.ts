// features/admin/dashboard/admin-dashboard.component.ts
// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: Dashboard del Administrador
//
// Responsabilidades:
//   - Vista general del estado de la plataforma
//   - KPIs: total cursos, usuarios activos, ingresos, instructores
//   - Accesos rápidos a las secciones de ABMC
//
// Patrón: Smart Component (contiene lógica de estado y navegación)
// ─────────────────────────────────────────────────────────────────────────────
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface StatCard {
  label:   string;
  value:   string;
  icon:    string;
  delta:   string;
  color:   string;
}

interface QuickAction {
  label:   string;
  desc:    string;
  route:   string;
  icon:    string;
  color:   string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="mb-8">
        <p class="text-sm text-sky-400 font-medium uppercase tracking-widest mb-1">
          Panel de administración
        </p>
        <h1 class="text-3xl font-bold text-slate-100">
          Bienvenido, {{ userName() }}
        </h1>
        <p class="text-slate-400 mt-1">
          Tienes acceso completo a todos los recursos de la plataforma.
        </p>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        @for (stat of stats; track stat.label) {
          <div class="card p-5">
            <div class="flex items-start justify-between mb-3">
              <span class="text-2xl">{{ stat.icon }}</span>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full
                           bg-green-500/10 text-green-400">
                {{ stat.delta }}
              </span>
            </div>
            <p class="text-2xl font-bold text-slate-100">{{ stat.value }}</p>
            <p class="text-sm text-slate-400 mt-0.5">{{ stat.label }}</p>
          </div>
        }
      </div>

      <!-- Acciones rápidas -->
      <h2 class="section-title">Gestión de la plataforma</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        @for (action of quickActions; track action.label) {
          <a [routerLink]="action.route"
             class="card p-6 flex items-start gap-4 group hover:border-sky-500/40
                    transition-all cursor-pointer">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                        text-2xl {{ action.color }}">
              {{ action.icon }}
            </div>
            <div>
              <h3 class="font-semibold text-slate-100 group-hover:text-sky-400
                         transition-colors">
                {{ action.label }}
              </h3>
              <p class="text-sm text-slate-400 mt-0.5 leading-relaxed">
                {{ action.desc }}
              </p>
            </div>
            <svg class="w-5 h-5 text-slate-600 group-hover:text-sky-400
                        group-hover:translate-x-1 transition-all ml-auto shrink-0 mt-0.5"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        }
      </div>

    </div>
  `,
})
export class AdminDashboardComponent {
  private readonly auth = inject(AuthService);

  readonly userName = () => this.auth.currentUser()?.name?.split(' ')[0] ?? 'Admin';

  readonly stats: StatCard[] = [
    { label: 'Cursos activos',   value: '142',    icon: '📚', delta: '+12 este mes', color: '' },
    { label: 'Usuarios totales', value: '8,421',  icon: '👥', delta: '+234 este mes', color: '' },
    { label: 'Instructores',     value: '38',     icon: '🎓', delta: '+3 este mes',   color: '' },
    { label: 'Ingresos (USD)',   value: '$24,800', icon: '💰', delta: '+18% vs mes anterior', color: '' },
  ];

  readonly quickActions: QuickAction[] = [
    {
      label:  'Gestionar Cursos',
      desc:   'Crear, editar y eliminar cursos de la plataforma.',
      route:  '/admin/courses',
      icon:   '📖',
      color:  'bg-sky-500/10',
    },
    {
      label:  'Gestionar Usuarios',
      desc:   'Ver, editar y gestionar roles de usuarios.',
      route:  '/admin/users',
      icon:   '👤',
      color:  'bg-violet-500/10',
    },
    {
      label:  'Reportes',
      desc:   'Visualizar métricas de cursos, ingresos y retención.',
      route:  '/admin/reports',
      icon:   '📊',
      color:  'bg-emerald-500/10',
    },
    {
      label:  'Nuevo Curso',
      desc:   'Crear un curso desde cero con todo el contenido.',
      route:  '/admin/courses/new',
      icon:   '➕',
      color:  'bg-amber-500/10',
    },
    {
      label:  'Instructores',
      desc:   'Aprobar y gestionar instructores de la plataforma.',
      route:  '/admin/users',
      icon:   '🏫',
      color:  'bg-rose-500/10',
    },
    {
      label:  'Catálogo Público',
      desc:   'Ver la plataforma como la ven los estudiantes.',
      route:  '/courses',
      icon:   '🌐',
      color:  'bg-cyan-500/10',
    },
  ];
}