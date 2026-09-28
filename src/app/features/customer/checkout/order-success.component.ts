import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  template: `
    <div class="container max-w-xl my-8">
      <div *ngIf="order" class="card p-8 sm:p-10 bg-white text-center space-y-6 shadow-md border border-slate-200">
        <!-- Success Check Icon -->
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <app-icon name="check" [size]="36"></app-icon>
        </div>

        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            Order Confirmed
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Thank you for your order!
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            We have sent order details and receipt to <strong>{{ order.customerEmail }}</strong>.
          </p>
        </div>

        <!-- Summary Details Box -->
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
          <div class="flex justify-between py-1 border-b border-slate-200/60">
            <span class="text-slate-500">Order Number:</span>
            <span class="font-extrabold text-slate-900 font-mono text-sm">{{ order.orderNumber }}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-200/60">
            <span class="text-slate-500">Multi-Seller Stores:</span>
            <span class="font-semibold text-indigo-600">{{ order.sellerOrders.length }} Store Fulfillments</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-200/60">
            <span class="text-slate-500">Estimated Delivery:</span>
            <span class="font-bold text-emerald-600">10 September 2026</span>
          </div>
          <div class="flex justify-between py-1 text-sm font-extrabold text-slate-900 pt-1">
            <span>Total Amount Paid:</span>
            <span class="text-indigo-600 text-base">{{ formatInr(order.grandTotal) }}</span>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a [routerLink]="['/orders', order.id]" class="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
            <app-icon name="eye" [size]="16"></app-icon>
            <span>View & Track Order</span>
          </a>
          <a routerLink="/" class="btn btn-outline w-full sm:w-auto">
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  `,
})
export class OrderSuccessComponent implements OnInit {
  formatInr = formatInr;
  order?: Order;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.orderService.getOrderById(id).subscribe((res) => {
          this.order = res;
        });
      }
    });
  }
}
