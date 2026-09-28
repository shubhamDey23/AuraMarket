import { Injectable, signal, computed } from '@angular/core';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  readonly items = signal<CartItem[]>([]);
  readonly appliedCouponCode = signal<string | undefined>(undefined);
  readonly discountAmount = signal<number>(0);

  readonly itemCount = computed(() => {
    return this.items().reduce((sum, item) => sum + item.quantity, 0);
  });

  readonly subtotal = computed(() => {
    return this.items().reduce((sum, item) => sum + item.totalPrice, 0);
  });

  readonly shippingTotal = computed(() => {
    const itemsList = this.items();
    if (itemsList.length === 0) return 0;
    if (this.subtotal() >= 999) return 0;
    const sellers = new Set(itemsList.map((i) => i.sellerId));
    return sellers.size * 49;
  });

  readonly taxTotal = computed(() => {
    return Math.round(this.subtotal() * 0.18);
  });

  readonly grandTotal = computed(() => {
    const total = this.subtotal() + this.shippingTotal() + this.taxTotal() - this.discountAmount();
    return Math.max(0, Math.round(total));
  });

  readonly cart = computed<Cart>(() => ({
    items: this.items(),
    itemCount: this.itemCount(),
    subtotal: this.subtotal(),
    discountTotal: this.discountAmount(),
    shippingTotal: this.shippingTotal(),
    taxTotal: this.taxTotal(),
    grandTotal: this.grandTotal(),
    appliedCouponCode: this.appliedCouponCode(),
  }));

  constructor(private toastService: ToastService) {
    // Populate cart with a demo item initially so customer storefront demonstrates non-empty state
    this.initDemoCart();
  }

  private initDemoCart(): void {
    // Demo item
    const demoItem: CartItem = {
      id: 'demo-cart-1',
      productId: 'prod-1',
      sellerId: 'seller-1',
      sellerName: 'Aura Electronics',
      product: {
        id: 'prod-1',
        sellerId: 'seller-1',
        sellerName: 'Aura Electronics',
        name: 'AuraStudio Pro ANC Wireless Headphones',
        slug: 'aurastudio-pro-anc-headphones',
        sku: 'AD-HP-901',
        description: 'Studio beryllium drivers headphones.',
        shortDescription: 'Active noise cancellation headphones.',
        categoryId: 'cat-electronics',
        brandId: 'brand-1',
        price: 3499,
        salePrice: 2499,
        featuredImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        images: [],
        rating: 4.9,
        reviewCount: 184,
        tags: [],
        status: 'ACTIVE',
        isFeatured: true,
        isTrending: true,
        stockQuantity: 45,
        reorderLevel: 10,
        createdAt: '2024-03-01',
        updatedAt: '2024-03-10',
      },
      quantity: 1,
      unitPrice: 2499,
      totalPrice: 2499,
    };
    this.items.set([demoItem]);
  }

  addToCart(product: Product, quantity = 1, variantId?: string, variantName?: string): void {
    const unitPrice = product.salePrice || product.price;
    const existingIndex = this.items().findIndex(
      (i) => i.productId === product.id && i.selectedVariantId === variantId
    );

    if (existingIndex > -1) {
      const updated = [...this.items()];
      const item = updated[existingIndex];
      const newQty = item.quantity + quantity;
      updated[existingIndex] = {
        ...item,
        quantity: newQty,
        totalPrice: Math.round(unitPrice * newQty),
      };
      this.items.set(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-item-${Date.now()}`,
        productId: product.id,
        sellerId: product.sellerId,
        sellerName: product.sellerName || 'Marketplace Seller',
        product,
        selectedVariantId: variantId,
        selectedVariantName: variantName,
        quantity,
        unitPrice,
        totalPrice: Math.round(unitPrice * quantity),
      };
      this.items.update((current) => [...current, newItem]);
    }

    this.toastService.success(`Added "${product.name}" to cart!`, 'Cart Updated');
  }

  addItem(product: Product, quantity = 1, variantId?: string, variantName?: string): void {
    this.addToCart(product, quantity, variantId, variantName);
  }

  updateQuantity(cartItemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(cartItemId);
      return;
    }
    this.items.update((current) =>
      current.map((item) =>
        item.id === cartItemId
          ? {
              ...item,
              quantity,
              totalPrice: Math.round(item.unitPrice * quantity),
            }
          : item
      )
    );
  }

  removeFromCart(cartItemId: string): void {
    const item = this.items().find((i) => i.id === cartItemId);
    this.items.update((current) => current.filter((i) => i.id !== cartItemId));
    if (item) {
      this.toastService.info(`Removed "${item.product.name}" from cart.`);
    }
  }

  clearCart(): void {
    this.items.set([]);
    this.appliedCouponCode.set(undefined);
    this.discountAmount.set(0);
  }

  applyCoupon(code: string): boolean {
    const upper = code.toUpperCase();
    if (upper === 'WELCOME15') {
      const discount = Math.round(this.subtotal() * 0.15);
      this.appliedCouponCode.set('WELCOME15');
      this.discountAmount.set(discount);
      this.toastService.success('15% discount applied successfully!', 'Coupon Applied');
      return true;
    } else if (upper === 'FREESHIP') {
      this.appliedCouponCode.set('FREESHIP');
      this.discountAmount.set(this.shippingTotal());
      this.toastService.success('Free shipping coupon applied!', 'Coupon Applied');
      return true;
    } else if (upper === 'FESTIVE500') {
      this.appliedCouponCode.set('FESTIVE500');
      this.discountAmount.set(500);
      this.toastService.success('₹500 discount applied!', 'Coupon Applied');
      return true;
    } else {
      this.toastService.error('Invalid coupon code. Try WELCOME15 or FESTIVE500', 'Coupon Error');
      return false;
    }
  }
}
