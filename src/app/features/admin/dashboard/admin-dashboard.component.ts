import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatCardComponent } from '../../../shared/components/stat-card.component';
import { OrderStatusBadgeComponent } from '../../../shared/components/order-status-badge.component';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { OrderService } from '../../../core/services/order.service';
import { SellerService } from '../../../core/services/seller.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ProductService } from '../../../core/services/product.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { ReturnService } from '../../../core/services/return.service';
import { Order } from '../../../core/models/order.model';
import { Seller } from '../../../core/models/user.model';
import { Product } from '../../../core/models/product.model';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StatCardComponent,
    OrderStatusBadgeComponent,
    AppIconComponent,
  ],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Platform Operations Dashboard</h1>
          <p class="text-xs text-slate-500 mt-1">Real-time marketplace performance, revenue metrics & governance overview</p>
        </div>
        <div class="flex items-center gap-2">
          <a routerLink="/admin/sellers" class="btn btn-sm btn-outline flex items-center gap-1">
            <app-icon name="store" [size]="14"></app-icon> Seller Approval Queue
          </a>
          <a routerLink="/admin/reports" class="btn btn-sm btn-primary flex items-center gap-1">
            <app-icon name="trending-up" [size]="14"></app-icon> View Analytics
          </a>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-stat-card
          title="Total Marketplace GMV"
          [value]="formatInr(totalGMV)"
          change="+22.4%"
          [isPositive]="true"
          icon="indian-rupee"
          iconBgClass="bg-emerald-50 text-emerald-600"
        ></app-stat-card>

        <app-stat-card
          title="Total Marketplace Orders"
          [value]="totalOrdersCount"
          change="+14.1%"
          [isPositive]="true"
          icon="truck"
          iconBgClass="bg-indigo-50 text-indigo-600"
        ></app-stat-card>

        <app-stat-card
          title="Active Sellers"
          [value]="activeSellersCount"
          icon="store"
          iconBgClass="bg-sky-50 text-sky-600"
        ></app-stat-card>

        <app-stat-card
          title="Total Customers"
          [value]="totalCustomersCount"
          change="+9.2%"
          [isPositive]="true"
          icon="users"
          iconBgClass="bg-purple-50 text-purple-600"
        ></app-stat-card>
      </div>

      <!-- Sales Performance Chart Section -->
      <div class="card bg-white p-6 space-y-6 border border-slate-200">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 class="font-bold text-slate-900 text-base flex items-center gap-2">
              <app-icon name="trending-up" [size]="18" customClass="text-indigo-600"></app-icon> Marketplace GMV Growth
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">Platform-wide revenue stream analytics</p>
          </div>

          <div class="flex items-center gap-2">
            <div class="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                *ngFor="let range of ['7d', '30d', '3m', '1y']"
                (click)="timeRange = range"
                class="px-2.5 py-1 rounded-md transition-all uppercase"
                [ngClass]="timeRange === range ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'"
              >
                {{ range }}
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-end justify-between gap-2 h-44 pt-6 px-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div *ngFor="let bar of chartBars" class="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
              <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-mono pointer-events-none whitespace-nowrap z-20">
                {{ formatInr(bar.value) }} ({{ bar.label }})
              </div>
              <div
                class="w-full max-w-[36px] bg-indigo-600 rounded-t-lg transition-all group-hover:bg-indigo-500"
                [style.height.%]="bar.heightPercent"
              ></div>
              <span class="text-[10px] font-semibold text-slate-500 uppercase">{{ bar.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Sellers & Top Products Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Top Sellers -->
        <div class="card bg-white p-6 space-y-4 border border-slate-200">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 class="font-bold text-slate-900 text-base flex items-center gap-2">
              <app-icon name="store" [size]="18" customClass="text-emerald-600"></app-icon> Top Performing Sellers
            </h2>
            <a routerLink="/admin/sellers" class="text-xs text-indigo-600 hover:underline font-semibold">View All Sellers</a>
          </div>

          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Store</th>
                  <th>Revenue</th>
                  <th>Orders</th>
                  <th>Rating</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let seller of topSellers.slice(0, 5)">
                  <td>
                    <div class="flex items-center gap-2.5">
                      <img [src]="seller.logoUrl" class="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" />
                      <div>
                        <div class="font-bold text-slate-900 text-xs line-clamp-1">{{ seller.storeName }}</div>
                        <div class="text-[10px] text-slate-400">{{ seller.ownerName }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="font-extrabold text-slate-900 text-xs">{{ formatInr(seller.metrics.totalRevenue) }}</td>
                  <td class="text-xs font-semibold text-slate-800">{{ seller.metrics.totalOrders }}</td>
                  <td class="font-bold text-xs text-amber-500">★ {{ seller.rating }}</td>
                  <td>
                    <a [routerLink]="['/admin/sellers', seller.id]" class="text-xs text-indigo-600 hover:underline font-bold">View</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top Products -->
        <div class="card bg-white p-6 space-y-4 border border-slate-200">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 class="font-bold text-slate-900 text-base flex items-center gap-2">
              <app-icon name="package" [size]="18" customClass="text-indigo-600"></app-icon> Top Selling Products
            </h2>
            <a routerLink="/admin/products" class="text-xs text-indigo-600 hover:underline font-semibold">View All Products</a>
          </div>

          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Seller</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let prod of topProducts.slice(0, 5)">
                  <td>
                    <div class="flex items-center gap-2.5">
                      <img [src]="prod.featuredImage" class="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" />
                      <div class="font-bold text-slate-900 text-xs line-clamp-1">{{ prod.name }}</div>
                    </div>
                  </td>
                  <td class="text-xs text-slate-600 font-medium">{{ prod.sellerName }}</td>
                  <td class="font-bold text-slate-900 text-xs">{{ formatInr(prod.price) }}</td>
                  <td class="font-semibold text-xs text-slate-800">{{ prod.stockQuantity }} units</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Recent Marketplace Orders -->
      <div class="card bg-white p-6 space-y-4 border border-slate-200">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <app-icon name="truck" [size]="18" customClass="text-indigo-600"></app-icon> Recent Marketplace Orders
          </h2>
          <a routerLink="/admin/orders" class="text-xs text-indigo-600 hover:underline font-semibold">View All Orders</a>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Sellers Included</th>
                <th>Items</th>
                <th>Total GMV</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of recentOrders.slice(0, 5)">
                <td class="font-bold text-slate-900 text-xs">{{ order.orderNumber }}</td>
                <td class="text-xs font-semibold text-slate-800">{{ order.customerName }}</td>
                <td>
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let so of order.sellerOrders" class="badge badge-neutral text-[9px]">{{ so.sellerName }}</span>
                  </div>
                </td>
                <td class="text-xs font-semibold text-slate-700">{{ order.items.length }} item(s)</td>
                <td class="font-extrabold text-slate-900 text-xs">{{ formatInr(order.grandTotal) }}</td>
                <td><app-order-status-badge [status]="order.status"></app-order-status-badge></td>
                <td class="text-xs text-slate-500">{{ order.createdAt }}</td>
                <td>
                  <a [routerLink]="['/admin/orders', order.id]" class="text-xs text-indigo-600 hover:underline font-bold">Inspect</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  formatInr = formatInr;
  totalGMV = 0;
  totalOrdersCount = 0;
  activeSellersCount = 0;
  totalCustomersCount = 0;

  topSellers: Seller[] = [];
  topProducts: Product[] = [];
  recentOrders: Order[] = [];

  timeRange = '7d';

  chartBars = [
    { label: 'Mon', value: 84000, heightPercent: 50 },
    { label: 'Tue', value: 112000, heightPercent: 68 },
    { label: 'Wed', value: 154000, heightPercent: 90 },
    { label: 'Thu', value: 121000, heightPercent: 75 },
    { label: 'Fri', value: 182000, heightPercent: 100 },
    { label: 'Sat', value: 143000, heightPercent: 82 },
    { label: 'Sun', value: 98000, heightPercent: 58 },
  ];

  constructor(
    private orderService: OrderService,
    private sellerService: SellerService,
    private customerService: CustomerService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.orderService.getOrders().subscribe((orders) => {
      this.recentOrders = orders;
      this.totalOrdersCount = orders.length;
      this.totalGMV = orders.reduce((sum, o) => sum + o.grandTotal, 0);
    });

    this.sellerService.getSellers().subscribe((sellers) => {
      this.topSellers = [...sellers].sort((a, b) => b.metrics.totalRevenue - a.metrics.totalRevenue);
      this.activeSellersCount = sellers.filter((s) => s.status === 'APPROVED' || s.status === 'ACTIVE').length;
    });

    this.customerService.getCustomers().subscribe((custs) => {
      this.totalCustomersCount = custs.length;
    });

    this.productService.getProducts().subscribe((prods) => {
      this.topProducts = prods;
    });
  }
}
