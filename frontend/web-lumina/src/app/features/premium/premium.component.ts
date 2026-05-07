
import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripeService } from '../../shared/services/stripe.service';
import { AuthService } from '../../core/services/auth.service';

interface Plan {
  id: string;
  title: string;
  badge?: string;
  billingCycle: string;
  price: number;
  installments?: string;
  benefits: { included: boolean; text: string }[];
  isPopular?: boolean;
}

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule],
  templateUrl:  './premium.component.html',
  styleUrl: './premium.component.scss'
})
export class PremiumComponent {
  // Estado para un posible toggle entra personas y empresas, por ahora estático
  activeTab: 'persons' | 'companies' = 'persons';
  
  isLoadingMap: { [key: string]: boolean } = {};
  secondEmail: string = '';
  errorMessage: string | null = null;

  constructor(private stripeService: StripeService, public authService: AuthService) {}

  plans: Plan[] = [
    {
      id: 'basic',
      title: 'Plan Basic',
      billingCycle: 'Mensual',
      price: 39, // USD
      benefits: [
        { included: true, text: 'Contenido profesional y actualizado con certificados digitales' },
        { included: false, text: 'Certificados físicos para las rutas de aprendizaje profesional' },
        { included: false, text: 'Acceso a las escuelas de Startups, Inglés y Liderazgo' },
        { included: false, text: 'Eventos exclusivos' }
      ]
    },
    {
      id: 'expert',
      title: 'Plan Expert',
      badge: 'AHORRAS 7 MESES',
      billingCycle: 'Anual',
      price: 249, // USD
      installments: 'Paga a 4 cuotas sin intereses de $62.25',
      benefits: [
        { included: true, text: 'Contenido profesional y actualizado con certificados digitales' },
        { included: true, text: 'Certificados físicos para las rutas de aprendizaje profesional' },
        { included: true, text: 'Acceso a las escuelas de Startups, Inglés y Liderazgo' },
        { included: true, text: 'Eventos exclusivos' }
      ],
      isPopular: true
    },
    {
      id: 'expert_duo',
      title: 'Plan Expert Duo',
      badge: 'AHORRAS 9 MESES',
      billingCycle: 'Anual',
      price: 349, // USD
      installments: 'Paga a 4 cuotas sin intereses de $87.25',
      benefits: [
        { included: true, text: 'Para 2 estudiantes simultáneos' },
        { included: true, text: 'Contenido profesional y actualizado con certificados digitales' },
        { included: true, text: 'Certificados físicos para las rutas de aprendizaje profesional' },
        { included: true, text: 'Acceso a las escuelas de Startups, Inglés y Liderazgo' },
        { included: true, text: 'Eventos exclusivos' }
      ]
    }
  ];

  isPlanActive(planId: string): boolean {
    const user = this.authService.currentUser();
    if (!user || user.plan_id !== planId) return false;
    if (!user.plan_expires_at) return false;
    
    return new Date(user.plan_expires_at) > new Date();
  }

  subscribe(planId: string) {
    this.errorMessage = null;
    
    if (planId === 'expert_duo') {
      if (!this.secondEmail || this.secondEmail.trim() === '') {
        this.errorMessage = 'Debes ingresar el correo de tu compañero.';
        return;
      }
      
      const currentUser = this.authService.currentUser();
      if (currentUser && currentUser.email === this.secondEmail.trim()) {
        this.errorMessage = 'No puedes usar tu propio correo como compañero.';
        return;
      }
      
      this.isLoadingMap[planId] = true;
      this.stripeService.verifyEmail(this.secondEmail.trim()).subscribe({
        next: () => {
          // El correo existe, continuar con Stripe
          this.proceedToCheckout(planId, this.secondEmail.trim());
        },
        error: (err) => {
          this.isLoadingMap[planId] = false;
          if (err.status === 404) {
            this.errorMessage = 'El correo ingresado no está registrado en la plataforma.';
          } else {
            this.errorMessage = 'Error al verificar el correo. Intenta de nuevo.';
          }
        }
      });
    } else {
      this.isLoadingMap[planId] = true;
      this.proceedToCheckout(planId);
    }
  }

  private proceedToCheckout(planId: string, secondEmail?: string) {
    this.stripeService.createSubscriptionSession(planId, secondEmail).subscribe({
      next: (res) => {
        window.location.href = res.url;
      },
      error: (err) => {
        console.error('Error starting checkout session', err);
        this.isLoadingMap[planId] = false;
        
        if (err.status === 403 && err.error?.error) {
           alert(err.error.error);
        } else if (err.status === 400 && err.error?.error) {
           this.errorMessage = err.error.error;
        } else {
           alert('Ocurrió un error al intentar iniciar el pago. Asegúrate de estar autenticado (inicia sesión).');
        }
      }
    });
  }
}