// ─────────────────────────────────────────────────────────────
// toast/toast.component.ts
// ─────────────────────────────────────────────────────────────
import {
  Component, inject, ChangeDetectionStrategy,
} from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
 
@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Accessible live region — screen readers will announce new toasts -->
    <div
      role="region"
      aria-live="polite"
      aria-label="Notificaciones"
      class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2
             pointer-events-none w-80 max-w-[calc(100vw-2rem)]"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg
                 pointer-events-auto text-sm font-medium
                 animate-fade-in-down"
          [class]="colorClass(toast.type)"
          role="alert"
        >
          <!-- Icon -->
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" class="shrink-0 mt-0.5"
               aria-hidden="true">
            @switch (toast.type) {
              @case ('success') {
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M5 13l4 4L19 7"/>
              }
              @case ('error') {
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
              }
              @case ('warning') {
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0
                         001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2
                         2 0 00-3.42 0z"/>
              }
              @default {
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              }
            }
          </svg>
 
          <!-- Message -->
          <span class="flex-1 leading-snug">{{ toast.message }}</span>
 
          <!-- Dismiss button -->
          <button
            (click)="toastService.dismiss(toast.id)"
            class="opacity-60 hover:opacity-100 transition-opacity shrink-0"
            aria-label="Cerrar notificación"
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
 
  colorClass(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-green-900/90 text-green-100 border border-green-700/50',
      error:   'bg-red-900/90 text-red-100 border border-red-700/50',
      warning: 'bg-amber-900/90 text-amber-100 border border-amber-700/50',
      info:    'bg-slate-800/95 text-slate-100 border border-slate-600/50',
    };
    return map[type] ?? map['info'];
  }
}
 