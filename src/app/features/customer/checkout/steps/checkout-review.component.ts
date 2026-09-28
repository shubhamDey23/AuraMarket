import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { CartService } from '../../../../core/services/cart.service';
import { CartItem } from '../../../../core/models/cart.model';
import { AppIconComponent } from '../../../../shared/components/app-icon.component';
import { formatInr } from '../../../../core/utils/currency.util';

export interface SellerReviewGroup {
  sellerId: string;
  sellerName: string;
  items: CartItem[];
  subtotal: number;
}

@Component({
  selector: 'app-checkout-review',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Review Your Order</h2>
        <p class="text-xs text-slate-500 mt-0.5">Double check your delivery address, items per seller, and totals</p>
      </div>

      <!-- Address & Delivery Summary Bar -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Shipping Address Card -->
        <div class="card p-4 bg-white space-y-2 border border-slate-200">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <span class="text-xs font-bold uppercase text-slate-500">Shipping Address</span>
            <button (click)="goToAddress()" class="text-xs text-indigo-600 font-semibold hover:underline">Change</button>
          </div>
          <div *ngIf="checkoutService.selectedAddress() as addr" class="text-xs space-y-0.5">
            <div class="font-bold text-slate-900">{{ addr.fullName }}</div>
            <div class="text-slate-600">{{ addr.addressLine1 }}, {{ addr.city }}, {{ addr.state }} {{ addr.postalCode }}</div>
            <div class="text-slate-500">Phone: {{ addr.phone }}</div>
          </div>
        </div>

        <!-- Delivery Method Card -->
        <div class="card p-4 bg-white space-y-2 border border-slate-200">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <span class="text-xs font-bold uppercase text-slate-500">Delivery Method</span>
            <button (click)="goToDelivery()" class="text-xs text-indigo-600 font-semibold hover:underline">Change</button>
          </div>
          <div *ngIf="checkoutService.selectedDeliveryOption() as del" class="text-xs space-y-0.5">
            <div class="font-bold text-slate-900">{{ del.name }}</div>
            <div class="text-slate-600">Expected: {{ del.estimatedDays }}</div>
            <div class="text-emerald-600 font-semibold">Shipping Fee: {{ formatInr(del.fee) }}</div>
          </div>
        </div>
      </div>

      <!-- Multi-Seller Items Breakdown -->
      <div class="space-y-4">
        <h3 class="font-bold text-slate-900 text-sm">Items Grouped by Seller ({{ sellerGroups.length }} Stores)</h3>

        <div *ngFor="let group of sellerGroups" class="card p-5 bg-white space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <app-icon name="store" [size]="16" customClass="text-indigo-600"></app-icon>
              <h4 class="font-bold text-slate-900 text-xs">Fulfilled by {{ group.sellerName }}</h4>
            </div>
            <span class="text-xs text-slate-500 font-medium">Subtotal: {{ formatInr(group.subtotal) }}</span>
          </div>

          <div class="space-y-2">
            <div *ngFor="let item of group.items" class="flex items-center justify-between gap-4 text-xs">
              <div class="flex items-center gap-3">
                <img [src]="item.product.featuredImage" class="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                <div>
                  <div class="font-bold text-slate-900 line-clamp-1">{{ item.product.name }}</div>
                  <div class="text-slate-500">Qty: {{ item.quantity }} • Unit: {{ formatInr(item.unitPrice) }}</div>
                </div>
              </div>
              <div class="font-extrabold text-slate-900">{{ formatInr(item.totalPrice) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex items-center justify-between pt-4 border-t border-slate-200">
        <button (click)="goToDelivery()" class="btn btn-outline flex items-center gap-2">
          <app-icon name="arrow-left" [size]="18"></app-icon>
          <span>Back to Delivery</span>
        </button>

        <button (click)="proceedToPayment()" class="btn btn-lg btn-primary flex items-center gap-2">
          <span>Proceed to Payment</span>
          <app-icon name="arrow-right" [size]="18"></app-icon>
        </button>
      </div>
    </div>
  `,
})
export class CheckoutReviewComponent {
  formatInr = formatInr;
  constructor(
    public checkoutService: CheckoutService,
    public cartService: CartService,
    private router: Router
  ) {}

  get sellerGroups(): SellerReviewGroup[] {
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

  goToAddress(): void {
    this.checkoutService.setStep(1);
    this.router.navigate(['/checkout/address']);
  }

  goToDelivery(): void {
    this.checkoutService.setStep(2);
    this.router.navigate(['/checkout/delivery']);
  }

  proceedToPayment(): void {
    this.checkoutService.setStep(4);
    this.router.navigate(['/checkout/payment']);
  }
}
