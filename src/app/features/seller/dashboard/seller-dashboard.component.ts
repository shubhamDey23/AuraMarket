import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { ProductService } from '../../../core/services/product.service';
import { StatCardComponent } from '../../../shared/components/stat-card.component';
import { OrderStatusBadgeComponent } from '../../../shared/components/order-status-badge.component';
import { InventoryStatusBadgeComponent } from '../../../shared/components/inventory-status-badge.component';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { SellerOrder } from '../../../core/models/order.model';
import { InventoryItem } from '../../../core/models/inventory.model';
import { Product } from '../../../core/models/product.model';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StatCardComponent,
    OrderStatusBadgeComponent,
    InventoryStatusBadgeComponent,
    AppIconComponent,
  ],
  template: `
    <div class="space-y-8 pb-16">
      <!-- Welcome Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#DDE7DF] shadow-xs">
        <div>
          <span class="text-xs font-extrabold text-[#2F6B4F] uppercase tracking-wider">Ayurveda Seller Portal</span>
          <h1 class="text-2xl font-extrabold text-[#1F2933] tracking-tight">
            Welcome back, {{ authService.currentSeller().ownerName }}
          </h1>
          <p class="text-xs text-[#64748B] mt-1">
            Store Performance & Regulatory Compliance Overview for <strong>{{ authService.currentSeller().storeName }}</strong>
          </p>
        </div>
        <div class="flex items-center gap-3">
          <a routerLink="/seller/products/new" class="btn btn-sm bg-[#2F6B4F] hover:bg-[#24543D] text-white font-bold rounded-xl px-5 flex items-center gap-1.5 shadow-md">
            <app-icon name="plus" [size]="16"></app-icon> Add New Product
          </a>
        </div>
      </div>

      <!-- Seller KPI Grid (8 Required Ayurvedic Seller Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-stat-card
          title="Total Store Revenue"
          [value]="formatInr(computedRevenue)"
          change="+14.2%"
          [isPositive]="true"
          icon="indian-rupee"
          iconBgClass="bg-[#EAF4EC] text-[#2F6B4F]"
        ></app-stat-card>

        <app-stat-card
          title="Total Orders"
          [value]="computedOrderCount"
          change="+8.5%"
          [isPositive]="true"
          icon="truck"
          iconBgClass="bg-[#EAF4EC] text-[#2F6B4F]"
        ></app-stat-card>

        <app-stat-card
          title="Total Products"
          [value]="totalProductCount"
          icon="package"
          iconBgClass="bg-[#F8FAF7] text-[#1F2933]"
        ></app-stat-card>

        <app-stat-card
          title="Active Approved Listings"
          [value]="activeProductCount"
          icon="check-circle"
          iconBgClass="bg-[#EAF4EC] text-[#2E7D32]"
        ></app-stat-card>

        <app-stat-card
          title="Pending AYUSH Approval"
          [value]="pendingApprovalCount"
          icon="clock"
          iconBgClass="bg-[#FFFDF5] text-[#B7791F]"
        ></app-stat-card>

        <app-stat-card
          title="Pending Fulfillment"
          [value]="pendingFulfillmentCount"
          icon="package"
          iconBgClass="bg-[#EAF4EC] text-[#2F6B4F]"
        ></app-stat-card>

        <app-stat-card
          title="Low Stock Items"
          [value]="lowStockCount"
          [isPositive]="false"
          icon="layers"
          iconBgClass="bg-red-50 text-red-600"
        ></app-stat-card>

        <app-stat-card
          title="Return Requests"
          [value]="returnsCount"
          icon="refresh-cw"
          iconBgClass="bg-gray-100 text-gray-700"
        ></app-stat-card>
      </div>

      <!-- Interactive Sales Overview Chart Widget -->
      <div class="card bg-white p-6 sm:p-8 space-y-6 border border-[#DDE7DF] rounded-3xl shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE7DF] pb-4">
          <div>
            <h2 class="font-extrabold text-[#1F2933] text-base flex items-center gap-2">
              <app-icon name="trending-up" [size]="18" customClass="text-[#2F6B4F]"></app-icon> Sales Performance Overview
            </h2>
            <p class="text-xs text-[#64748B] mt-0.5">Isolated seller revenue for {{ authService.currentSeller().storeName }}</p>
          </div>

          <div class="flex items-center gap-2">
            <div class="flex items-center bg-[#F8FAF7] p-1 rounded-xl border border-[#DDE7DF] text-xs font-semibold">
              <button
                *ngFor="let range of ['7d', '30d', '3m']"
                (click)="timeRange = range"
                class="px-3 py-1 rounded-lg transition-all uppercase font-bold"
                [ngClass]="timeRange === range ? 'bg-white text-[#2F6B4F] shadow-xs' : 'text-[#64748B] hover:text-[#1F2933]'"
              >
                {{ range }}
              </button>
            </div>
          </div>
        </div>

        <!-- Bar Chart Representation -->
        <div class="space-y-4">
          <div class="flex items-end justify-between gap-2 h-44 pt-6 px-4 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF]">
            <div *ngFor="let bar of chartBars" class="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
              <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#1F2933] text-white text-[10px] py-1 px-2 rounded font-mono pointer-events-none whitespace-nowrap z-20">
                {{ formatInr(bar.value) }} ({{ bar.label }})
              </div>
              <div
                class="w-full max-w-[36px] bg-[#2F6B4F] rounded-t-lg transition-all group-hover:bg-[#24543D]"
                [style.height.%]="bar.heightPercent"
              ></div>
              <span class="text-[10px] font-bold text-[#64748B] uppercase">{{ bar.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders & Inventory Alerts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent Seller Orders -->
        <div class="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#DDE7DF] space-y-4 shadow-xs">
          <div class="flex items-center justify-between border-b border-[#DDE7DF] pb-3">
            <h2 class="font-extrabold text-[#1F2933] text-base flex items-center gap-2">
              <app-icon name="truck" [size]="18" customClass="text-[#2F6B4F]"></app-icon> Recent Seller Orders
            </h2>
            <a routerLink="/seller/orders" class="text-xs text-[#2F6B4F] hover:underline font-bold">View All Orders →</a>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-[#F8FAF7] border-b border-[#DDE7DF] text-[#1F2933] font-bold">
                <tr>
                  <th class="p-3">Order Ref</th>
                  <th class="p-3">Items</th>
                  <th class="p-3">Total</th>
                  <th class="p-3">Status</th>
                  <th class="p-3">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#DDE7DF] text-[#64748B]">
                <tr *ngFor="let order of recentOrders.slice(0, 5)">
                  <td class="p-3 font-mono font-bold text-[#1F2933]">{{ order.id }}</td>
                  <td class="p-3">{{ order.items.length }} item(s)</td>
                  <td class="p-3 font-extrabold text-[#1F2933]">{{ formatInr(order.total) }}</td>
                  <td class="p-3"><app-order-status-badge [status]="order.status"></app-order-status-badge></td>
                  <td class="p-3">
                    <a [routerLink]="['/seller/orders', order.id]" class="text-xs text-[#2F6B4F] hover:underline font-bold">
                      Inspect
                    </a>
                  </td>
                </tr>
                <tr *ngIf="recentOrders.length === 0">
                  <td colspan="5" class="text-center py-6 text-[#64748B] text-xs">No recent seller orders.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Low Stock Alerts Card -->
        <div class="bg-white p-6 rounded-3xl border border-[#DDE7DF] space-y-4 shadow-xs">
          <div class="flex items-center justify-between border-b border-[#DDE7DF] pb-3">
            <h2 class="font-extrabold text-[#1F2933] text-base flex items-center gap-2">
              <app-icon name="layers" [size]="18" customClass="text-[#B7791F]"></app-icon> Low Stock Alerts
            </h2>
            <a routerLink="/seller/inventory" class="text-xs text-[#2F6B4F] hover:underline font-bold">Manage Stock →</a>
          </div>

          <div class="space-y-3">
            <div *ngFor="let item of inventoryAlerts.slice(0, 4)" class="p-3 bg-[#FFFDF5] rounded-2xl border border-[#F5EFE2] flex items-center justify-between gap-3 text-xs">
              <div>
                <div class="font-bold text-[#1F2933] line-clamp-1">{{ item.productName }}</div>
                <div class="text-[#64748B] font-mono text-[11px]">SKU: {{ item.sku }}</div>
              </div>
              <div class="text-right">
                <div class="font-extrabold text-[#C62828] text-xs">{{ item.availableQuantity }} left</div>
                <app-inventory-status-badge [status]="item.status"></app-inventory-status-badge>
              </div>
            </div>

            <div *ngIf="inventoryAlerts.length === 0" class="text-center py-6 text-[#2E7D32] text-xs font-semibold">
              ✓ All products are sufficiently stocked.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SellerDashboardComponent implements OnInit {
  formatInr = formatInr;
  recentOrders: SellerOrder[] = [];
  inventoryAlerts: InventoryItem[] = [];
  computedRevenue = 0;
  computedOrderCount = 0;
  totalProductCount = 0;
  activeProductCount = 0;
  pendingApprovalCount = 0;
  pendingFulfillmentCount = 0;
  lowStockCount = 0;
  returnsCount = 1;
  timeRange = '7d';

  chartBars = [
    { label: 'Mon', value: 12499, heightPercent: 45 },
    { label: 'Tue', value: 18500, heightPercent: 65 },
    { label: 'Wed', value: 24000, heightPercent: 85 },
    { label: 'Thu', value: 16000, heightPercent: 55 },
    { label: 'Fri', value: 29000, heightPercent: 95 },
    { label: 'Sat', value: 21000, heightPercent: 72 },
    { label: 'Sun', value: 14000, heightPercent: 50 },
  ];

  constructor(
    public authService: AuthService,
    private orderService: OrderService,
    private inventoryService: InventoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadSellerData();
  }

  loadSellerData(): void {
    const sellerId = this.authService.currentSellerId();

    // Enforce Seller Ownership filtering for orders
    this.orderService.getSellerOrders(sellerId).subscribe((orders) => {
      this.recentOrders = orders;
      this.computedOrderCount = orders.length;
      this.computedRevenue = orders.reduce((sum, o) => sum + o.total, 0);
      this.pendingFulfillmentCount = orders.filter((o) => o.status === 'PROCESSING' || o.status === 'PENDING').length;
    });

    // Enforce Seller Ownership filtering for products
    this.productService.getSellerProducts(sellerId).subscribe((prods) => {
      this.totalProductCount = prods.length;
      this.activeProductCount = prods.filter((p) => p.status === 'ACTIVE' || p.status === 'APPROVED').length;
      this.pendingApprovalCount = prods.filter((p) => p.status === 'PENDING_REVIEW' || p.status === 'DRAFT').length;
    });

    // Enforce Seller Ownership filtering for inventory
    this.inventoryService.getInventory({ sellerId }).subscribe((inv) => {
      this.inventoryAlerts = inv.filter((i) => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK');
      this.lowStockCount = this.inventoryAlerts.length;
    });
  }
}
