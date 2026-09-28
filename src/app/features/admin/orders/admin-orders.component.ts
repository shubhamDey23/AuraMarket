import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { SellerService } from '../../../core/services/seller.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { Seller } from '../../../core/models/user.model';
import { OrderStatusBadgeComponent } from '../../../shared/components/order-status-badge.component';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    OrderStatusBadgeComponent,
    AppIconComponent,
    PaginationComponent,
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Platform Orders Supervision</h1>
          <p class="text-xs text-slate-500 mt-1">
            Global view across multi-vendor split sub-orders and customer transactions ({{ orders.length }} total)
          </p>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="card p-4 bg-white space-y-3">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div class="relative flex-1">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="filterOrders()"
              placeholder="Search by Order #, Customer Name, or Email..."
              class="form-input text-xs pl-9"
            />
            <app-icon name="search" [size]="14" class="absolute left-3 top-2.5 text-slate-400"></app-icon>
          </div>

          <div class="flex items-center gap-2 overflow-x-auto text-xs">
            <button
              *ngFor="let tab of statusTabs"
              (click)="statusFilter = tab; filterOrders()"
              class="px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors"
              [ngClass]="statusFilter === tab ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              {{ tab }}
            </button>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="card p-6 bg-white space-y-4 border border-slate-200">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Customer</th>
                <th>Sellers Included</th>
                <th>Items</th>
                <th>Total GMV</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of paginatedOrders">
                <td class="font-bold text-slate-900 text-xs">
                  <a [routerLink]="['/admin/orders', order.id]" class="hover:text-indigo-600">
                    {{ order.orderNumber }}
                  </a>
                </td>
                <td class="text-xs">
                  <div class="font-semibold text-slate-800">{{ order.customerName }}</div>
                  <div class="text-[10px] text-slate-400">{{ order.customerEmail }}</div>
                </td>
                <td>
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let so of order.sellerOrders" class="badge badge-neutral text-[9px]">
                      {{ so.sellerName }}
                    </span>
                  </div>
                </td>
                <td class="text-xs font-semibold text-slate-700">{{ order.items.length }} item(s)</td>
                <td class="font-extrabold text-slate-900 text-xs">{{ formatInr(order.grandTotal) }}</td>
                <td>
                  <span
                    class="badge text-[10px]"
                    [ngClass]="order.paymentStatus === 'PAID' ? 'badge-success' : 'badge-warning'"
                  >
                    {{ order.paymentStatus }} ({{ order.paymentMethod }})
                  </span>
                </td>
                <td><app-order-status-badge [status]="order.status"></app-order-status-badge></td>
                <td class="text-xs text-slate-500 whitespace-nowrap">{{ order.createdAt }}</td>
                <td>
                  <a [routerLink]="['/admin/orders', order.id]" class="btn btn-xs btn-outline">
                    Inspect
                  </a>
                </td>
              </tr>
              <tr *ngIf="filteredOrders.length === 0">
                <td colspan="9" class="text-center py-8 text-slate-400 text-xs">
                  No marketplace orders match your search filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Universal Pagination -->
        <app-pagination
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="filteredOrders.length"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
})
export class AdminOrdersComponent implements OnInit {
  formatInr = formatInr;
  statusTabs = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  paginatedOrders: Order[] = [];
  sellers: Seller[] = [];

  searchQuery = '';
  sellerFilter = 'ALL';
  statusFilter = 'ALL';

  currentPage = 1;
  pageSize = 10;

  constructor(
    private orderService: OrderService,
    private sellerService: SellerService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe((res) => {
      this.orders = res;
      this.filterOrders();
    });

    this.sellerService.getSellers().subscribe((sel) => (this.sellers = sel));
  }

  filterOrders(): void {
    let result = [...this.orders];
    if (this.sellerFilter !== 'ALL') {
      result = result.filter((o) => o.sellerOrders.some((so) => so.sellerId === this.sellerFilter));
    }
    if (this.statusFilter !== 'ALL') {
      result = result.filter((o) => o.status === this.statusFilter);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.items.some((i) => i.productName.toLowerCase().includes(q))
      );
    }
    this.filteredOrders = result;
    this.currentPage = 1; // Auto reset page to 1
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedOrders = this.filteredOrders.slice(start, start + this.pageSize);
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
}
