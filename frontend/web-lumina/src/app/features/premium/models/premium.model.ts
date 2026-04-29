// features/premium/models/premium.model.ts

/** Monedas soportadas */
export type CurrencyCode = 'USD' | 'Bs' | 'COP' | 'MXN' | 'ARS' | 'CLP' | 'PEN';

export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rate: number; // tasa respecto a USD
}

/** Periodicidad de facturación */
export type BillingPeriod = 'monthly' | 'semiannual' | 'annual';

/** Plan de suscripción */
export interface PricingPlan {
  id: string;
  title: string;
  subtitle: string;
  priceUsd: number; // precio mensual equivalente en USD
  fullPriceUsd: number; // precio total del periodo en USD
  originalPriceUsd?: number; // precio sin descuento (para tachar)
  discount?: string; // ej. "¡Ahorras 33%!"
  billingPeriod: BillingPeriod | 'free' | 'custom';
  benefits: string[];
  isPopular: boolean;
  isStudentPlan: boolean;
  isEnterprise: boolean;
  ctaLabel: string;
  ctaAction: 'free' | 'subscribe' | 'apply' | 'contact';
}

/** Pregunta frecuente */
export interface FaqItem {
  question: string;
  answer: string;
}

/** Testimonio */
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  rating: number;
  comment: string;
  fullStoryUrl?: string;
}
