import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SellerService } from '../../../core/services/seller.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { Seller } from '../../../core/models/user.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-admin-sellers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent, PaginationComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Seller Account Governance</h1>
          <p class="text-xs text-slate-500 mt-1">Approve, monitor, and manage independent marketplace seller accounts ({{ sellers.length }} total)</p>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="card bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterSellers()"
            placeholder="Search by store name, owner, or email..."
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

      <!-- Sellers Table Card -->
      <div class="card bg-white space-y-4 border border-slate-200 p-6">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Seller Store</th>
                <th>Owner Contact</th>
                <th>Joined</th>
                <th>Revenue</th>
                <th>Orders</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Governance Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of paginatedSellers">
                <td>
                  <div class="flex items-center gap-3">
                    <img [src]="s.logoUrl" class="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0" />
                    <div>
                      <div class="font-bold text-slate-900 text-xs line-clamp-1">
                        <a [routerLink]="['/admin/sellers', s.id]" class="hover:text-indigo-600">
                          {{ s.storeName }}
                        </a>
                      </div>
                      <div class="text-[10px] text-slate-400">ID: {{ s.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="text-xs">
                  <div class="font-semibold text-slate-800">{{ s.ownerName }}</div>
                  <div class="text-slate-400">{{ s.email }}</div>
                </td>
                <td class="text-xs text-slate-500">{{ s.joinedDate }}</td>
                <td class="font-extrabold text-slate-900 text-xs">{{ formatInr(s.metrics.totalRevenue) }}</td>
                <td class="text-xs font-semibold text-slate-800">{{ s.metrics.totalOrders }}</td>
                <td class="font-bold text-xs text-amber-500">★ {{ s.rating }}</td>
                <td>
                  <span
                    class="badge text-[10px]"
                    [ngClass]="{
                      'badge-success': s.status === 'APPROVED' || s.status === 'ACTIVE',
                      'badge-warning': s.status === 'PENDING' || s.status === 'PENDING_APPROVAL',
                      'bg-red-50 text-red-700 border-red-200': s.status === 'SUSPENDED' || s.status === 'REJECTED'
                    }"
                  >
                    {{ s.status }}
                  </span>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <a [routerLink]="['/admin/sellers', s.id]" class="btn btn-xs btn-outline">
                      Details
                    </a>
                    <button
                      *ngIf="s.status === 'PENDING' || s.status === 'PENDING_APPROVAL'"
                      (click)="changeStatus(s, 'ACTIVE')"
                      class="btn btn-xs btn-primary text-xs"
                    >
                      Approve
                    </button>
                    <button
                      *ngIf="s.status === 'APPROVED' || s.status === 'ACTIVE'"
                      (click)="confirmAction(s, 'SUSPENDED')"
                      class="text-xs text-red-600 hover:underline font-semibold"
                    >
                      Suspend
                    </button>
                    <button
                      *ngIf="s.status === 'SUSPENDED'"
                      (click)="changeStatus(s, 'ACTIVE')"
                      class="text-xs text-emerald-600 hover:underline font-semibold"
                    >
                      Re-Activate
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredSellers.length === 0">
                <td colspan="8" class="text-center py-8 text-slate-400 text-xs">
                  No marketplace sellers found matching your filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Universal Pagination -->
        <app-pagination
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="filteredSellers.length"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        ></app-pagination>
      </div>

      <!-- Action Confirmation Modal -->
      <div *ngIf="pendingConfirmation" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
          <div class="flex items-center gap-3 text-red-600">
            <app-icon name="alert-triangle" [size]="24"></app-icon>
            <h3 class="font-bold text-slate-900 text-base">Confirm Seller Status Change</h3>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to change status for seller <strong>{{ pendingConfirmation.seller.storeName }}</strong> to
            <span class="font-bold text-red-600 uppercase">{{ pendingConfirmation.targetStatus }}</span>? This action will update platform availability.
          </p>

          <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button (click)="pendingConfirmation = null" class="btn btn-sm btn-outline">Cancel</button>
            <button (click)="executeConfirmedAction()" class="btn btn-sm btn-primary bg-red-600 hover:bg-red-700">
              Confirm Change
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminSellersComponent implements OnInit {
  formatInr = formatInr;
  sellers: Seller[] = [];
  filteredSellers: Seller[] = [];
  paginatedSellers: Seller[] = [];
  searchQuery = '';
  activeTab = 'ALL';
  currentPage = 1;
  pageSize = 10;
  pendingConfirmation: { seller: Seller; targetStatus: 'SUSPENDED' | 'REJECTED' } | null = null;

  statusTabs = [
    { key: 'ALL', label: 'All Sellers' },
    { key: 'ACTIVE', label: 'Active / Approved' },
    { key: 'PENDING', label: 'Pending Approval' },
    { key: 'SUSPENDED', label: 'Suspended' },
  ];

  constructor(
    private sellerService: SellerService,
    private toastService: ToastService,
    private activityLogService: ActivityLogService
  ) {}

  ngOnInit(): void {
    this.loadSellers();
  }

  loadSellers(): void {
    this.sellerService.getSellers().subscribe((res) => {
      this.sellers = res;
      this.filterSellers();
    });
  }

  selectTab(tabKey: string): void {
    this.activeTab = tabKey;
    this.currentPage = 1; // Auto reset page to 1
    this.filterSellers();
  }

  filterSellers(): void {
    let result = [...this.sellers];
    if (this.activeTab === 'ACTIVE') {
      result = result.filter((s) => s.status === 'ACTIVE' || s.status === 'APPROVED');
    } else if (this.activeTab === 'PENDING') {
      result = result.filter((s) => s.status === 'PENDING' || s.status === 'PENDING_APPROVAL');
    } else if (this.activeTab === 'SUSPENDED') {
      result = result.filter((s) => s.status === 'SUSPENDED');
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.storeName.toLowerCase().includes(q) ||
          s.ownerName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }
    this.filteredSellers = result;
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedSellers = this.filteredSellers.slice(start, start + this.pageSize);
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

  confirmAction(seller: Seller, targetStatus: 'SUSPENDED' | 'REJECTED'): void {
    this.pendingConfirmation = { seller, targetStatus };
  }

  executeConfirmedAction(): void {
    if (!this.pendingConfirmation) return;
    const { seller, targetStatus } = this.pendingConfirmation;
    this.changeStatus(seller, targetStatus);
    this.pendingConfirmation = null;
  }

  changeStatus(seller: Seller, newStatus: any): void {
    this.sellerService.updateSellerStatus(seller.id, newStatus).subscribe((updated) => {
      if (updated) {
        this.toastService.success(`Seller "${seller.storeName}" status updated to ${newStatus}.`);
        this.activityLogService.logActivity(
          `SELLER_${newStatus}`,
          'SELLER',
          seller.id,
          `Changed status for seller "${seller.storeName}" to ${newStatus}.`
        );
        this.loadSellers();
      }
    });
  }
}
