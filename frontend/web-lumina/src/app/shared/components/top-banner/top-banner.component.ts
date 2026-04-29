import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  inject,
  PLATFORM_ID,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-top-banner',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (isVisible()) {
      <!-- FIX: bg-linear-to-r es Tailwind v4. Este proyecto usa v3 → bg-gradient-to-r -->
      <div class="relative bg-gradient-to-r from-sky-500 to-cyan-400
                  text-white py-2.5 px-4 animate-banner">
        <div class="max-w-[1400px] mx-auto flex flex-wrap items-center
                    justify-center gap-2 md:gap-4 pr-8 md:pr-0">

          <!-- Texto oferta -->
          <span class="font-semibold text-sm md:text-base">
            🎉 Oferta por tiempo limitado —
          </span>
          <span class="text-sm md:text-base opacity-90">
            50% de descuento en todos los cursos
          </span>

          <!-- Contador regresivo — solo se muestra en browser -->
          @if (isBrowser) {
            <div class="flex items-center gap-1 font-mono text-xs md:text-sm
                        bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full
                        border border-white/30 tracking-wider">
              <span>{{ pad(timeLeft().days) }}<small class="opacity-70 font-sans text-[10px]">d</small></span>
              <span class="opacity-50">:</span>
              <span>{{ pad(timeLeft().hours) }}<small class="opacity-70 font-sans text-[10px]">h</small></span>
              <span class="opacity-50">:</span>
              <span>{{ pad(timeLeft().minutes) }}<small class="opacity-70 font-sans text-[10px]">m</small></span>
              <span class="opacity-50">:</span>
              <span>{{ pad(timeLeft().seconds) }}<small class="opacity-70 font-sans text-[10px]">s</small></span>
            </div>
          }

          <!-- CTA -->
          <a routerLink="/premium"
             class="hidden md:inline-flex items-center gap-1 text-sm font-semibold
                    underline underline-offset-2 hover:no-underline hover:opacity-80
                    transition-opacity">
            Ver oferta →
          </a>
        </div>

        <!-- Botón cerrar -->
        <button
          (click)="closeBanner()"
          class="absolute right-3 top-1/2 -translate-y-1/2
                 text-white/80 hover:text-white transition-colors
                 p-1 rounded-md hover:bg-white/15"
          aria-label="Cerrar banner"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12"
                  stroke-width="2.5" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    }
  `,
})
export class TopBannerComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  isVisible = signal(true);
  timeLeft = signal<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  private targetDate!: Date;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.targetDate = new Date();
    this.targetDate.setDate(this.targetDate.getDate() + 7);
    this.updateTimer();
    
    // Run timer outside of Angular's zone to not block application stability during SSR
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        this.ngZone.run(() => this.updateTimer());
      }, 1000);
    });
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  private updateTimer(): void {
    const distance = this.targetDate.getTime() - Date.now();

    if (distance <= 0) {
      this.isVisible.set(false);
      this.clearTimer();
      return;
    }

    this.timeLeft.set({
      days:    Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    });
  }

  closeBanner(): void {
    this.isVisible.set(false);
    this.clearTimer();
  }

  private clearTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}