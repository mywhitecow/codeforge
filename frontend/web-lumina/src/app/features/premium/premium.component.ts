
import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';

interface Plan {
  title: string;
  price: number | null;
  originalPrice?: number;
  discount?: string;
  benefits: string[];
  isPopular?: boolean;
}

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],

  templateUrl:  './premium.component.html',
  styleUrl: './premium.component.scss'
})
export class PremiumComponent {
  plans: Plan[] = [
    {
      title: 'Plan Gratuito',
      price: 0,
      benefits: [
        'Acceso a contenido básico',
        'Soporte por email',
        'Actualizaciones mensuales'
      ]
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
      isPopular: true
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
      ]
    }
  ];
}