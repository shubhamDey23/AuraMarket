import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';
import { ToastService } from './toast.service';
import { MOCK_PRODUCTS } from '../../data/mock/products.mock';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  readonly items = signal<Product[]>([]);

  readonly itemCount = computed(() => this.items().length);

  constructor(private toastService: ToastService) {
    // Populate demo wishlist
    this.items.set([MOCK_PRODUCTS[1], MOCK_PRODUCTS[4]]);
  }

  toggleWishlist(product: Product): void {
    const exists = this.isInWishlist(product.id);
    if (exists) {
      this.items.update((curr) => curr.filter((p) => p.id !== product.id));
      this.toastService.info(`Removed "${product.name}" from wishlist.`);
    } else {
      this.items.update((curr) => [...curr, product]);
      this.toastService.success(`Saved "${product.name}" to wishlist!`);
    }
  }

  isInWishlist(productId: string): boolean {
    return this.items().some((p) => p.id === productId);
  }

  clearWishlist(): void {
    this.items.set([]);
  }
}
