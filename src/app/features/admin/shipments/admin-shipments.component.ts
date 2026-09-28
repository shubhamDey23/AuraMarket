import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { SellerOrder } from '../../../core/models/order.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';

@Component({
  selector: 'app-admin-shipments',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent, PaginationComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Platform Shipments & Logistics</h1>
          <p class="text-xs text-slate-500 mt-1">Monitor multi-seller carrier dispatches, tracking numbers, and delivery ETAs across the marketplace ({{ sellerOrders.length }} total shipments)</p>
        </div>
      </div>

      <!-- Shipments Table -->
      <div class="card bg-white p-6 space-y-4 border border-slate-200">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Shipment / Tracking ID</th>
                <th>Parent Order</th>
                <th>Fulfilling Seller</th>
                <th>Carrier Partner</th>
                <th>Status</th>
                <th>Estimated Delivery</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let sOrder of paginatedShipments">
                <td>
                  <div>
                    <div class="font-mono font-bold text-indigo-700 text-xs">{{ sOrder.shipment?.trackingNumber || 'PENDING_LABEL' }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ sOrder.shipment?.id || sOrder.id }}</div>
                  </div>
                </td>
                <td class="font-bold text-slate-900 text-xs">
                  <a [routerLink]="['/admin/orders', sOrder.orderId]" class="hover:text-indigo-600">
                    {{ sOrder.orderId }}
                  </a>
                </td>
                <td class="text-xs font-semibold text-slate-800">{{ sOrder.sellerName }}</td>
                <td class="text-xs text-slate-600">{{ sOrder.shipment?.carrierName || 'FedEx Express' }}</td>
                <td>
                  <span class="badge badge-primary text-[10px]">
                    {{ sOrder.shipment?.status || 'IN_TRANSIT' }}
                  </span>
                </td>
                <td class="text-xs text-slate-500">{{ sOrder.shipment?.estimatedDeliveryAt || '2026-09-09' }}</td>
                <td>
                  <a [routerLink]="['/admin/orders', sOrder.orderId]" class="btn btn-xs btn-outline">
                    Inspect Order
                  </a>
                </td>
              </tr>
              <tr *ngIf="sellerOrders.length === 0">
                <td colspan="7" class="text-center py-8 text-slate-400 text-xs">No active shipments found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Universal Pagination -->
        <app-pagination
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="sellerOrders.length"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
})
export class AdminShipmentsComponent implements OnInit {
  sellerOrders: SellerOrder[] = [];
  paginatedShipments: SellerOrder[] = [];
  currentPage = 1;
  pageSize = 10;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((orders) => {
      let list: SellerOrder[] = [];
      orders.forEach((o) => {
        list = list.concat(o.sellerOrders);
      });
      this.sellerOrders = list;
      this.paginate();
    });
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedShipments = this.sellerOrders.slice(start, start + this.pageSize);
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
