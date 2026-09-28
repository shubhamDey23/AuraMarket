import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService, OrderFilterParams } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { OrderStatusBadgeComponent } from '../../../shared/components/order-status-badge.component';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    OrderStatusBadgeComponent,
    AppIconComponent,
    EmptyStateComponent,
    PaginationComponent,
  ],
  template: `
    <div class="container space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">My Orders & Purchases</h1>
          <p class="text-xs text-slate-500 mt-1">Track marketplace shipments and view order history</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Filter Tabs -->
          <div class="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button (click)="filterStatus(undefined)" class="px-3 py-1.5 rounded-lg" [ngClass]="!filters.status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'">All</button>
            <button (click)="filterStatus('PROCESSING')" class="px-3 py-1.5 rounded-lg" [ngClass]="filters.status === 'PROCESSING' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'">Processing</button>
            <button (click)="filterStatus('SHIPPED')" class="px-3 py-1.5 rounded-lg" [ngClass]="filters.status === 'SHIPPED' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'">Shipped</button>
            <button (click)="filterStatus('DELIVERED')" class="px-3 py-1.5 rounded-lg" [ngClass]="filters.status === 'DELIVERED' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'">Delivered</button>
            <button (click)="filterStatus('CANCELLED')" class="px-3 py-1.5 rounded-lg" [ngClass]="filters.status === 'CANCELLED' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'">Cancelled</button>
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div *ngIf="orders.length > 0; else noOrders" class="space-y-4">
        <div *ngFor="let order of paginatedOrders" class="card p-5 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="font-extrabold text-slate-900 text-sm font-mono">{{ order.orderNumber }}</span>
              <app-order-status-badge [status]="order.status"></app-order-status-badge>
              <span class="text-xs text-slate-400">Placed on {{ order.createdAt }}</span>
            </div>
            <div class="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
              <span>Items: <strong>{{ order.items.length }}</strong></span>
              <span>Multi-Seller Fulfillments: <strong>{{ order.sellerOrders.length }} seller(s)</strong></span>
              <span>Total Amount: <strong class="text-indigo-600 font-extrabold">{{ formatInr(order.grandTotal) }}</strong></span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <a [routerLink]="['/orders', order.id]" class="btn btn-sm btn-primary flex items-center gap-1 text-xs">
              <app-icon name="eye" [size]="14"></app-icon> Track & Details
            </a>
          </div>
        </div>

        <app-pagination
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="orders.length"
          (pageChange)="currentPage = $event"
          (pageSizeChange)="pageSize = $event; currentPage = 1"
        ></app-pagination>
      </div>

      <ng-template #noOrders>
        <app-empty-state
          icon="truck"
          title="No orders found"
          description="You have not placed any orders matching your selected status filter."
          actionLabel="Start Shopping"
          (action)="navigateToProducts()"
        ></app-empty-state>
      </ng-template>
    </div>
  `,
})
export class OrdersListComponent implements OnInit {
  formatInr = formatInr;
  orders: Order[] = [];
  filters: OrderFilterParams = {};

  currentPage = 1;
  pageSize = 10;

  get paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.orders.slice(start, start + this.pageSize);
  }

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.filters.customerId = this.authService.currentCustomerId();
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.currentPage = 1;
    this.orderService.getOrders(this.filters).subscribe((res) => {
      this.orders = res;
    });
  }

  filterStatus(status?: OrderStatus): void {
    this.filters.status = status;
    this.fetchOrders();
  }

  navigateToProducts(): void {
    // Navigate to products catalog
    window.location.href = '/products';
  }
}

