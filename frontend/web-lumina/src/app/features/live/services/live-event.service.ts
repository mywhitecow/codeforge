// features/live/services/live-event.service.ts
import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LiveEvent } from '../models/live-event.model';
import { ToastService } from '../../../core/services/toast.service';

const REMINDER_KEY = 'codeforge_live_reminders';

/**
 * Servicio local del feature live.
 * Provee datos mock del evento y gestiona recordatorios via localStorage.
 */
@Injectable()
export class LiveEventService {
  private readonly toast = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);

  /** Obtiene el próximo evento en vivo (mock) */
  getNextEvent(): Observable<LiveEvent> {
    return of(MOCK_EVENT).pipe(delay(300));
  }

  /** Verifica si el usuario tiene un recordatorio activo para un evento */
  hasReminder(eventId: string): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const reminders = this.getReminders();
    return reminders.includes(eventId);
  }

  /** Togglea el recordatorio de un evento */
  toggleReminder(eventId: string): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    const reminders = this.getReminders();
    const index = reminders.indexOf(eventId);

    if (index > -1) {
      reminders.splice(index, 1);
      this.saveReminders(reminders);
      this.toast.show('Recordatorio eliminado', 'info');
      return false;
    } else {
      reminders.push(eventId);
      this.saveReminders(reminders);
      this.toast.success('¡Te recordaremos cuando el live esté por comenzar!');
      return true;
    }
  }

  private getReminders(): string[] {
    try {
      const stored = localStorage.getItem(REMINDER_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveReminders(reminders: string[]): void {
    localStorage.setItem(REMINDER_KEY, JSON.stringify(reminders));
  }
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// Evento programado ~2 días en el futuro para que el countdown sea visible
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 2);
futureDate.setHours(19, 0, 0, 0);

const MOCK_EVENT: LiveEvent = {
  id: 'live-001',
  title: 'Nueva versión: CodeForce AI v2.0',
  version: 'CodeForce AI v2.0',
  date: futureDate,
  description:
    'Acompáñanos en el lanzamiento de CodeForce AI v2.0, la nueva versión de nuestra plataforma de inteligencia artificial para educación. ' +
    'Descubre las nuevas funcionalidades: generación de código asistida, revisión automática de ejercicios, tutores virtuales con IA, ' +
    'y mucho más. Sesión interactiva de preguntas y respuestas al final del evento.',
  speaker: {
    name: 'Dr. Alejandro Ruiz',
    title: 'CTO & Co-fundador de CodeForce Academy',
    avatarUrl: 'https://ui-avatars.com/api/?name=AR&background=6366F1&color=fff&size=128',
  },
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  thumbnailUrl: 'https://ui-avatars.com/api/?name=LIVE&background=0B172C&color=38BDF8&size=640&font-size=0.2',
  tags: ['IA', 'Educación', 'Lanzamiento', 'CodeForce AI'],
  attendees: 1247,
};
