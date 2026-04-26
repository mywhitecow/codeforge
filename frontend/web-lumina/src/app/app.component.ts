// app.component.ts
import { Component, AfterViewInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { TopBannerComponent } from './shared/components/top-banner/top-banner.component';
import { LoadingBarComponent } from './shared/components/loading-bar/loading-bar.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    TopBannerComponent,
    LoadingBarComponent,
    ToastComponent
  ],
  template: `
    <app-loading-bar />
    <app-top-banner />
    <div class="app-wrapper">
      <app-header />
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
    <app-toast />
  `
})
export class AppComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);

  readonly title = 'CodeForge Academy';

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const loading = document.querySelector('.loading') as HTMLElement | null;
      if (loading) loading.style.display = 'none';
    }
  }
}