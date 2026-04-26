import { Component } from '@angular/core';
import { NgFor, NgIf, NgClass, CommonModule } from '@angular/common';

interface Plan {
  title: string;
  price: number | null;
  originalPrice?: number;
  discount?: string;
  benefits: string[];
  isPopular?: boolean;
  buttonType: 'outlined' | 'solid';
  buttonText: string;
}

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [CommonModule,NgFor, NgIf, NgClass],
  templateUrl: './premium.component.html',
  styleUrl: './premium.component.scss'
})
export class PremiumComponent {
  selectedPeriod: 'mensual' | 'semestral' | 'anual' = 'mensual';
  
  plans: Plan[] = [
    {
      title: 'Plan Gratuito',
      price: 0,
      benefits: [
        'Acceso a contenido básico',
        'Soporte por email',
        'Actualizaciones mensuales'
      ],
      buttonType: 'outlined',
      buttonText: 'Empezar gratis'
    },
    {
      title: 'Pro',
      price: 100.5,
      originalPrice: 150,
      discount: '¡Ahorras 33%!',
      benefits: [
        'Todo lo del plan gratuito',
        'Acceso a contenido avanzado',
        'Soporte prioritario 24/7',
        'Actualizaciones semanales',
        'Recursos descargables'
      ],
      isPopular: true,
      buttonType: 'solid',
      buttonText: '¡Hazte pro!'
    },
    {
      title: 'Premium',
      price: 200,
      benefits: [
        'Todo lo del plan Pro',
        'Sesiones de mentoring 1-a-1',
        'Acceso anticipado a nuevas funciones',
        'Certificado de completación',
        'Comunidad exclusiva',
        'Garantía de satisfacción'
      ],
      buttonType: 'solid',
      buttonText: '¡Hazte premium!'
    }
  ];

  getPremiumPrice(): number {
    const basePrice = 200;
    switch (this.selectedPeriod) {
      case 'mensual':
        return basePrice;
      case 'semestral':
        return Math.round(basePrice * 6 * 0.9); // 10% descuento
      case 'anual':
        return Math.round(basePrice * 12 * 0.8); // 20% descuento
      default:
        return basePrice;
    }
  }

  getPremiumPriceLabel(): string {
    const price = this.getPremiumPrice();
    const period = this.selectedPeriod === 'mensual' ? '/mes' : 
                   this.selectedPeriod === 'semestral' ? '/6 meses' : '/año';
    return `${price} BS${period}`;
  }

  selectPeriod(period: 'mensual' | 'semestral' | 'anual'): void {
    this.selectedPeriod = period;
  }
}