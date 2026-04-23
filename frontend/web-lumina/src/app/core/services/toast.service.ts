// ─────────────────────────────────────────────────────────────
// 2. core/services/toast.service.ts

import { Injectable, signal } from "@angular/core";

// ─────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'warning' | 'info';
 
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  durationMs: number;
}
 
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();
 
  show(message: string, type: ToastType = 'info', durationMs = 4000): void {
    const id = crypto.randomUUID();
    this._toasts.update(list => [...list, { id, type, message, durationMs }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }
 
  dismiss(id: string): void {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }
 
  success(message: string) { this.show(message, 'success'); }
  error(message: string)   { this.show(message, 'error', 6000); }
  warning(message: string) { this.show(message, 'warning'); }
}
 