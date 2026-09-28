import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { SellerOrder, OrderStatus } from '../../../core/models/order.model';
import { OrderStatusBadgeComponent } from '../../../shared/components/order-status-badge.component';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-seller-orders',
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
          <h1 class="text-2xl font-bold text-slate-900">Seller Store Orders</h1>
          <p class="text-xs text-slate-500 mt-1">
            Manage customer orders containing items from your seller store catalog
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
              placeholder="Search by Order ID or Product Name..."
              class="form-input text-xs pl-9"
            />
            <app-icon name="search" [size]="14" class="absolute left-3 top-2.5 text-slate-400"></app-icon>
          </div>

          <div class="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs">
            <button
              *ngFor="let tab of statusTabs"
              (click)="selectTab(tab.key)"
              class="px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors"
              [ngClass]="activeTab === tab.key ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div class="space-y-4">
        <div *ngFor="let sOrder of paginatedOrders" class="card p-5 bg-white space-y-4 border border-slate-200">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div class="space-y-0.5">
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-slate-900 text-sm">Parent Order #{{ sOrder.orderId }}</span>
                <span class="text-xs text-slate-400">•</span>
                <span class="text-xs text-slate-500">Seller Sub-Order</span>
              </div>
              <div class="text-[11px] text-slate-400"> Placed on {{ sOrder.createdAt }} </div>
            </div>

            <div class="flex items-center gap-3">
              <app-order-status-badge [status]="sOrder.status"></app-order-status-badge>
              <a [routerLink]="['/seller/orders', sOrder.id]" class="btn btn-xs btn-outline"> View Details </a>
            </div>
          </div>

          <!-- Items list preview -->
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

          <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div class="text-slate-500">
              Shipment Tracking: <strong class="text-slate-800 font-mono">{{ sOrder.shipment?.trackingNumber || 'Pending Label' }}</strong>
            </div>
            <div class="font-extrabold text-slate-900 text-sm">
              Seller Portion Total: <span class="text-indigo-600">{{ formatInr(sOrder.total) }}</span>
            </div>
          </div>
        </div>

        <div *ngIf="filteredOrders.length === 0" class="card p-8 bg-white text-center text-slate-400 text-xs">
          No seller orders found matching your filter criteria.
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
export class SellerOrdersComponent implements OnInit {
  formatInr = formatInr;
  orders: SellerOrder[] = [];
  filteredOrders: SellerOrder[] = [];
  paginatedOrders: SellerOrder[] = [];
  searchQuery = '';
  activeTab = 'ALL';
  currentPage = 1;
  pageSize = 10;

  statusTabs = [
    { key: 'ALL', label: 'All Orders' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'DELIVERED', label: 'Delivered' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  constructor(
    public authService: AuthService,
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const sellerId = this.authService.currentSellerId();
    this.orderService.getSellerOrders(sellerId).subscribe((res) => {
      this.orders = res;
      this.filterOrders();
    });
  }

  selectTab(tabKey: string): void {
    this.activeTab = tabKey;
    this.currentPage = 1; // Auto reset page to 1
    this.filterOrders();
  }

  filterOrders(): void {
    let result = [...this.orders];
    if (this.activeTab !== 'ALL') {
      result = result.filter((o) => o.status === this.activeTab);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.orderId.toLowerCase().includes(q) ||
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

  advanceStatus(sOrder: SellerOrder, newStatus: OrderStatus): void {
    this.orderService.updateSellerOrderStatus(sOrder.id, newStatus).subscribe((updated) => {
      if (updated) {
        this.loadOrders();
      }
    });
  }
}
