// ─────────────────────────────────────────────────────────────
// loading-bar/loading-bar.component.ts
// ─────────────────────────────────────────────────────────────
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
 
@Component({
  selector: 'app-loading-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loadingService.isLoading()) {
      <div
        role="progressbar"
        aria-label="Cargando"
        aria-valuemin="0"
        aria-valuemax="100"
        class="fixed top-0 left-0 right-0 z-[10000] h-0.5"
      >
        <div class="h-full bg-sky-400 loading-bar-animation"></div>
      </div>
    }
  `,
  styles: [`
    @keyframes loading-bar {
      0%   { width: 0%;   margin-left: 0;   }
      50%  { width: 70%;  margin-left: 0;   }
      100% { width: 10%;  margin-left: 100%; }
    }
    .loading-bar-animation {
      animation: loading-bar 1.4s ease-in-out infinite;
    }
  `],
})
export class LoadingBarComponent {
  readonly loadingService = inject(LoadingService);
}