import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { OrderStatusBadgeComponent } from '../../../shared/components/order-status-badge.component';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { OrderTrackingTimelineComponent } from '../../../shared/ecommerce/order-tracking-timeline.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    OrderStatusBadgeComponent,
    AppIconComponent,
    OrderTrackingTimelineComponent,
  ],
  template: `
    <div class="container space-y-6" *ngIf="order">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/orders" class="hover:text-indigo-600">My Orders</a> /
        <span class="text-slate-800 font-medium font-mono">{{ order.orderNumber }}</span>
      </nav>

      <!-- Top Order Header Card -->
      <div class="card p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <h1 class="text-xl font-extrabold text-slate-900 font-mono">Order #{{ order.orderNumber }}</h1>
            <app-order-status-badge [status]="order.status"></app-order-status-badge>
          </div>
          <p class="text-xs text-slate-500">Placed on {{ order.createdAt }} • Payment: <strong>{{ order.paymentStatus }}</strong></p>
        </div>

        <div class="flex items-center gap-2">
          <button *ngIf="order.status === 'PENDING' || order.status === 'PROCESSING'" (click)="openCancelModal()" class="btn btn-sm btn-outline text-red-600 border-red-200 hover:bg-red-50 text-xs">
            Cancel Order
          </button>
        </div>
      </div>

      <!-- Seller Sub-Orders & Tracking -->
      <div class="space-y-4">
        <h2 class="font-bold text-slate-900 text-base">Shipment Fulfillments ({{ order.sellerOrders.length }} Seller Stores)</h2>

        <div *ngFor="let sOrder of order.sellerOrders" class="card p-6 bg-white space-y-4 border border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div class="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Fulfilled by {{ sOrder.sellerName }}</span>
                <app-order-status-badge [status]="sOrder.status"></app-order-status-badge>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">Package Ref: {{ sOrder.id }}</p>
            </div>
          </div>

          <!-- Tracking Timeline for Seller Sub-Order -->
          <div *ngIf="sOrder.shipment" class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            <div class="flex items-center justify-between text-xs font-bold text-slate-800">
              <span class="flex items-center gap-1">
                <app-icon name="truck" [size]="16" class="text-indigo-600"></app-icon>
                Carrier: {{ sOrder.shipment.carrierName || 'BlueDart Express' }} (Tracking #{{ sOrder.shipment.trackingNumber }})
              </span>
              <span class="text-emerald-600">Est. Delivery: {{ sOrder.shipment.estimatedDeliveryAt }}</span>
            </div>
            <app-order-tracking-timeline [status]="sOrder.status"></app-order-tracking-timeline>
          </div>

          <!-- Package Items -->
          <div class="space-y-2 text-xs">
            <div *ngFor="let item of sOrder.items" class="flex items-center justify-between gap-4 py-1">
              <div class="flex items-center gap-3">
                <img [src]="item.productImage" class="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                <div>
                  <div class="font-bold text-slate-900 line-clamp-1">{{ item.productName }}</div>
                  <div class="text-slate-500">SKU: {{ item.productSku }} • Qty: {{ item.quantity }} × {{ formatInr(item.unitPrice) }}</div>
                </div>
              </div>
              <div class="font-extrabold text-slate-900">{{ formatInr(item.totalPrice) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial & Address Footer -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card p-5 bg-white space-y-2 border border-slate-200">
          <h3 class="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">Shipping Address</h3>
          <p class="text-xs text-slate-700 font-semibold">{{ order.shippingAddress.fullName }}</p>
          <p class="text-xs text-slate-500">{{ order.shippingAddress.addressLine1 }}, {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.postalCode }}</p>
          <p class="text-xs text-slate-500">Phone: {{ order.shippingAddress.phone }}</p>
        </div>

        <div class="card p-5 bg-white space-y-2 text-xs border border-slate-200">
          <h3 class="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">Order Price Summary</h3>
          <div class="flex justify-between"><span>Subtotal:</span><span class="font-semibold">{{ formatInr(order.subtotal) }}</span></div>
          <div class="flex justify-between"><span>Multi-Seller Shipping:</span><span class="font-semibold">{{ formatInr(order.shippingTotal) }}</span></div>
          <div class="flex justify-between"><span>Taxes (GST 18%):</span><span class="font-semibold">{{ formatInr(order.taxTotal) }}</span></div>
          <div class="flex justify-between text-sm font-extrabold text-indigo-600 border-t border-slate-200 pt-2">
            <span>Grand Total:</span><span>{{ formatInr(order.grandTotal) }}</span>
          </div>
        </div>
      </div>

      <!-- Order Cancellation Modal -->
      <div *ngIf="isCancelModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-base">Cancel Order Request</h3>
            <button (click)="isCancelModalOpen = false" class="text-slate-400"><app-icon name="x" [size]="20"></app-icon></button>
          </div>

          <div class="space-y-3 text-xs">
            <p class="text-slate-600">Are you sure you want to cancel order <strong>{{ order.orderNumber }}</strong>?</p>
            <div class="form-group">
              <label class="form-label">Cancellation Reason</label>
              <select [(ngModel)]="cancelReason" class="form-select">
                <option value="Changed my mind">Changed my mind</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Found another product">Found another product</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button (click)="isCancelModalOpen = false" class="btn btn-sm btn-outline">Keep Order</button>
            <button (click)="confirmCancellation()" class="btn btn-sm btn-danger">Confirm Cancellation</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class OrderDetailComponent implements OnInit {
  formatInr = formatInr;
  order?: Order;
  isCancelModalOpen = false;
  cancelReason = 'Changed my mind';

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

  isCancellable(): boolean {
    return this.order ? this.order.status === 'PENDING' || this.order.status === 'CONFIRMED' : false;
  }

  openCancelModal(): void {
    this.isCancelModalOpen = true;
  }

  confirmCancellation(): void {
    if (this.order) {
      this.orderService.cancelOrder(this.order.id, this.cancelReason).subscribe((success) => {
        if (success) {
          this.order!.status = 'CANCELLED';
        }
        this.isCancelModalOpen = false;
      });
    }
  }
}
