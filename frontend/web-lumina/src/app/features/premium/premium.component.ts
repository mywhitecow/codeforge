// features/premium/premium.component.ts
import {
  Component, ChangeDetectionStrategy, inject, signal, PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PricingService } from './services/pricing.service';
import { PricingPlan, FaqItem, CurrencyCode, BillingPeriod } from './models/premium.model';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [PricingService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss'],
})
export class PremiumComponent {
  readonly pricing = inject(PricingService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);

  // UI state
  readonly showCurrencyDropdown = signal(false);
  readonly expandedFaq = signal<number>(-1);
  readonly showCheckoutModal = signal(false);
  readonly selectedPlanForCheckout = signal<PricingPlan | null>(null);
  readonly showContactModal = signal(false);
  readonly showStudentModal = signal(false);

  // ── Currency ───────────────────────────────────────────────────────
  toggleCurrencyDropdown(): void {
    this.showCurrencyDropdown.update(v => !v);
  }

  selectCurrency(code: CurrencyCode): void {
    this.pricing.setCurrency(code);
    this.showCurrencyDropdown.set(false);
  }

  // ── Billing period ─────────────────────────────────────────────────
  selectBillingPeriod(period: BillingPeriod): void {
    this.pricing.setBillingPeriod(period);
  }

  // ── FAQ ─────────────────────────────────────────────────────────────
  toggleFaq(index: number): void {
    this.expandedFaq.update(current => current === index ? -1 : index);
  }

  // ── Plan actions ───────────────────────────────────────────────────
  onPlanAction(plan: PricingPlan): void {
    switch (plan.ctaAction) {
      case 'free':
        if (isPlatformBrowser(this.platformId)) {
          window.location.href = '/courses';
        }
        break;
      case 'subscribe':
        if (!this.auth.isAuthenticated()) {
          this.toast.warning('Inicia sesión para suscribirte');
          if (isPlatformBrowser(this.platformId)) {
            window.location.href = '/auth/login?returnUrl=/premium';
          }
          return;
        }
        this.selectedPlanForCheckout.set(plan);
        this.showCheckoutModal.set(true);
        break;
      case 'apply':
        this.showStudentModal.set(true);
        break;
      case 'contact':
        this.showContactModal.set(true);
        break;
    }
  }

  // ── Checkout mock ──────────────────────────────────────────────────
  processCheckout(): void {
    this.showCheckoutModal.set(false);
    this.toast.success('¡Pago procesado exitosamente! Bienvenido a Premium 🎉');
    this.selectedPlanForCheckout.set(null);
  }

  closeCheckoutModal(): void {
    this.showCheckoutModal.set(false);
    this.selectedPlanForCheckout.set(null);
  }

  // ── Contact modal ──────────────────────────────────────────────────
  submitContact(): void {
    this.showContactModal.set(false);
    this.toast.success('¡Mensaje enviado! Nuestro equipo te contactará pronto.');
  }

  // ── Student modal ──────────────────────────────────────────────────
  submitStudentApplication(): void {
    this.showStudentModal.set(false);
    this.toast.success('¡Postulación recibida! Verificaremos tu documentación en 24-48 horas.');
  }

  /** Genera array de estrellas para rating */
  stars(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i);
  }
}