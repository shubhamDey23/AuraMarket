import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { OrderStatusBadgeComponent } from '../../../shared/components/order-status-badge.component';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-admin-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, OrderStatusBadgeComponent, AppIconComponent],
  template: `
    <div class="container space-y-6 max-w-5xl">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/admin/dashboard" class="hover:text-indigo-600">Admin Console</a> /
        <a routerLink="/admin/orders" class="hover:text-indigo-600">Marketplace Orders</a> /
        <span class="text-slate-800 font-medium">Order Inspection</span>
      </nav>

      <div *ngIf="order" class="space-y-6">
        <!-- Order Header Card -->
        <div class="card p-6 bg-white space-y-4 border border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-bold text-slate-900">Order #{{ order.orderNumber }}</h1>
                <app-order-status-badge [status]="order.status"></app-order-status-badge>
              </div>
              <p class="text-xs text-slate-500 mt-1">Placed on {{ order.createdAt }} • Customer: <strong>{{ order.customerName }}</strong> ({{ order.customerEmail }})</p>
            </div>

            <!-- Global Order Status Actions -->
            <div class="flex flex-wrap items-center gap-2">
              <button
                *ngIf="order.status !== 'CANCELLED' && order.status !== 'DELIVERED'"
                (click)="updateOrderStatus('CANCELLED')"
                class="btn btn-sm btn-outline text-red-600 border-red-200 hover:bg-red-50 text-xs"
              >
                Cancel Order
              </button>
            </div>
          </div>

          <!-- Address & Payment Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <div class="font-bold text-slate-900 flex items-center gap-1.5">
                <app-icon name="map-pin" [size]="14" class="text-indigo-600"></app-icon> Shipping Destination
              </div>
              <div class="text-slate-700 font-medium">{{ order.shippingAddress.fullName }}</div>
              <div class="text-slate-500">
                {{ order.shippingAddress.addressLine1 }}<span *ngIf="order.shippingAddress.addressLine2">, {{ order.shippingAddress.addressLine2 }}</span><br />
                {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.postalCode }}
              </div>
              <div class="text-slate-500">Phone: {{ order.shippingAddress.phone }}</div>
            </div>

            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <div class="font-bold text-slate-900 flex items-center gap-1.5">
                <app-icon name="credit-card" [size]="14" class="text-indigo-600"></app-icon> Payment Settlement
              </div>
              <div class="text-slate-700">Method: <strong>{{ order.paymentMethod }}</strong></div>
              <div class="text-slate-500">Status: <strong class="text-emerald-700">{{ order.paymentStatus }}</strong></div>
              <div class="text-slate-500">Total Charged: <strong class="text-slate-900">{{ formatInr(order.grandTotal) }}</strong></div>
            </div>
          </div>
        </div>

        <!-- Split Seller Sub-Orders Breakdown -->
        <div class="space-y-4">
          <h2 class="font-bold text-slate-900 text-base">Multi-Seller Fulfillments ({{ order.sellerOrders.length }} Seller Stores)</h2>

          <div *ngFor="let sOrder of order.sellerOrders" class="card p-6 bg-white space-y-4 border border-slate-200">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div class="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>Seller Sub-Order #{{ sOrder.id }}</span>
                  <span class="text-xs text-indigo-600 font-medium">({{ sOrder.sellerName }})</span>
                </div>
                <div class="text-[11px] text-slate-400">Seller ID: {{ sOrder.sellerId }}</div>
              </div>

              <app-order-status-badge [status]="sOrder.status"></app-order-status-badge>
            </div>

            <!-- Items in this group -->
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

            <div *ngIf="sOrder.shipment" class="pt-3 border-t border-slate-100 text-xs text-slate-600 flex justify-between">
              <span>Carrier Tracking: <strong class="font-mono text-indigo-700">{{ sOrder.shipment.trackingNumber }}</strong></span>
              <span>Estimated Delivery: <strong>{{ sOrder.shipment.estimatedDeliveryAt }}</strong></span>
            </div>
          </div>
        </div>

        <!-- Financial Totals Breakdown -->
        <div class="card p-6 bg-white space-y-4 border border-slate-200 flex justify-end">
          <div class="w-full max-w-xs space-y-2 text-xs text-slate-600">
            <div class="flex justify-between">
              <span>Items Subtotal:</span>
              <span class="font-semibold text-slate-900">{{ formatInr(order.subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Multi-Seller Shipping:</span>
              <span class="font-semibold text-slate-900">{{ formatInr(order.shippingTotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Taxes (GST 18%):</span>
              <span class="font-semibold text-slate-900">{{ formatInr(order.taxTotal) }}</span>
            </div>
            <div *ngIf="order.discountTotal > 0" class="flex justify-between text-emerald-600 font-semibold">
              <span>Discount Applied:</span>
              <span>-{{ formatInr(order.discountTotal) }}</span>
            </div>
            <div class="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-3">
              <span>Grand Total GMV:</span>
              <span class="text-indigo-600 text-base">{{ formatInr(order.grandTotal) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminOrderDetailComponent implements OnInit {
  formatInr = formatInr;
  orderId: string | null = null;
  order: Order | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toastService: ToastService,
    private activityLogService: ActivityLogService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.orderService.getOrderById(this.orderId).subscribe((o) => {
        if (o) this.order = o;
      });
    }
  }

  updateOrderStatus(newStatus: OrderStatus): void {
    if (!this.order) return;
    this.orderService.updateOrderStatus(this.order.id, newStatus).subscribe((updated) => {
      if (updated) {
        this.order = updated;
        this.toastService.success(`Order status updated to ${newStatus}.`);
        this.activityLogService.logActivity(
          'ORDER_STATUS_UPDATED',
          'ORDER',
          this.order.id,
          `Updated marketplace order ${this.order.orderNumber} status to ${newStatus}.`
        );
      }
    });
  }
}
