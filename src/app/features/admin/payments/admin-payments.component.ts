import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent, PaginationComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Platform Payment Transactions</h1>
          <p class="text-xs text-slate-500 mt-1">Operational view of customer payment processing, gateway status, and refunds ({{ orders.length }} transactions)</p>
        </div>
      </div>

      <!-- Payments Table -->
      <div class="card bg-white p-6 space-y-4 border border-slate-200">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of paginatedPayments">
                <td class="font-mono text-xs text-indigo-700 font-bold">TXN-{{ order.id.slice(-6) }}</td>
                <td class="font-bold text-slate-900 text-xs">
                  <a [routerLink]="['/admin/orders', order.id]" class="hover:text-indigo-600">
                    {{ order.orderNumber }}
                  </a>
                </td>
                <td class="text-xs font-semibold text-slate-800">{{ order.customerName }}</td>
                <td class="font-extrabold text-xs text-slate-900">{{ formatInr(order.grandTotal) }}</td>
                <td class="text-xs text-slate-600 font-medium">{{ order.paymentMethod }}</td>
                <td>
                  <span
                    class="badge text-[10px]"
                    [ngClass]="{
                      'badge-success': order.paymentStatus === 'PAID',
                      'badge-warning': order.paymentStatus === 'PENDING',
                      'bg-red-50 text-red-700 border-red-200': order.paymentStatus === 'REFUNDED' || order.paymentStatus === 'FAILED'
                    }"
                  >
                    {{ order.paymentStatus }}
                  </span>
                </td>
                <td class="text-xs text-slate-500">{{ order.createdAt }}</td>
                <td>
                  <a [routerLink]="['/admin/orders', order.id]" class="btn btn-xs btn-outline">
                    Inspect Order
                  </a>
                </td>
              </tr>
              <tr *ngIf="orders.length === 0">
                <td colspan="8" class="text-center py-8 text-slate-400 text-xs">No payment transactions recorded.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Universal Pagination -->
        <app-pagination
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="orders.length"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
})
export class AdminPaymentsComponent implements OnInit {
  formatInr = formatInr;
  orders: Order[] = [];
  paginatedPayments: Order[] = [];
  currentPage = 1;
  pageSize = 10;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((res) => {
      this.orders = res;
      this.paginate();
    });
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedPayments = this.orders.slice(start, start + this.pageSize);
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
