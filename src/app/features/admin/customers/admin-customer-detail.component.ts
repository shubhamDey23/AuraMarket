import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { OrderService } from '../../../core/services/order.service';
import { AddressService } from '../../../core/services/address.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { Customer } from '../../../core/models/user.model';
import { Order } from '../../../core/models/order.model';
import { Address } from '../../../core/models/address.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { OrderStatusBadgeComponent } from '../../../shared/components/order-status-badge.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-admin-customer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent, OrderStatusBadgeComponent],
  template: `
    <div class="container space-y-6 max-w-4xl">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/admin/dashboard" class="hover:text-indigo-600">Admin Console</a> /
        <a routerLink="/admin/customers" class="hover:text-indigo-600">Customers</a> /
        <span class="text-slate-800 font-medium">Customer Profile</span>
      </nav>

      <div *ngIf="customer" class="space-y-6">
        <!-- Customer Header Card -->
        <div class="card p-6 bg-white space-y-4 border border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div class="flex items-center gap-4">
              <img [src]="customer.avatarUrl" class="w-16 h-16 rounded-full object-cover border border-slate-200 shrink-0 bg-slate-50" />
              <div>
                <div class="flex items-center gap-3">
                  <h1 class="text-2xl font-extrabold text-slate-900">{{ customer.name }}</h1>
                  <span
                    class="badge text-xs"
                    [ngClass]="{
                      'badge-success': customer.status === 'ACTIVE',
                      'badge-neutral': customer.status === 'INACTIVE',
                      'bg-red-50 text-red-700 border-red-200': customer.status === 'BLOCKED' || customer.status === 'SUSPENDED'
                    }"
                  >
                    {{ customer.status }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 mt-1">
                  Email: <strong>{{ customer.email }}</strong> • Phone: {{ customer.phone }} • Joined: {{ customer.createdAt }}
                </p>
              </div>
            </div>

            <!-- Action controls -->
            <div class="flex items-center gap-2">
              <button
                *ngIf="customer.status === 'ACTIVE'"
                (click)="updateStatus('BLOCKED')"
                class="btn btn-sm btn-outline text-red-600 border-red-200 hover:bg-red-50 text-xs"
              >
                Block Account
              </button>
              <button
                *ngIf="customer.status === 'BLOCKED' || customer.status === 'INACTIVE'"
                (click)="updateStatus('ACTIVE')"
                class="btn btn-sm btn-primary text-xs"
              >
                Activate Account
              </button>
            </div>
          </div>

          <!-- Customer Stats Bar -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs">
            <div>
              <div class="text-slate-500 text-[11px]">Total Orders</div>
              <div class="text-lg font-extrabold text-slate-900 mt-0.5">{{ customer.totalOrdersCount }}</div>
            </div>
            <div>
              <div class="text-slate-500 text-[11px]">Total Lifetime Spent</div>
              <div class="text-lg font-extrabold text-emerald-600 mt-0.5">{{ formatInr(customer.totalSpent) }}</div>
            </div>
            <div>
              <div class="text-slate-500 text-[11px]">Average Order Value</div>
              <div class="text-lg font-extrabold text-indigo-600 mt-0.5">
                {{ formatInr(customer.totalSpent / (customer.totalOrdersCount || 1)) }}
              </div>
            </div>
            <div>
              <div class="text-slate-500 text-[11px]">Loyalty Points</div>
              <div class="text-lg font-extrabold text-amber-500 mt-0.5">★ {{ customer.loyaltyPoints }} pts</div>
            </div>
          </div>
        </div>

        <!-- Address Book Summary Card -->
        <div class="card p-6 bg-white space-y-4 border border-slate-200">
          <h3 class="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Saved Delivery Addresses ({{ addresses.length }})</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div *ngFor="let addr of addresses" class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <div class="flex items-center justify-between">
                <span class="badge badge-primary text-[9px]">{{ addr.type }}</span>
                <span *ngIf="addr.isDefault" class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Default</span>
              </div>
              <div class="font-bold text-slate-900">{{ addr.fullName }}</div>
              <p class="text-slate-600 leading-relaxed">
                {{ addr.addressLine1 }}<span *ngIf="addr.addressLine2">, {{ addr.addressLine2 }}</span><br />
                {{ addr.city }}, {{ addr.state }} {{ addr.postalCode }}, {{ addr.country }}
              </p>
              <p class="text-slate-500">Phone: {{ addr.phone }}</p>
            </div>
          </div>
        </div>

        <!-- Customer Order History Card -->
        <div class="card p-6 bg-white space-y-4 border border-slate-200">
          <h3 class="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Marketplace Order History</h3>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let order of customerOrders">
                  <td class="font-bold text-slate-900 text-xs">{{ order.orderNumber }}</td>
                  <td class="text-xs text-slate-500">{{ order.createdAt }}</td>
                  <td class="text-xs font-semibold text-slate-700">{{ order.items.length }} item(s)</td>
                  <td class="font-extrabold text-xs text-slate-900">{{ formatInr(order.grandTotal) }}</td>
                  <td><app-order-status-badge [status]="order.status"></app-order-status-badge></td>
                  <td>
                    <a [routerLink]="['/admin/orders', order.id]" class="text-xs text-indigo-600 hover:underline font-bold">
                      Inspect
                    </a>
                  </td>
                </tr>
                <tr *ngIf="customerOrders.length === 0">
                  <td colspan="6" class="text-center py-6 text-slate-400 text-xs">No orders placed yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminCustomerDetailComponent implements OnInit {
  formatInr = formatInr;
  customerId: string | null = null;
  customer: Customer | null = null;
  customerOrders: Order[] = [];
  addresses: Address[] = [];

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private orderService: OrderService,
    private addressService: AddressService,
    private toastService: ToastService,
    private activityLogService: ActivityLogService
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    if (this.customerId) {
      this.loadCustomerData(this.customerId);
    }
  }

  loadCustomerData(id: string): void {
    this.customerService.getCustomerById(id).subscribe((c) => {
      if (c) this.customer = c;
    });

    this.orderService.getOrders({ customerId: id }).subscribe((o) => (this.customerOrders = o));
    this.addressService.getAddresses().subscribe((a) => (this.addresses = a));
  }

  updateStatus(newStatus: any): void {
    if (!this.customer) return;
    this.customerService.updateCustomerStatus(this.customer.id, newStatus).subscribe((updated) => {
      if (updated) {
        this.customer = updated;
        this.toastService.success(`Customer status updated to ${newStatus}.`);
        this.activityLogService.logActivity(
          `CUSTOMER_${newStatus}`,
          'CUSTOMER',
          this.customer.id,
          `Updated customer status for "${this.customer.name}" to ${newStatus}.`
        );
      }
    });
  }
}
