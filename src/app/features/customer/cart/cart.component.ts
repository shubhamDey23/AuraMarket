import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { formatInr } from '../../../core/utils/currency.util';

export interface SellerCartGroup {
  sellerId: string;
  sellerName: string;
  items: CartItem[];
  subtotal: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AppIconComponent,
    EmptyStateComponent,
  ],
  template: `
    <div class="container space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-extrabold text-slate-900">Shopping Cart</h1>
        <span class="text-xs text-slate-500 font-semibold">{{ cartService.itemCount() }} item(s) across {{ sellerGroups.length }} seller(s)</span>
      </div>

      <div *ngIf="cartService.items().length > 0; else emptyCart" class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <!-- Items Grouped By Seller -->
        <div class="lg:col-span-2 space-y-6">
          <div *ngFor="let group of sellerGroups" class="card bg-white p-5 space-y-4">
            <!-- Seller Group Header -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <app-icon name="store" [size]="18" customClass="text-indigo-600"></app-icon>
                <h3 class="font-bold text-slate-900 text-sm">Fulfilled by {{ group.sellerName }}</h3>
              </div>
              <span class="text-xs font-semibold text-slate-500">Group Subtotal: {{ formatInr(group.subtotal) }}</span>
            </div>

            <!-- Items in this group -->
            <div class="space-y-4">
              <div *ngFor="let item of group.items" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
                <div class="flex items-center gap-4">
                  <img [src]="item.product.featuredImage" [alt]="item.product.name" class="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50" />
                  <div>
                    <h4 class="font-bold text-sm text-slate-900 line-clamp-1">
                      <a [routerLink]="['/products', item.productId]" class="hover:text-indigo-600">
                        {{ item.product.name }}
                      </a>
                    </h4>
                    <div class="text-xs text-slate-500 mt-0.5">
                      SKU: <span class="font-mono">{{ item.product.sku }}</span> • Unit Price: <strong class="text-slate-700">{{ formatInr(item.unitPrice) }}</strong>
                    </div>
                  </div>
                </div>

                <!-- Quantity & Total -->
                <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0">
                  <div class="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                    <button (click)="cartService.updateQuantity(item.id, item.quantity - 1)" class="px-2.5 py-1 text-slate-600 hover:bg-slate-200">-</button>
                    <span class="px-3 py-1 text-xs font-bold text-slate-900">{{ item.quantity }}</span>
                    <button (click)="cartService.updateQuantity(item.id, item.quantity + 1)" class="px-2.5 py-1 text-slate-600 hover:bg-slate-200">+</button>
                  </div>

                  <div class="text-right">
                    <div class="text-sm font-extrabold text-slate-900">{{ formatInr(item.totalPrice) }}</div>
                    <button (click)="cartService.removeFromCart(item.id)" class="text-xs text-red-500 hover:underline flex items-center gap-0.5 mt-0.5">
                      <app-icon name="trash" [size]="12"></app-icon> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary & Coupon Sidebar -->
        <div class="card p-6 bg-white space-y-6">
          <h2 class="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Order Summary</h2>

          <!-- Coupon Input -->
          <div>
            <label class="form-label text-xs font-semibold text-slate-700">Promo / Coupon Code</label>
            <div class="flex gap-2 mt-1">
              <input
                type="text"
                [(ngModel)]="couponInput"
                placeholder="WELCOME15 or FREESHIP"
                class="form-input text-xs py-2 uppercase"
              />
              <button (click)="applyCoupon()" class="btn btn-sm btn-outline text-xs font-semibold">Apply</button>
            </div>
            <p *ngIf="cartService.appliedCouponCode()" class="text-[11px] text-emerald-600 font-semibold mt-1">
              Coupon "{{ cartService.appliedCouponCode() }}" applied!
            </p>
          </div>

          <!-- Totals Breakdown -->
          <div class="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
            <div class="flex justify-between">
              <span>Items Subtotal:</span>
              <span class="font-semibold text-slate-900">{{ formatInr(cartService.subtotal()) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Multi-Seller Shipping ({{ sellerGroups.length }} sellers):</span>
              <span class="font-semibold text-slate-900">{{ formatInr(cartService.shippingTotal()) }}</span>
            </div>
            <div class="flex justify-between"><span>Taxes (GST 18%):</span><span class="font-semibold text-slate-900">{{ formatInr(cartService.taxTotal()) }}</span></div>
            <div *ngIf="cartService.discountAmount() > 0" class="flex justify-between text-emerald-600 font-semibold">
              <span>Discount:</span>
              <span>-{{ formatInr(cartService.discountAmount()) }}</span>
            </div>
            <div class="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-3">
              <span>Grand Total:</span>
              <span class="text-indigo-600 text-base">{{ formatInr(cartService.grandTotal()) }}</span>
            </div>
          </div>

          <!-- Checkout CTA -->
          <a routerLink="/checkout" class="btn btn-lg btn-primary w-full text-center flex items-center justify-center gap-2">
            <span>Proceed to Checkout</span>
            <app-icon name="arrow-right" [size]="18"></app-icon>
          </a>
        </div>
      </div>

      <ng-template #emptyCart>
        <app-empty-state
          icon="shopping-cart"
          title="Your cart is empty"
          description="Explore thousands of products from independent marketplace sellers and add them to your cart."
          actionLabel="Explore Catalogue"
          (action)="navigateToProducts()"
        ></app-empty-state>
      </ng-template>
    </div>
  `,
})
export class CartComponent {
  formatInr = formatInr;
  couponInput = '';

  constructor(
    public cartService: CartService,
    private router: Router
  ) {}

  get sellerGroups(): SellerCartGroup[] {
    const items = this.cartService.items();
    const map = new Map<string, CartItem[]>();

    items.forEach((item) => {
      if (!map.has(item.sellerId)) {
        map.set(item.sellerId, []);
      }
      map.get(item.sellerId)!.push(item);
    });

    return Array.from(map.entries()).map(([sellerId, sellerItems]) => ({
      sellerId,
      sellerName: sellerItems[0].sellerName,
      items: sellerItems,
      subtotal: sellerItems.reduce((sum, i) => sum + i.totalPrice, 0),
    }));
  }

  applyCoupon(): void {
    if (this.couponInput.trim()) {
      this.cartService.applyCoupon(this.couponInput.trim());
    }
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
}
