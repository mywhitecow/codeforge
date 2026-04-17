// core/services/cart.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Cart, CartItem } from '../models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().length);
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price, 0)
  );

  addItem(item: CartItem): void {
    if (this._items().find(i => i.courseId === item.courseId)) return;
    this._items.update(items => [...items, item]);
  }

  removeItem(courseId: string): void {
    this._items.update(items => items.filter(i => i.courseId !== courseId));
  }

  clear(): void {
    this._items.set([]);
  }
}