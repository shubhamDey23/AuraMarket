import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../core/services/inventory.service';
import { AuthService } from '../../../core/services/auth.service';
import { InventoryItem } from '../../../core/models/inventory.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { InventoryStatusBadgeComponent } from '../../../shared/components/inventory-status-badge.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';

@Component({
  selector: 'app-seller-inventory',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AppIconComponent,
    InventoryStatusBadgeComponent,
    PaginationComponent,
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Inventory & Stock Management</h1>
          <p class="text-xs text-slate-500 mt-1">
            Warehouse inventory and real-time stock levels for <strong>{{ authService.currentSeller().storeName }}</strong>
          </p>
        </div>
        <div class="flex items-center gap-2">
          <a routerLink="/seller/inventory/history" class="btn btn-outline flex items-center gap-1 text-xs">
            <app-icon name="clock" [size]="14"></app-icon> Transaction History
          </a>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="card bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterInventory()"
            placeholder="Search stock by product name or SKU..."
            class="form-input text-xs pl-9"
          />
          <app-icon name="search" [size]="16" customClass="absolute left-3 top-2.5 text-slate-400"></app-icon>
        </div>

        <div class="flex items-center gap-2 text-xs">
          <label class="text-slate-500">Stock Status:</label>
          <select [(ngModel)]="statusFilter" (ngModelChange)="filterInventory()" class="form-select text-xs py-1.5">
            <option value="ALL">All Statuses</option>
            <option value="IN_STOCK">IN_STOCK</option>
            <option value="LOW_STOCK">LOW_STOCK</option>
            <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
          </select>
        </div>
      </div>

      <!-- Stock Table -->
      <div class="card bg-white p-6 space-y-4 border border-slate-200">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Product SKU</th>
                <th>Location / Hub</th>
                <th>Available</th>
                <th>Reserved</th>
                <th>Damaged</th>
                <th>Total Stock</th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of paginatedItems">
                <td>
                  <div>
                    <div class="font-bold text-slate-900 text-xs">{{ item.productName }}</div>
                    <div class="font-mono text-[11px] text-slate-400">{{ item.sku }}</div>
                  </div>
                </td>
                <td class="text-xs text-slate-600">{{ item.locationName }}</td>
                <td class="font-bold text-sm text-slate-900">{{ item.availableQuantity }}</td>
                <td class="text-xs font-semibold text-indigo-600">{{ item.reservedQuantity }}</td>
                <td class="text-xs font-semibold text-red-500">{{ item.damagedQuantity }}</td>
                <td class="font-extrabold text-xs text-slate-800">
                  {{ item.availableQuantity + item.reservedQuantity + item.damagedQuantity }}
                </td>
                <td class="text-xs text-slate-500 font-semibold">{{ item.reorderLevel }}</td>
                <td>
                  <app-inventory-status-badge [status]="item.status"></app-inventory-status-badge>
                </td>
                <td>
                  <a [routerLink]="['/seller/inventory', item.id]" class="btn btn-xs btn-primary flex items-center gap-1">
                    <app-icon name="edit" [size]="12"></app-icon> Adjust Stock
                  </a>
                </td>
              </tr>
              <tr *ngIf="filteredItems.length === 0">
                <td colspan="9" class="text-center py-8 text-slate-400 text-xs">
                  No inventory items match your filter criteria for <strong>{{ authService.currentSeller().storeName }}</strong>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Universal Pagination -->
        <app-pagination
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="filteredItems.length"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
})
export class SellerInventoryComponent implements OnInit {
  items: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  paginatedItems: InventoryItem[] = [];
  searchQuery = '';
  statusFilter = 'ALL';
  currentPage = 1;
  pageSize = 10;

  constructor(
    public authService: AuthService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    const sellerId = this.authService.currentSellerId();
    this.inventoryService.getInventory({ sellerId }).subscribe((res) => {
      this.items = res;
      this.filterInventory();
    });
  }

  filterInventory(): void {
    let result = [...this.items];
    if (this.statusFilter !== 'ALL') {
      result = result.filter((i) => i.status === this.statusFilter);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (i) =>
          (i.productName && i.productName.toLowerCase().includes(q)) ||
          i.sku.toLowerCase().includes(q)
      );
    }
    this.filteredItems = result;
    this.currentPage = 1; // Auto reset page to 1
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedItems = this.filteredItems.slice(start, start + this.pageSize);
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
