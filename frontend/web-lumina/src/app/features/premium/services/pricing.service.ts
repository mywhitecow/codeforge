// features/premium/services/pricing.service.ts
import { Injectable, signal, computed } from '@angular/core';
import {
  Currency, CurrencyCode, PricingPlan, FaqItem, Testimonial, BillingPeriod,
} from '../models/premium.model';

@Injectable()
export class PricingService {
  // ── Currency state ──────────────────────────────────────────────────────
  private readonly _currency = signal<CurrencyCode>('USD');
  readonly currency = this._currency.asReadonly();

  readonly currencies: Currency[] = [
    { code: 'USD', name: 'Dólar', symbol: '$', rate: 1 },
    { code: 'Bs', name: 'Boliviano', symbol: 'Bs', rate: 6.96 },
    { code: 'COP', name: 'Peso colombiano', symbol: '$', rate: 4150 },
    { code: 'MXN', name: 'Peso mexicano', symbol: '$', rate: 17.2 },
    { code: 'ARS', name: 'Peso argentino', symbol: '$', rate: 870 },
    { code: 'CLP', name: 'Peso chileno', symbol: '$', rate: 940 },
    { code: 'PEN', name: 'Sol peruano', symbol: 'S/', rate: 3.72 },
  ];

  readonly currentCurrency = computed(() =>
    this.currencies.find(c => c.code === this._currency()) ?? this.currencies[0]
  );

  setCurrency(code: CurrencyCode): void {
    this._currency.set(code);
  }

  /** Convierte un precio de USD a la moneda seleccionada */
  convert(usdAmount: number): number {
    return Math.round(usdAmount * this.currentCurrency().rate * 100) / 100;
  }

