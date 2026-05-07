import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createCheckoutSession(courseId: number): Observable<{ id: string, url: string }> {
    return this.http.post<{ id: string, url: string }>(`${this.apiUrl}/checkout/session/${courseId}`, {});
  }

  createSubscriptionSession(planId: string, secondEmail?: string): Observable<{ id: string, url: string }> {
    const body: any = { plan_id: planId };
    if (secondEmail) {
      body.second_email = secondEmail;
    }
    return this.http.post<{ id: string, url: string }>(`${this.apiUrl}/checkout/subscription`, body);
  }

  verifyEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout/verify-email`, { email });
  }

  verifySubscriptionSession(sessionId: string, planId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout/verify-subscription`, { session_id: sessionId, plan_id: planId });
  }
}
