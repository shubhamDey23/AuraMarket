import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { Customer } from '../../../core/models/user.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent, PaginationComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Customer Management</h1>
          <p class="text-xs text-slate-500 mt-1">Platform customer accounts, total spend, and account status ({{ customers.length }} total)</p>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="card bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterCustomers()"
            placeholder="Search by customer name, email, or phone..."
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

      <!-- Customers Table -->
      <div class="card bg-white p-6 space-y-4 border border-slate-200">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact Info</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Loyalty Points</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of paginatedCustomers">
                <td>
                  <div class="flex items-center gap-3">
                    <img [src]="c.avatarUrl" class="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 bg-slate-50" />
                    <div>
                      <div class="font-bold text-slate-900 text-xs line-clamp-1">
                        <a [routerLink]="['/admin/customers', c.id]" class="hover:text-indigo-600">
                          {{ c.name }}
                        </a>
                      </div>
                      <div class="text-[10px] text-slate-400">ID: {{ c.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="text-xs">
                  <div class="font-semibold text-slate-800">{{ c.email }}</div>
                  <div class="text-slate-400">{{ c.phone }}</div>
                </td>
                <td class="text-xs font-bold text-slate-900">{{ c.totalOrdersCount }} orders</td>
                <td class="font-extrabold text-slate-900 text-xs">{{ formatInr(c.totalSpent) }}</td>
                <td class="text-xs font-semibold text-indigo-600">★ {{ c.loyaltyPoints }} pts</td>
                <td>
                  <span
                    class="badge text-[10px]"
                    [ngClass]="{
                      'badge-success': c.status === 'ACTIVE',
                      'badge-neutral': c.status === 'INACTIVE',
                      'bg-red-50 text-red-700 border-red-200': c.status === 'BLOCKED' || c.status === 'SUSPENDED'
                    }"
                  >
                    {{ c.status }}
                  </span>
                </td>
                <td class="text-xs text-slate-500">{{ c.createdAt }}</td>
                <td>
                  <a [routerLink]="['/admin/customers', c.id]" class="btn btn-xs btn-outline">
                    Manage
                  </a>
                </td>
              </tr>
              <tr *ngIf="filteredCustomers.length === 0">
                <td colspan="8" class="text-center py-8 text-slate-400 text-xs">No customer accounts match your search.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Universal Pagination -->
        <app-pagination
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="filteredCustomers.length"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
})
export class AdminCustomersComponent implements OnInit {
  formatInr = formatInr;
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  paginatedCustomers: Customer[] = [];
  searchQuery = '';
  activeTab = 'ALL';
  currentPage = 1;
  pageSize = 10;

  statusTabs = [
    { key: 'ALL', label: 'All Customers' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'INACTIVE', label: 'Inactive' },
    { key: 'BLOCKED', label: 'Blocked' },
  ];

  constructor(
    private customerService: CustomerService,
    private toastService: ToastService,
    private activityLogService: ActivityLogService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe((res) => {
      this.customers = res;
      this.filterCustomers();
    });
  }

  selectTab(tabKey: string): void {
    this.activeTab = tabKey;
    this.currentPage = 1; // Auto reset page to 1
    this.filterCustomers();
  }

  filterCustomers(): void {
    let result = [...this.customers];
    if (this.activeTab !== 'ALL') {
      result = result.filter((c) => c.status === this.activeTab);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.phone && c.phone.toLowerCase().includes(q))
      );
    }
    this.filteredCustomers = result;
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedCustomers = this.filteredCustomers.slice(start, start + this.pageSize);
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

  changeStatus(cust: Customer, newStatus: any): void {
    this.customerService.updateCustomerStatus(cust.id, newStatus).subscribe((updated) => {
      if (updated) {
        this.toastService.success(`Customer ${cust.name} status updated to ${newStatus}.`);
        this.activityLogService.logActivity(
          `CUSTOMER_${newStatus}`,
          'CUSTOMER',
          cust.id,
          `Changed status for customer "${cust.name}" to ${newStatus}.`
        );
        this.loadCustomers();
      }
    });
  }
}
