import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Order, SellerOrder, OrderStatus } from '../../../core/models/order.model';
import { OrderStatusBadgeComponent } from '../../../shared/components/order-status-badge.component';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-seller-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, OrderStatusBadgeComponent, AppIconComponent],
  template: `
    <div class="container space-y-6 max-w-4xl">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/seller/dashboard" class="hover:text-indigo-600">Seller Portal</a> /
        <a routerLink="/seller/orders" class="hover:text-indigo-600">Orders</a> /
        <span class="text-slate-800 font-medium">Fulfillment Details</span>
      </nav>

      <!-- Access Denied Card -->
      <div *ngIf="accessDenied" class="card p-8 bg-red-50/80 border border-red-200 text-center space-y-4">
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <app-icon name="alert-triangle" [size]="24"></app-icon>
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-900">Access Denied</h2>
          <p class="text-xs text-slate-600 max-w-md mx-auto mt-1">
            This seller fulfillment order does not belong to <strong>{{ authService.currentSeller().storeName }}</strong>. You do not have permission to view customer details or update status for other stores.
          </p>
        </div>
        <a routerLink="/seller/orders" class="btn btn-primary btn-sm inline-flex">Return to My Orders</a>
      </div>

      <!-- Main Order View -->
      <div *ngIf="!accessDenied && sellerOrder && parentOrder" class="space-y-6">
        <!-- Order Header Card -->
        <div class="card p-6 bg-white space-y-4 border border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-extrabold text-slate-900">Fulfillment {{ sellerOrder.id }}</h1>
                <app-order-status-badge [status]="sellerOrder.status"></app-order-status-badge>
              </div>
              <p class="text-xs text-slate-500 mt-1">
                Marketplace Order: <strong>{{ parentOrder.orderNumber }}</strong> • Created: {{ sellerOrder.createdAt | date:'medium' }}
              </p>
            </div>

            <!-- Workflow Status Transition Controller -->
            <div class="flex items-center gap-2">
              <button
                *ngIf="sellerOrder.status === 'PENDING' || sellerOrder.status === 'CONFIRMED'"
                (click)="updateStatus('PROCESSING')"
                class="btn btn-sm btn-primary flex items-center gap-1 text-xs"
              >
                <app-icon name="clock" [size]="14"></app-icon> Start Processing
              </button>
              <button
                *ngIf="sellerOrder.status === 'PROCESSING'"
                (click)="updateStatus('READY_TO_SHIP')"
                class="btn btn-sm btn-primary flex items-center gap-1 text-xs"
              >
                <app-icon name="check" [size]="14"></app-icon> Mark Ready to Ship
              </button>
              <button
                *ngIf="sellerOrder.status === 'READY_TO_SHIP'"
                (click)="updateStatus('SHIPPED')"
                class="btn btn-sm btn-primary flex items-center gap-1 text-xs"
              >
                <app-icon name="truck" [size]="14"></app-icon> Generate Tracking & Ship
              </button>
              <button
                *ngIf="sellerOrder.status === 'SHIPPED'"
                (click)="updateStatus('DELIVERED')"
                class="btn btn-sm btn-primary flex items-center gap-1 text-xs"
              >
                <app-icon name="check" [size]="14"></app-icon> Confirm Delivery
              </button>
            </div>
          </div>

          <!-- Customer & Delivery Info Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-2">
            <div>
              <h3 class="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                <app-icon name="user" [size]="16" customClass="text-indigo-600"></app-icon> Customer Contact Info
              </h3>
              <div class="p-3 bg-slate-50 rounded-xl space-y-1 text-slate-700">
                <p><strong>Name:</strong> {{ parentOrder.customerName }}</p>
                <p><strong>Email:</strong> {{ parentOrder.customerEmail }}</p>
                <p><strong>Phone:</strong> {{ parentOrder.customerPhone }}</p>
              </div>
            </div>

            <div>
              <h3 class="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                <app-icon name="map-pin" [size]="16" customClass="text-indigo-600"></app-icon> Delivery Shipping Address
              </h3>
              <div class="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed">
                <p class="font-bold text-slate-900">{{ parentOrder.shippingAddress.fullName }}</p>
                <p>{{ parentOrder.shippingAddress.addressLine1 }}<span *ngIf="parentOrder.shippingAddress.addressLine2">, {{ parentOrder.shippingAddress.addressLine2 }}</span></p>
                <p>{{ parentOrder.shippingAddress.city }}, {{ parentOrder.shippingAddress.state }} {{ parentOrder.shippingAddress.postalCode }}, {{ parentOrder.shippingAddress.country }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Carrier Shipment Info -->
        <div *ngIf="sellerOrder.shipment" class="card p-5 bg-indigo-50/60 border border-indigo-200/80 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-indigo-950 text-sm flex items-center gap-2">
              <app-icon name="truck" [size]="18" customClass="text-indigo-600"></app-icon> Shipment & Tracking Details
            </h3>
            <span class="badge badge-primary text-[10px]">{{ sellerOrder.shipment.status }}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
            <div>
              <span class="text-slate-500 text-[11px]">Carrier Partner:</span>
              <div class="font-bold text-slate-900 mt-0.5">{{ sellerOrder.shipment.carrierName }}</div>
            </div>
            <div>
              <span class="text-slate-500 text-[11px]">Tracking Number:</span>
              <div class="font-mono font-bold text-indigo-700 mt-0.5">{{ sellerOrder.shipment.trackingNumber }}</div>
            </div>
            <div>
              <span class="text-slate-500 text-[11px]">Estimated Delivery:</span>
              <div class="font-bold text-slate-900 mt-0.5">{{ sellerOrder.shipment.estimatedDeliveryAt }}</div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="card p-6 bg-white space-y-4 border border-slate-200">
          <h3 class="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Order Items (Fulfilled by {{ sellerOrder.sellerName }})</h3>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>SKU</th>
                  <th>Unit Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of sellerOrder.items">
                  <td>
                    <div class="flex items-center gap-3">
                      <img [src]="item.productImage" class="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0" />
                      <div class="font-bold text-slate-900 text-xs">{{ item.productName }}</div>
                    </div>
                  </td>
                  <td class="font-mono text-xs text-slate-600">{{ item.productSku }}</td>
                  <td class="text-xs text-slate-700">{{ formatInr(item.unitPrice) }}</td>
                  <td class="font-bold text-xs text-slate-900">{{ item.quantity }}</td>
                  <td class="font-extrabold text-xs text-slate-900">{{ formatInr(item.totalPrice) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Financial Breakdown Split -->
          <div class="pt-4 border-t border-slate-100 flex justify-end">
            <div class="w-full max-w-xs space-y-2 text-xs text-slate-600">
              <div class="flex justify-between">
                <span>Items Subtotal:</span>
                <span class="font-semibold text-slate-900">{{ formatInr(sellerOrder.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Seller Shipping Fee:</span>
                <span class="font-semibold text-slate-900">{{ formatInr(sellerOrder.shippingFee) }}</span>
              </div>
              <div class="flex justify-between text-red-500">
                <span>Platform Commission (5%):</span>
                <span>-{{ formatInr(sellerOrder.subtotal * 0.05) }}</span>
              </div>
              <div class="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-2">
                <span>Net Seller Payout:</span>
                <span class="text-indigo-600 text-base">{{ formatInr(sellerOrder.total - sellerOrder.subtotal * 0.05) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SellerOrderDetailComponent implements OnInit {
  formatInr = formatInr;
  sellerOrderId: string | null = null;
  sellerOrder: SellerOrder | null = null;
  parentOrder: Order | null = null;
  accessDenied = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.sellerOrderId = this.route.snapshot.paramMap.get('id');

    if (this.sellerOrderId) {
      this.orderService.getSellerOrderDetails(this.sellerOrderId).subscribe((res) => {
        if (!res) {
          this.accessDenied = true;
          return;
        }

        // Strict seller ownership guard
        if (res.sellerOrder.sellerId !== this.authService.currentSellerId()) {
          this.accessDenied = true;
          return;
        }

        this.sellerOrder = res.sellerOrder;
        this.parentOrder = res.parentOrder;
      });
    }
  }

  updateStatus(newStatus: OrderStatus): void {
    if (!this.sellerOrder) return;
    this.orderService.updateSellerOrderStatus(this.sellerOrder.id, newStatus).subscribe((updated) => {
      if (updated) {
        this.sellerOrder = updated;
      }
    });
  }
}
