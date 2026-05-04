import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeService } from '../../../shared/services/stripe.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-success.html',
  styleUrls: ['./payment-success.scss']
})
export class PaymentSuccess implements OnInit {
  loading = true;
  success = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stripeService: StripeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const sessionId = params['session_id'];
      const planId = params['plan'];

      if (sessionId && planId) {
        this.stripeService.verifySubscriptionSession(sessionId, planId).subscribe({
          next: () => {
            this.authService.loadCurrentUser().subscribe(); // Reload user token data
            this.success = true;
            this.loading = false;
            setTimeout(() => this.router.navigate(['/premium']), 4000); // Redirect to premium
          },
          error: (err) => {
            this.errorMsg = 'Hubo un problema verificando tu pago.';
            this.loading = false;
          }
        });
      } else {
        this.loading = false;
        this.errorMsg = 'Parámetros inválidos de pago.';
      }
    });
  }
}
