// features/live/models/live-event.model.ts
// ─────────────────────────────────────────────────────────────────────────────
// Modelo del evento en vivo para la sección "En vivo".
// ─────────────────────────────────────────────────────────────────────────────

/** Datos del orador/speaker del evento */
export interface LiveSpeaker {
  name: string;
  title: string;
  avatarUrl: string;
}

/** Estructura de tiempo restante para el countdown */
export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

/** Modelo completo de un evento en vivo */
export interface LiveEvent {
  id: string;
  title: string;
  version: string;
  date: Date;
  description: string;
  speaker: LiveSpeaker;
  videoUrl: string;
  thumbnailUrl: string;
  tags: string[];
  attendees: number;
}
