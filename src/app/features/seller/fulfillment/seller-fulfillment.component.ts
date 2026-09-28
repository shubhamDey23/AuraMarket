import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { SellerOrder, OrderStatus } from '../../../core/models/order.model';
import { OrderStatusBadgeComponent } from '../../../shared/components/order-status-badge.component';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-seller-fulfillment',
  standalone: true,
  imports: [CommonModule, RouterModule, OrderStatusBadgeComponent, AppIconComponent, PaginationComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Seller Fulfillment Processing Queue</h1>
          <p class="text-xs text-slate-500 mt-1">
            Orders pending packing, label creation, and carrier dispatch for <strong>{{ authService.currentSeller().storeName }}</strong> ({{ activeFulfillmentOrders.length }} active orders)
          </p>
        </div>
        <a routerLink="/seller/orders" class="btn btn-outline flex items-center gap-1 text-xs">
          <app-icon name="truck" [size]="14"></app-icon> View All Orders
        </a>
      </div>

      <!-- Fulfillment Queue Cards -->
      <div class="space-y-4">
        <div *ngFor="let sOrder of paginatedOrders" class="card p-6 bg-white space-y-4 border border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div class="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span>Package Ref: {{ sOrder.id }}</span>
                <app-order-status-badge [status]="sOrder.status"></app-order-status-badge>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">
                Parent Order ID: <strong class="text-slate-700">{{ sOrder.orderId }}</strong> • Placed on {{ sOrder.createdAt }}
              </p>
            </div>

            <!-- Fulfillment Workflow Action Buttons -->
            <div class="flex items-center gap-2">
              <button
                *ngIf="sOrder.status === 'PENDING' || sOrder.status === 'CONFIRMED'"
                (click)="advanceStatus(sOrder, 'PROCESSING')"
                class="btn btn-sm btn-primary text-xs flex items-center gap-1"
              >
                <app-icon name="package" [size]="14"></app-icon> Pack Items
              </button>

              <button
                *ngIf="sOrder.status === 'PROCESSING'"
                (click)="advanceStatus(sOrder, 'READY_TO_SHIP')"
                class="btn btn-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 text-xs flex items-center gap-1"
              >
                <app-icon name="file-text" [size]="14"></app-icon> Generate Label
              </button>

              <button
                *ngIf="sOrder.status === 'READY_TO_SHIP' || sOrder.status === 'PROCESSING'"
                (click)="advanceStatus(sOrder, 'SHIPPED')"
                class="btn btn-sm btn-primary text-xs flex items-center gap-1"
              >
                <app-icon name="truck" [size]="14"></app-icon> Dispatch Shipment
              </button>
            </div>
          </div>

          <!-- Package Items -->
          <div class="space-y-2 text-xs">
            <div *ngFor="let item of sOrder.items" class="flex items-center justify-between gap-4 py-1">
              <div class="flex items-center gap-3">
                <img [src]="item.productImage" class="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                <div>
                  <div class="font-bold text-slate-900 line-clamp-1">{{ item.productName }}</div>
                  <div class="text-slate-500">SKU: {{ item.productSku }} • Qty: {{ item.quantity }}</div>
                </div>
              </div>
              <div class="font-extrabold text-slate-900">{{ formatInr(item.totalPrice) }}</div>
            </div>
          </div>

          <!-- Carrier status banner -->
          <div *ngIf="sOrder.shipment" class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-slate-500">
              Carrier: <strong>{{ sOrder.shipment.carrierName || 'BlueDart Express' }}</strong> • Tracking: <strong class="font-mono text-indigo-600">{{ sOrder.shipment.trackingNumber }}</strong>
            </span>
            <span class="text-slate-500">Estimated Delivery: <strong>{{ sOrder.shipment.estimatedDeliveryAt }}</strong></span>
          </div>
        </div>

        <div *ngIf="activeFulfillmentOrders.length === 0" class="card p-12 bg-white text-center space-y-2">
          <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <app-icon name="check-circle" [size]="24"></app-icon>
          </div>
          <h3 class="font-bold text-slate-900 text-sm">Fulfillment Queue Clear</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">All active orders for your seller store have been packaged and dispatched to carriers.</p>
        </div>

        <!-- Universal Pagination -->
        <app-pagination
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="activeFulfillmentOrders.length"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
})
export class SellerFulfillmentComponent implements OnInit {
  formatInr = formatInr;
  activeFulfillmentOrders: SellerOrder[] = [];
  paginatedOrders: SellerOrder[] = [];
  currentPage = 1;
  pageSize = 10;

  constructor(
    public authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadQueue();
  }

  loadQueue(): void {
    const sellerId = this.authService.currentSellerId();
    this.orderService.getSellerOrders(sellerId).subscribe((res) => {
      this.activeFulfillmentOrders = res.filter(
        (o) => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PROCESSING' || o.status === 'READY_TO_SHIP'
      );
      this.paginate();
    });
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedOrders = this.activeFulfillmentOrders.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.paginate();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.paginate();
  }

  advanceStatus(sOrder: SellerOrder, newStatus: OrderStatus): void {
    this.orderService.updateSellerOrderStatus(sOrder.id, newStatus).subscribe((updated) => {
      if (updated) {
        this.loadQueue();
      }
    });
  }
}
