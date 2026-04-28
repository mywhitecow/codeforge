// features/live/live.component.ts
import {
  Component, ChangeDetectionStrategy, inject, signal, OnInit, OnDestroy, PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder, Validators, ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, interval, takeUntil } from 'rxjs';

import { LiveEvent, CountdownTime } from './models/live-event.model';
import { LiveEventService } from './services/live-event.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-live',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe, SafeUrlPipe],
  providers: [LiveEventService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss'],
})
export class LiveComponent implements OnInit, OnDestroy {
  private readonly liveEventService = inject(LiveEventService);
  readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroy$ = new Subject<void>();

  // State
  readonly event = signal<LiveEvent | null>(null);
  readonly countdown = signal<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });
  readonly isLoading = signal(true);
  readonly hasReminder = signal(false);
  readonly loginLoading = signal(false);
  readonly loginError = signal('');

  // Login form
  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    this.liveEventService.getNextEvent().pipe(
      takeUntil(this.destroy$)
    ).subscribe(event => {
      this.event.set(event);
      this.hasReminder.set(this.liveEventService.hasReminder(event.id));
      this.updateCountdown(event.date);
      this.startCountdown(event.date);
      this.isLoading.set(false);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Inicia el intervalo del countdown (cada segundo) */
  private startCountdown(targetDate: Date): void {
    if (!isPlatformBrowser(this.platformId)) return;

    interval(1000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateCountdown(targetDate);
    });
  }

  /** Calcula el tiempo restante */
  private updateCountdown(targetDate: Date): void {
    const now = Date.now();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
      this.countdown.set({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    this.countdown.set({ days, hours, minutes, seconds, isExpired: false });
  }

  /** Togglea recordatorio */
  toggleReminder(): void {
    const ev = this.event();
    if (!ev) return;

    if (!this.auth.isAuthenticated()) {
      this.toast.warning('Inicia sesión para activar recordatorios');
      return;
    }

    const active = this.liveEventService.toggleReminder(ev.id);
    this.hasReminder.set(active);
  }

  /** Login con email/password */
  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginLoading.set(true);
    this.loginError.set('');

    const { email, password } = this.loginForm.getRawValue();

    this.auth.login(email!, password!).subscribe({
      next: (res: { token?: string; accessToken?: string }) => {
        const token = res.token ?? res.accessToken ?? '';
        if (token) {
          this.auth.acceptExternalToken(token);
        }
        this.loginLoading.set(false);
        this.toast.success('¡Bienvenido! Ya puedes ver el live.');
      },
      error: (err: { status?: number }) => {
        this.loginLoading.set(false);
        this.loginError.set(
          err.status === 401
            ? 'Correo o contraseña incorrectos.'
            : 'Error al conectar con el servidor.'
        );
      },
    });
  }

  /** Login social */
  loginWithSocial(provider: 'google' | 'github'): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = `${environment.apiUrl}/auth/${provider}/redirect`;
    }
  }

  /** Formato 2 dígitos */
  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  /** Fecha formateada para mostrar */
  formatEventDate(date: Date): string {
    return new Intl.DateTimeFormat('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  }
}