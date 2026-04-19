// features/cart/cart-page/cart-page.component.ts
import {
  Component,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="page-container max-w-4xl">

      <h1 class="section-title">Tu carrito</h1>

      @if (cart.count() === 0) {

        <!-- Carrito vacío -->
        <div class="text-center py-20">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184
                     1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2
                     2 0 014 0z"/>
          </svg>
          <p class="text-xl font-semibold text-gray-700">Tu carrito está vacío</p>
          <p class="text-gray-400 mt-1 text-sm">Explora nuestros cursos y empieza a aprender</p>
          <a routerLink="/courses" class="btn btn-primary mt-6 text-sm">
            Ver catálogo
          </a>
        </div>

      } @else {

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Lista de cursos -->
          <div class="lg:col-span-2 space-y-4">
            <p class="text-sm text-gray-500 mb-2">
              {{ cart.count() }} {{ cart.count() === 1 ? 'curso' : 'cursos' }} en tu carrito
            </p>

            @for (item of cart.items(); track item.courseId) {
              <div class="card flex gap-4 p-4">

                <!-- Thumbnail -->
                <div class="w-24 h-16 rounded-lg overflow-hidden shrink-0
                            bg-gradient-to-br from-sky-100 to-blue-200">
                  @if (item.thumbnailUrl) {
                    <img [src]="item.thumbnailUrl" [alt]="item.title"
                         class="w-full h-full object-cover" loading="lazy" />
                  }
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                    {{ item.title }}
                  </h3>
                  <p class="text-xs text-gray-400 mt-1">
                    Agregado {{ formatDate(item.addedAt) }}
                  </p>
                </div>

                <!-- Precio y eliminar -->
                <div class="flex flex-col items-end justify-between shrink-0">
                  <span class="font-bold text-gray-900">
                    @if (item.price === 0) {
                      <span class="text-green-600">Gratis</span>
                    } @else {
                      $ {{ item.price.toFixed(2) }}
                    }
                  </span>
                  <button
                    (click)="cart.removeItem(item.courseId)"
                    class="text-xs text-red-400 hover:text-red-600 transition-colors
                           flex items-center gap-1 mt-2"
                    aria-label="Eliminar curso del carrito"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
                               01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0
                               00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Eliminar
                  </button>
                </div>

              </div>
            }
          </div>

          <!-- Resumen de compra -->
          <div class="lg:col-span-1">
            <div class="card p-6 sticky top-24">
              <h2 class="font-bold text-gray-900 text-lg mb-4">Resumen</h2>

              <div class="space-y-2 text-sm">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal ({{ cart.count() }} cursos)</span>
                  <span>$ {{ cart.total().toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Descuento</span>
                  <span class="text-green-600">—</span>
                </div>
                <div class="border-t border-gray-200 pt-2 mt-2 flex justify-between
                            font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>$ {{ cart.total().toFixed(2) }}</span>
                </div>
              </div>

              <button class="btn btn-primary w-full justify-center py-3 mt-6">
                Proceder al pago
              </button>

              <button
                (click)="cart.clear()"
                class="w-full mt-2 text-xs text-gray-400 hover:text-red-500
                       transition-colors py-1"
              >
                Vaciar carrito
              </button>

              <a routerLink="/courses"
                 class="block text-center text-sm text-sky-500 hover:text-sky-600
                        transition-colors mt-3">
                ← Seguir explorando
              </a>
            </div>
          </div>

        </div>

      }

    </div>
  `,
})
export class CartPageComponent {
  readonly cart = inject(CartService);

  formatDate(isoString: string): string {
    try {
      return new Date(isoString).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'short',
      });
    } catch {
      return '';
    }
  }
}