import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReturnService, ReturnRequest, ReturnStatus } from '../../../core/services/return.service';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-admin-returns',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent, PaginationComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Returns & Refunds Governance</h1>
          <p class="text-xs text-slate-500 mt-1">Review customer return claims, approve defect refunds, and inspect return status ({{ returns.length }} total)</p>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="card bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterReturns()"
            placeholder="Search by Return Ref, Order Number, or Customer..."
            class="form-input text-xs pl-9"
          />
          <app-icon name="search" [size]="16" customClass="absolute left-3 top-2.5 text-slate-400"></app-icon>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto text-xs py-1">
          <button
            *ngFor="let tab of statusTabs"
            (click)="selectTab(tab.key)"
            class="px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap"
            [ngClass]="activeTab === tab.key ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Returns Table Card -->
      <div class="card bg-white space-y-4 border border-slate-200 p-6">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Return Ref</th>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Seller Store</th>
                <th>Product</th>
                <th>Refund Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ret of paginatedReturns">
                <td class="font-bold text-slate-900 text-xs">
                  <a [routerLink]="['/admin/returns', ret.id]" class="hover:text-indigo-600">
                    {{ ret.returnNumber }}
                  </a>
                </td>
                <td class="text-xs font-mono text-slate-600">{{ ret.orderNumber }}</td>
                <td class="text-xs font-semibold text-slate-800">{{ ret.customerName }}</td>
                <td class="text-xs text-slate-600 font-medium">{{ ret.sellerName }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <img [src]="ret.productImage" class="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0" />
                    <div class="font-bold text-slate-900 text-xs line-clamp-1">{{ ret.productName }}</div>
                  </div>
                </td>
                <td class="font-extrabold text-xs text-slate-900">{{ formatInr(ret.refundAmount) }}</td>
                <td>
                  <span
                    class="badge text-[10px]"
                    [ngClass]="{
                      'badge-warning': ret.status === 'REQUESTED' || ret.status === 'PICKUP_PENDING',
                      'badge-success': ret.status === 'APPROVED' || ret.status === 'REFUNDED',
                      'bg-red-50 text-red-700 border-red-200': ret.status === 'REJECTED' || ret.status === 'CANCELLED'
                    }"
                  >
                    {{ ret.status }}
                  </span>
                </td>
                <td>
                  <a [routerLink]="['/admin/returns', ret.id]" class="btn btn-xs btn-outline">
                    Workflow Action
                  </a>
                </td>
              </tr>
              <tr *ngIf="filteredReturns.length === 0">
                <td colspan="8" class="text-center py-8 text-slate-400 text-xs">No return claims match your criteria.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Universal Pagination -->
        <app-pagination
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="filteredReturns.length"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
})
export class AdminReturnsComponent implements OnInit {
  formatInr = formatInr;
  returns: ReturnRequest[] = [];
  filteredReturns: ReturnRequest[] = [];
  paginatedReturns: ReturnRequest[] = [];
  searchQuery = '';
  activeTab = 'ALL';
  currentPage = 1;
  pageSize = 10;

  statusTabs = [
    { key: 'ALL', label: 'All Returns' },
    { key: 'REQUESTED', label: 'Requested' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'REFUNDED', label: 'Refunded' },
  ];

  constructor(private returnService: ReturnService) {}

  ngOnInit(): void {
    this.loadReturns();
  }

  loadReturns(): void {
    this.returnService.getReturns().subscribe((res) => {
      this.returns = res;
      this.filterReturns();
    });
  }

  selectTab(tabKey: string): void {
    this.activeTab = tabKey;
    this.currentPage = 1; // Auto reset page to 1
    this.filterReturns();
  }

  filterReturns(): void {
    let result = [...this.returns];
    if (this.activeTab !== 'ALL') {
      result = result.filter((r) => r.status === this.activeTab);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.returnNumber.toLowerCase().includes(q) ||
          r.orderNumber.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.productName.toLowerCase().includes(q)
      );
    }
    this.filteredReturns = result;
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedReturns = this.filteredReturns.slice(start, start + this.pageSize);
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