  /** Formatea precio con símbolo */
  formatPrice(usdAmount: number): string {
    const c = this.currentCurrency();
    const converted = this.convert(usdAmount);
    if (c.code === 'COP' || c.code === 'ARS' || c.code === 'CLP') {
      return `${c.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${c.symbol}${converted.toFixed(2)}`;
  }

  // ── Billing period ──────────────────────────────────────────────────────
  private readonly _billingPeriod = signal<BillingPeriod>('annual');
  readonly billingPeriod = this._billingPeriod.asReadonly();

  setBillingPeriod(period: BillingPeriod): void {
    this._billingPeriod.set(period);
  }

  // ── Plans ───────────────────────────────────────────────────────────────
  readonly plans = computed<PricingPlan[]>(() => {
    const period = this._billingPeriod();
    return [
      {
        id: 'free',
        title: 'Gratuito',
        subtitle: 'Para empezar a aprender',
        priceUsd: 0,
        fullPriceUsd: 0,
        billingPeriod: 'free' as const,
        benefits: [
          '9 cursos 100% gratis con certificado',
          'Acceso a primeras clases de cursos premium',
          'Preguntas en la comunidad',
          'Acceso limitado a CodeForce AI',
        ],
        isPopular: false,
        isStudentPlan: false,
        isEnterprise: false,
        ctaLabel: 'Comienza gratis',
        ctaAction: 'free' as const,
      },
      this.getPremiumPlan(period),
      {
        id: 'student',
        title: 'Premium Estudiantil',
        subtitle: '50% de descuento con verificación',
        priceUsd: this.getAnnualMonthlyPrice() * 0.5,
        fullPriceUsd: this.getAnnualMonthlyPrice() * 0.5 * 12,
        originalPriceUsd: this.getAnnualMonthlyPrice() * 12,
        discount: '50% OFF',
        billingPeriod: 'annual',
        benefits: [
          'Todos los beneficios del plan Premium',
          '50% de descuento con verificación estudiantil',
          'Acceso completo a CodeForce AI',
          'Certificados de todos los cursos',
          'Válido por 12 meses (renovable)',
        ],
        isPopular: false,
        isStudentPlan: true,
        isEnterprise: false,
        ctaLabel: 'Postula ahora',
        ctaAction: 'apply' as const,
      },
      {
        id: 'enterprise',
        title: 'Empresas',
        subtitle: 'Para equipos y organizaciones',
        priceUsd: 0,
        fullPriceUsd: 0,
        billingPeriod: 'custom' as const,
        benefits: [
          'Capacitación en IA para equipos de TI',
          'Capacitación para administrativos',
          'Desarrollo de software con IA por CodeForce Labs',
          'Licencias empresariales ilimitadas',
          'Dashboard de progreso del equipo',
          'Soporte dedicado 24/7',
        ],
        isPopular: false,
        isStudentPlan: false,
        isEnterprise: true,
        ctaLabel: 'Contacta a ventas',
        ctaAction: 'contact' as const,
      },
    ];
  });

  private getAnnualMonthlyPrice(): number { return 14.99; }

  private getPremiumPlan(period: BillingPeriod): PricingPlan {
    switch (period) {
      case 'monthly':
        return {
          id: 'premium-monthly', title: 'Premium', subtitle: 'Facturación mensual',
          priceUsd: 24.99, fullPriceUsd: 24.99, billingPeriod: 'monthly',
          benefits: this.premiumBenefits(), isPopular: false,
          isStudentPlan: false, isEnterprise: false,
          ctaLabel: 'Suscribirse', ctaAction: 'subscribe',
        };
      case 'semiannual':
        return {
          id: 'premium-semi', title: 'Premium', subtitle: 'Facturación semestral',
          priceUsd: 19.99, fullPriceUsd: 19.99 * 6, billingPeriod: 'semiannual',
          originalPriceUsd: 24.99 * 6, discount: '¡Ahorras 20%!',
          benefits: this.premiumBenefits(), isPopular: false,
          isStudentPlan: false, isEnterprise: false,
          ctaLabel: 'Suscribirse', ctaAction: 'subscribe',
        };
      case 'annual':
      default:
        return {
          id: 'premium-annual', title: 'Premium', subtitle: 'Facturación anual',
          priceUsd: 14.99, fullPriceUsd: 14.99 * 12, billingPeriod: 'annual',
          originalPriceUsd: 24.99 * 12, discount: '¡Ahorras 40%!',
          benefits: this.premiumBenefits(), isPopular: true,
          isStudentPlan: false, isEnterprise: false,
          ctaLabel: 'Suscribirse', ctaAction: 'subscribe',
        };
    }
  }

  private premiumBenefits(): string[] {
    return [
      'Cursos nuevos cada semana',
      'Acceso a todos los cursos, rutas y escuelas',
      'Notas ilimitadas',
      'Certificados de todos los cursos y rutas',
      'Acceso completo a CodeForce AI',
      'Soporte prioritario',
    ];
  }

  // ── FAQ ─────────────────────────────────────────────────────────────────
  readonly faqs: FaqItem[] = [
    { question: '¿Son válidos los certificados?', answer: 'Los certificados validan la culminación exitosa de los cursos. Aunque no tienen validez oficial gubernamental, son reconocidos por empresas del sector tecnológico y pueden agregarse a tu perfil de LinkedIn para demostrar tus habilidades.' },
    { question: '¿Puedo comprar solo los cursos que quiero?', answer: 'Sí, puedes comprar cursos individuales de por vida sin necesidad de suscripción. Sin embargo, con el plan Premium accedes a todos los cursos por un precio mucho menor.' },
    { question: '¿Cómo saber si tengo renovación automática?', answer: 'Si pagaste con tarjeta de crédito/débito o PayPal, la renovación es automática. Puedes desactivarla desde tu perfil en "Configuración > Suscripción". Si pagaste por transferencia, no hay renovación automática.' },
    { question: '¿Puedo recibir asesorías de los profesores?', answer: 'No ofrecemos asesorías personalizadas 1 a 1, pero puedes hacer preguntas en la comunidad de cada curso y los instructores responden regularmente. Los estudiantes Premium tienen prioridad en respuestas.' },
    { question: '¿Los cursos tienen horario?', answer: 'No. Todos los cursos son 100% online y asíncronos. Puedes estudiar a tu propio ritmo, cuando y donde quieras.' },
    { question: '¿Cómo ver precios en mi moneda local?', answer: 'Usa el selector de moneda en la parte superior de esta página para ver los precios en tu moneda local. Aceptamos pagos en USD y las conversiones son referenciales.' },
    { question: '¿Qué medios de pago aceptan?', answer: 'Aceptamos PayPal, tarjetas de crédito y débito (Visa, Mastercard, American Express), y depósitos/transferencias bancarias en países seleccionados.' },
    { question: '¿Si termina mi suscripción puedo seguir accediendo?', answer: 'Al finalizar tu suscripción perderás acceso a los cursos premium. Los cursos gratuitos y los cursos que hayas comprado individualmente seguirán disponibles. Tus certificados obtenidos son permanentes.' },
  ];

  // ── Testimonials ────────────────────────────────────────────────────────
  readonly testimonials: Testimonial[] = [
    { id: 't1', name: 'María García', role: 'Frontend Developer en Globant', avatarUrl: 'https://ui-avatars.com/api/?name=MG&background=6366F1&color=fff', rating: 5, comment: 'CodeForge Academy transformó mi carrera. Pasé de no saber programar a conseguir mi primer empleo como desarrolladora en 8 meses. Los cursos son claros, prácticos y actualizados.' },
    { id: 't2', name: 'Carlos Mendoza', role: 'Data Engineer en Mercado Libre', avatarUrl: 'https://ui-avatars.com/api/?name=CM&background=10B981&color=fff', rating: 5, comment: 'La calidad de los cursos de datos e IA es impresionante. El plan Premium se paga solo con el primer aumento de sueldo que conseguí gracias a lo que aprendí aquí.' },
    { id: 't3', name: 'Valentina Torres', role: 'UX Designer Freelance', avatarUrl: 'https://ui-avatars.com/api/?name=VT&background=F59E0B&color=fff', rating: 5, comment: 'Nunca pensé que podría aprender diseño UX online de forma tan efectiva. Los proyectos prácticos y el feedback de la comunidad hacen la diferencia. 100% recomendado.' },
    { id: 't4', name: 'Andrés López', role: 'Backend Developer en Rappi', avatarUrl: 'https://ui-avatars.com/api/?name=AL&background=EF4444&color=fff', rating: 5, comment: 'Llevé la ruta de Backend con Node.js y me ayudó a pasar las entrevistas técnicas. Los certificados de CodeForge son muy bien vistos por los reclutadores en LATAM.' },
  ];
}
