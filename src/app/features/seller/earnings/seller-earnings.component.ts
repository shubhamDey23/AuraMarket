import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { SellerOrder } from '../../../core/models/order.model';
import { StatCardComponent } from '../../../shared/components/stat-card.component';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { formatInr } from '../../../core/utils/currency.util';

export interface EarningsRow {
  orderId: string;
  sellerOrderId: string;
  date: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  settlementStatus: 'SETTLED' | 'PENDING' | 'PROCESSING';
}

@Component({
  selector: 'app-seller-earnings',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent, AppIconComponent, PaginationComponent],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Earnings & Payout Settlements</h1>
          <p class="text-xs text-slate-500 mt-1">
            Financial breakdown and payout ledger for <strong>{{ authService.currentSeller().storeName }}</strong>
          </p>
        </div>
      </div>

      <!-- Financial KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-stat-card
          title="Gross Sales"
          [value]="formatInr(grossSales)"
          change="+18.4%"
          [isPositive]="true"
          icon="indian-rupee"
          iconBgClass="bg-slate-100 text-slate-700"
        ></app-stat-card>

        <app-stat-card
          title="Platform Commission (5%)"
          [value]="formatInr(platformFees)"
          icon="trending-down"
          iconBgClass="bg-red-50 text-red-600"
        ></app-stat-card>

        <app-stat-card
          title="Net Earnings"
          [value]="formatInr(netEarnings)"
          change="+16.8%"
          [isPositive]="true"
          icon="indian-rupee"
          iconBgClass="bg-emerald-50 text-emerald-600"
        ></app-stat-card>

        <app-stat-card
          title="Pending Payout"
          [value]="formatInr(pendingPayout)"
          icon="clock"
          iconBgClass="bg-amber-50 text-amber-600"
        ></app-stat-card>
      </div>

      <!-- Earnings History Table -->
      <div class="card bg-white p-6 space-y-4 border border-slate-200">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <app-icon name="indian-rupee" [size]="18" customClass="text-emerald-600"></app-icon> Settlement Ledger
          </h2>
          <span class="text-xs text-slate-500 font-semibold">{{ earningsRows.length }} order settlement(s)</span>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Order Date</th>
                <th>Gross Order Total</th>
                <th>Platform Fee (5%)</th>
                <th>Net Payout</th>
                <th>Settlement Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of paginatedEarningsRows">
                <td class="font-bold text-slate-900 text-xs">
                  <a [routerLink]="['/seller/orders', row.sellerOrderId]" class="hover:text-indigo-600">
                    {{ row.orderId }}
                  </a>
                </td>
                <td class="text-xs text-slate-500">{{ row.date | date:'short' }}</td>
                <td class="font-semibold text-slate-900 text-xs">{{ formatInr(row.grossAmount) }}</td>
                <td class="text-xs text-red-500 font-medium">-{{ formatInr(row.platformFee) }}</td>
                <td class="font-extrabold text-xs text-emerald-600">{{ formatInr(row.netAmount) }}</td>
                <td>
                  <span
                    class="badge text-[10px]"
                    [ngClass]="row.settlementStatus === 'SETTLED' ? 'badge-success' : 'badge-warning'"
                  >
                    {{ row.settlementStatus }}
                  </span>
                </td>
              </tr>
              <tr *ngIf="earningsRows.length === 0">
                <td colspan="6" class="text-center py-8 text-slate-400 text-xs">
                  No payout settlement records found for <strong>{{ authService.currentSeller().storeName }}</strong>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <app-pagination
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="earningsRows.length"
          (pageChange)="currentPage = $event"
          (pageSizeChange)="pageSize = $event; currentPage = 1"
        ></app-pagination>
      </div>
    </div>
  `,
})
export class SellerEarningsComponent implements OnInit {
  formatInr = formatInr;
  earningsRows: EarningsRow[] = [];
  grossSales = 0;
  platformFees = 0;
  netEarnings = 0;
  pendingPayout = 0;

  currentPage = 1;
  pageSize = 10;

  get paginatedEarningsRows(): EarningsRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.earningsRows.slice(start, start + this.pageSize);
  }

  constructor(
    public authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadEarnings();
  }

  loadEarnings(): void {
    const sellerId = this.authService.currentSellerId();
    this.orderService.getSellerOrders(sellerId).subscribe((sellerOrders) => {
      let gross = 0;
      let fees = 0;
      let net = 0;
      let pending = 0;

      const rows: EarningsRow[] = sellerOrders.map((so, idx) => {
        const rowGross = so.total;
        const rowFee = parseFloat((so.subtotal * 0.05).toFixed(2));
        const rowNet = parseFloat((rowGross - rowFee).toFixed(2));
        const status: 'SETTLED' | 'PENDING' = so.status === 'DELIVERED' ? 'SETTLED' : 'PENDING';

        gross += rowGross;
        fees += rowFee;
        net += rowNet;
        if (status === 'PENDING') {
          pending += rowNet;
        }

        return {
          orderId: so.orderId,
          sellerOrderId: so.id,
          date: so.createdAt,
          grossAmount: rowGross,
          platformFee: rowFee,
          netAmount: rowNet,
          settlementStatus: status,
        };
      });

      this.grossSales = gross;
      this.platformFees = fees;
      this.netEarnings = net;
      this.pendingPayout = pending;
      this.earningsRows = rows;
    });
  }
}

