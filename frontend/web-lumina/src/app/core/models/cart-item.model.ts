// core/models/cart-item.model.ts
export interface CartItem {
  courseId: string;
  title: string;
  price: number;
  thumbnailUrl: string;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}