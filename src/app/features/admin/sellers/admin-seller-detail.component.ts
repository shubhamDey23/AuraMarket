import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SellerService } from '../../../core/services/seller.service';
import { ProductService } from '../../../core/services/product.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { OrderService } from '../../../core/services/order.service';
import { ReturnService } from '../../../core/services/return.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { Seller } from '../../../core/models/user.model';
import { Product } from '../../../core/models/product.model';
import { InventoryItem } from '../../../core/models/inventory.model';
import { SellerOrder } from '../../../core/models/order.model';
import { ReturnRequest } from '../../../core/services/return.service';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { OrderStatusBadgeComponent } from '../../../shared/components/order-status-badge.component';
import { InventoryStatusBadgeComponent } from '../../../shared/components/inventory-status-badge.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-admin-seller-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppIconComponent,
    OrderStatusBadgeComponent,
    InventoryStatusBadgeComponent,
  ],
  template: `
    <div class="container space-y-6 max-w-5xl">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/admin/dashboard" class="hover:text-indigo-600">Admin</a> /
        <a routerLink="/admin/sellers" class="hover:text-indigo-600">Seller Governance</a> /
        <span class="text-slate-800 font-medium">Seller Profile & Audit</span>
      </nav>

      <div *ngIf="seller" class="space-y-6">
        <!-- Top Profile Banner -->
        <div class="card p-6 bg-white border border-slate-200 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div class="flex items-center gap-4">
              <img [src]="seller.logoUrl" class="w-16 h-16 rounded-2xl object-cover bg-slate-100 border border-slate-200 shadow-xs" />
              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-2xl font-bold text-slate-900">{{ seller.storeName }}</h1>
                  <span
                    class="badge text-[10px]"
                    [ngClass]="{
                      'badge-success': seller.status === 'APPROVED' || seller.status === 'ACTIVE',
                      'badge-warning': seller.status === 'PENDING' || seller.status === 'PENDING_APPROVAL',
                      'bg-red-50 text-red-700 border-red-200': seller.status === 'SUSPENDED' || seller.status === 'REJECTED'
                    }"
                  >
                    {{ seller.status }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 mt-1">
                  Owner: <strong>{{ seller.ownerName }}</strong> • Email: {{ seller.email }} • Joined: {{ seller.joinedDate }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                *ngIf="seller.status === 'PENDING' || seller.status === 'PENDING_APPROVAL'"
                (click)="updateStatus('APPROVED')"
                class="btn btn-sm btn-primary"
              >
                Approve Seller Store
              </button>
              <button
                *ngIf="seller.status === 'APPROVED' || seller.status === 'ACTIVE'"
                (click)="updateStatus('SUSPENDED')"
                class="btn btn-sm bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold"
              >
                Suspend Account
              </button>
              <button
                *ngIf="seller.status === 'SUSPENDED'"
                (click)="updateStatus('APPROVED')"
                class="btn btn-sm btn-outline text-xs"
              >
                Re-Activate Store
              </button>
            </div>
          </div>

          <!-- Overview Stats Bar -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs">
            <div>
              <div class="text-slate-500 text-[11px]">Total GMV Revenue</div>
              <div class="text-lg font-extrabold text-slate-900 mt-0.5">{{ formatInr(seller.metrics.totalRevenue) }}</div>
            </div>
            <div>
              <div class="text-slate-500 text-[11px]">Orders Processed</div>
              <div class="text-lg font-extrabold text-indigo-600 mt-0.5">{{ seller.metrics.totalOrders }}</div>
            </div>
            <div>
              <div class="text-slate-500 text-[11px]">Store Rating</div>
              <div class="text-lg font-extrabold text-amber-500 mt-0.5">★ {{ seller.rating }}</div>
            </div>
            <div>
              <div class="text-slate-500 text-[11px]">Fulfillment Rate</div>
              <div class="text-lg font-extrabold text-emerald-600 mt-0.5">{{ seller.metrics.fulfillmentRate }}%</div>
            </div>
          </div>
        </div>

        <!-- Tabbed Content Section -->
        <div class="card bg-white border border-slate-200 overflow-hidden">
          <div class="flex items-center border-b border-slate-200 overflow-x-auto text-xs font-semibold px-4 pt-2">
            <button
              *ngFor="let tab of tabs"
              (click)="activeTab = tab.key"
              class="px-4 py-3 border-b-2 transition-all whitespace-nowrap"
              [ngClass]="activeTab === tab.key ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="p-6">
            <!-- TAB 1: Overview -->
            <div *ngIf="activeTab === 'overview'" class="space-y-4 text-xs">
              <h3 class="font-bold text-slate-900 text-sm">Store Information & Hubs</h3>
              <p class="text-slate-600 leading-relaxed">{{ seller.description }}</p>
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div class="font-bold text-slate-900">Primary Fulfillment Hub</div>
                <div *ngFor="let loc of seller.locations">
                  <p class="text-slate-700 font-medium">{{ loc.name }}</p>
                  <p class="text-slate-500">{{ loc.addressLine1 }}, {{ loc.city }}, {{ loc.state }} {{ loc.postalCode }}</p>
                </div>
              </div>
            </div>

            <!-- TAB 2: Products -->
            <div *ngIf="activeTab === 'products'" class="space-y-4">
              <h3 class="font-bold text-slate-900 text-xs">Products Owned by {{ seller.storeName }} ({{ products.length }})</h3>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let prod of products">
                      <td>
                        <div class="flex items-center gap-2.5">
                          <img [src]="prod.featuredImage" class="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0" />
                          <div class="font-bold text-slate-900 text-xs">{{ prod.name }}</div>
                        </div>
                      </td>
                      <td class="font-mono text-xs text-slate-600">{{ prod.sku }}</td>
                      <td class="font-bold text-xs text-slate-900">{{ formatInr(prod.price) }}</td>
                      <td class="text-xs font-semibold text-slate-800">{{ prod.stockQuantity }} units</td>
                      <td><span class="badge badge-success text-[10px]">{{ prod.status }}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- TAB 3: Inventory -->
            <div *ngIf="activeTab === 'inventory'" class="space-y-4">
              <h3 class="font-bold text-slate-900 text-xs">Warehouse Inventory Matrix ({{ inventoryItems.length }})</h3>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Product SKU</th>
                      <th>Available</th>
                      <th>Reserved</th>
                      <th>Damaged</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of inventoryItems">
                      <td class="font-bold text-slate-900 text-xs">{{ item.productName }} <span class="font-mono text-slate-400">({{ item.sku }})</span></td>
                      <td class="font-bold text-slate-900 text-xs">{{ item.availableQuantity }}</td>
                      <td class="text-xs font-semibold text-indigo-600">{{ item.reservedQuantity }}</td>
                      <td class="text-xs font-semibold text-red-500">{{ item.damagedQuantity }}</td>
                      <td><app-inventory-status-badge [status]="item.status"></app-inventory-status-badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- TAB 4: Orders -->
            <div *ngIf="activeTab === 'orders'" class="space-y-4">
              <h3 class="font-bold text-slate-900 text-xs">Seller Fulfillment Queue ({{ sellerOrders.length }})</h3>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Ref ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let so of sellerOrders">
                      <td class="font-bold text-slate-900 text-xs">{{ so.id }}</td>
                      <td class="text-xs text-slate-500">{{ so.createdAt }}</td>
                      <td class="text-xs">{{ so.items.length }} item(s)</td>
                      <td class="font-extrabold text-xs text-slate-900">{{ formatInr(so.total) }}</td>
                      <td><app-order-status-badge [status]="so.status"></app-order-status-badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- TAB 5: Returns -->
            <div *ngIf="activeTab === 'returns'" class="space-y-4">
              <h3 class="font-bold text-slate-900 text-xs">Customer Returns Requested ({{ returns.length }})</h3>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Return Ref</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Reason</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let ret of returns">
                      <td class="font-bold text-slate-900 text-xs">{{ ret.returnNumber }}</td>
                      <td class="text-xs text-slate-700">{{ ret.customerName }}</td>
                      <td class="text-xs font-medium text-slate-900">{{ ret.productName }}</td>
                      <td class="text-xs text-slate-500">{{ ret.reason }}</td>
                      <td class="font-bold text-xs text-slate-900">{{ formatInr(ret.refundAmount) }}</td>
                      <td><span class="badge badge-warning text-[10px]">{{ ret.status }}</span></td>
                    </tr>
                    <tr *ngIf="returns.length === 0">
                      <td colspan="6" class="text-center py-6 text-slate-400 text-xs">No returns requested for this seller.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminSellerDetailComponent implements OnInit {
  formatInr = formatInr;
  sellerId: string | null = null;
  seller: Seller | null = null;
  products: Product[] = [];
  inventoryItems: InventoryItem[] = [];
  sellerOrders: SellerOrder[] = [];
  returns: ReturnRequest[] = [];
  activeTab = 'overview';

  tabs = [
    { key: 'overview', label: 'Store Overview' },
    { key: 'products', label: 'Products Catalog' },
    { key: 'inventory', label: 'Inventory Matrix' },
    { key: 'orders', label: 'Order Fulfillment' },
    { key: 'returns', label: 'Returns & Refunds' },
  ];

  constructor(
    private route: ActivatedRoute,
    private sellerService: SellerService,
    private productService: ProductService,
    private inventoryService: InventoryService,
    private orderService: OrderService,
    private returnService: ReturnService,
    private toastService: ToastService,
    private activityLogService: ActivityLogService
  ) {}

  ngOnInit(): void {
    this.sellerId = this.route.snapshot.paramMap.get('id');
    if (this.sellerId) {
      this.loadSellerData(this.sellerId);
    }
  }

  loadSellerData(id: string): void {
    this.sellerService.getSellerById(id).subscribe((s) => {
      if (s) {
        this.seller = s;
      }
    });

    this.productService.getSellerProducts(id).subscribe((p) => (this.products = p));
    this.inventoryService.getInventory({ sellerId: id }).subscribe((i) => (this.inventoryItems = i));
    this.orderService.getSellerOrders(id).subscribe((o) => (this.sellerOrders = o));
    this.returnService.getReturns(id).subscribe((r) => (this.returns = r));
  }

  updateStatus(newStatus: any): void {
    if (!this.seller) return;
    this.sellerService.updateSellerStatus(this.seller.id, newStatus).subscribe((updated) => {
      if (updated) {
        this.seller = updated;
        this.toastService.success(`Seller status updated to ${newStatus}.`);
        this.activityLogService.logActivity(
          `SELLER_${newStatus}`,
          'SELLER',
          this.seller.id,
          `Changed seller status to ${newStatus}.`
        );
      }
    });
  }
}
