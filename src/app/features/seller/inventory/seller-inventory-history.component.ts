import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../core/services/inventory.service';
import { AuthService } from '../../../core/services/auth.service';
import { InventoryTransaction } from '../../../core/models/inventory.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';

@Component({
  selector: 'app-seller-inventory-history',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent, PaginationComponent],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/seller/dashboard" class="hover:text-indigo-600">Seller Portal</a> /
        <a routerLink="/seller/inventory" class="hover:text-indigo-600">Inventory</a> /
        <span class="text-slate-800 font-medium">Transaction History</span>
      </nav>

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Inventory Transaction History</h1>
          <p class="text-xs text-slate-500 mt-1">
            Audit ledger of stock additions, order reservations, and manual adjustments for <strong>{{ authService.currentSeller().storeName }}</strong> ({{ transactions.length }} total entries)
          </p>
        </div>
        <a routerLink="/seller/inventory" class="btn btn-outline flex items-center gap-1 text-xs">
          <app-icon name="arrow-left" [size]="14"></app-icon> Back to Current Stock
        </a>
      </div>

      <!-- Filters -->
      <div class="card bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterTransactions()"
            placeholder="Search by product name, SKU, or reference..."
            class="form-input text-xs pl-9"
          />
          <app-icon name="search" [size]="16" customClass="absolute left-3 top-2.5 text-slate-400"></app-icon>
        </div>

        <div class="flex items-center gap-2 text-xs">
          <label class="text-slate-500">Transaction Type:</label>
          <select [(ngModel)]="typeFilter" (ngModelChange)="filterTransactions()" class="form-select text-xs py-1.5">
            <option value="ALL">All Types</option>
            <option value="STOCK_RECEIVED">STOCK_RECEIVED</option>
            <option value="ORDER_RESERVED">ORDER_RESERVED</option>
            <option value="ORDER_FULFILLED">ORDER_FULFILLED</option>
            <option value="ORDER_CANCELLED">ORDER_CANCELLED</option>
            <option value="MANUAL_ADJUSTMENT">MANUAL_ADJUSTMENT</option>
            <option value="RETURN_RECEIVED">RETURN_RECEIVED</option>
            <option value="DAMAGED">DAMAGED</option>
          </select>
        </div>
      </div>

      <!-- History Table -->
      <div class="card bg-white p-6 space-y-4 border border-slate-200">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Product & SKU</th>
                <th>Transaction Type</th>
                <th>Quantity Change</th>
                <th>Previous → New Stock</th>
                <th>Reference</th>
                <th>Performed By</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let tx of paginatedTransactions">
                <td class="text-xs text-slate-500 whitespace-nowrap">{{ tx.createdAt | date:'medium' }}</td>
                <td>
                  <div>
                    <div class="font-bold text-slate-900 text-xs">{{ tx.productName }}</div>
                    <div class="font-mono text-[11px] text-slate-400">SKU: {{ tx.sku }}</div>
                  </div>
                </td>
                <td>
                  <span
                    class="badge text-[10px]"
                    [ngClass]="{
                      'badge-success': tx.type === 'STOCK_RECEIVED' || tx.type === 'RETURN_RECEIVED',
                      'badge-primary': tx.type === 'ORDER_FULFILLED',
                      'badge-warning': tx.type === 'ORDER_RESERVED',
                      'bg-red-50 text-red-700 border-red-200': tx.type === 'DAMAGED' || tx.type === 'ORDER_CANCELLED',
                      'badge-neutral': tx.type === 'MANUAL_ADJUSTMENT'
                    }"
                  >
                    {{ tx.type }}
                  </span>
                </td>
                <td class="font-extrabold text-sm" [ngClass]="tx.quantityChange >= 0 ? 'text-emerald-600' : 'text-red-600'">
                  {{ tx.quantityChange >= 0 ? '+' + tx.quantityChange : tx.quantityChange }}
                </td>
                <td class="text-xs font-semibold text-slate-700">
                  {{ tx.previousQuantity }} → <span class="font-extrabold text-slate-900">{{ tx.newQuantity }}</span>
                </td>
                <td class="text-xs font-mono text-slate-600">{{ tx.reference }}</td>
                <td class="text-xs text-slate-500">{{ tx.performedBy }}</td>
              </tr>
              <tr *ngIf="filteredTransactions.length === 0">
                <td colspan="7" class="text-center py-8 text-slate-400 text-xs">
                  No inventory transactions found matching your criteria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Universal Pagination -->
        <app-pagination
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="filteredTransactions.length"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
})
export class SellerInventoryHistoryComponent implements OnInit {
  transactions: InventoryTransaction[] = [];
  filteredTransactions: InventoryTransaction[] = [];
  paginatedTransactions: InventoryTransaction[] = [];
  searchQuery = '';
  typeFilter = 'ALL';
  currentPage = 1;
  pageSize = 10;

  constructor(
    public authService: AuthService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    const sellerId = this.authService.currentSellerId();
    this.inventoryService.getTransactions(sellerId).subscribe((res) => {
      this.transactions = res;
      this.filterTransactions();
    });
  }

  filterTransactions(): void {
    let result = [...this.transactions];
    if (this.typeFilter !== 'ALL') {
      result = result.filter((t) => t.type === this.typeFilter);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.productName.toLowerCase().includes(q) ||
          t.sku.toLowerCase().includes(q) ||
          t.reference.toLowerCase().includes(q)
      );
    }
    this.filteredTransactions = result;
    this.currentPage = 1; // Auto reset page to 1
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedTransactions = this.filteredTransactions.slice(start, start + this.pageSize);
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
