import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CouponService, Coupon } from '../../../core/services/coupon.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-admin-coupons',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AppIconComponent, PaginationComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Platform Coupon Management</h1>
          <p class="text-xs text-slate-500 mt-1">Create and manage marketplace promotional codes and discount thresholds ({{ coupons.length }} total)</p>
        </div>
        <button (click)="openAddModal()" class="btn btn-primary flex items-center gap-1">
          <app-icon name="plus" [size]="16"></app-icon> Create Promo Coupon
        </button>
      </div>

      <!-- Coupons Table -->
      <div class="card bg-white p-6 space-y-4 border border-slate-200">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Description</th>
                <th>Discount Type</th>
                <th>Value</th>
                <th>Min Order</th>
                <th>Usage Count</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let coupon of paginatedCoupons">
                <td class="font-mono font-extrabold text-indigo-700 text-xs uppercase">{{ coupon.code }}</td>
                <td class="text-xs text-slate-600 max-w-xs">{{ coupon.description }}</td>
                <td class="text-xs font-semibold text-slate-800">{{ coupon.discountType }}</td>
                <td class="font-bold text-xs text-slate-900">
                  {{ coupon.discountType === 'PERCENTAGE' ? coupon.discountValue + '%' : formatInr(coupon.discountValue) }}
                </td>
                <td class="text-xs font-semibold text-slate-700">{{ formatInr(coupon.minOrderValue) }}</td>
                <td class="text-xs text-slate-600 font-semibold">{{ coupon.usedCount }} / {{ coupon.usageLimit }}</td>
                <td>
                  <span class="badge text-[10px]" [ngClass]="coupon.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'">
                    {{ coupon.status }}
                  </span>
                </td>
                <td>
                  <button (click)="toggleStatus(coupon)" class="btn btn-xs btn-outline">
                    {{ coupon.status === 'ACTIVE' ? 'Disable' : 'Enable' }}
                  </button>
                </td>
              </tr>
              <tr *ngIf="coupons.length === 0">
                <td colspan="8" class="text-center py-8 text-slate-400 text-xs">No coupons created yet.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Universal Pagination -->
        <app-pagination
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="coupons.length"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        ></app-pagination>
      </div>

      <!-- Add Modal -->
      <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-xs">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-base">Create Promo Coupon</h3>
            <button (click)="isModalOpen = false" class="text-slate-400"><app-icon name="x" [size]="20"></app-icon></button>
          </div>

          <div class="space-y-3">
            <div class="form-group">
              <label class="form-label">Coupon Code (Uppercase) *</label>
              <input type="text" [(ngModel)]="formData.code" class="form-input uppercase font-mono" placeholder="SUMMER20" />
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <input type="text" [(ngModel)]="formData.description" class="form-input" placeholder="20% off summer collection" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="form-group">
                <label class="form-label">Discount Type</label>
                <select [(ngModel)]="formData.discountType" class="form-select">
                  <option value="PERCENTAGE">PERCENTAGE (%)</option>
                  <option value="FIXED">FIXED AMOUNT (₹)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Discount Value *</label>
                <input type="number" [(ngModel)]="formData.discountValue" class="form-input" placeholder="500" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="form-group">
                <label class="form-label">Min Order Value (₹)</label>
                <input type="number" [(ngModel)]="formData.minOrderValue" class="form-input" placeholder="999" />
              </div>

              <div class="form-group">
                <label class="form-label">Usage Limit</label>
                <input type="number" [(ngModel)]="formData.usageLimit" class="form-input" placeholder="1000" />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button (click)="isModalOpen = false" class="btn btn-sm btn-outline">Cancel</button>
            <button (click)="saveCoupon()" class="btn btn-sm btn-primary">Save Coupon</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminCouponsComponent implements OnInit {
  formatInr = formatInr;
  coupons: Coupon[] = [];
  paginatedCoupons: Coupon[] = [];
  isModalOpen = false;
  currentPage = 1;
  pageSize = 10;

  formData: Partial<Coupon> = {
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minOrderValue: 50,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 1000,
    status: 'ACTIVE',
  };

  constructor(
    private couponService: CouponService,
    private toastService: ToastService,
    private activityLogService: ActivityLogService
  ) {}

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.couponService.getCoupons().subscribe((res) => {
      this.coupons = res;
      this.paginate();
    });
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedCoupons = this.coupons.slice(start, start + this.pageSize);
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

  openAddModal(): void {
    this.formData = {
      code: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minOrderValue: 50,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      usageLimit: 1000,
      status: 'ACTIVE',
    };
    this.isModalOpen = true;
  }

  toggleStatus(coupon: Coupon): void {
    this.couponService.toggleCouponStatus(coupon.id).subscribe((updated) => {
      if (updated) {
        this.activityLogService.logActivity(
          'COUPON_STATUS_CHANGED',
          'COUPON',
          coupon.id,
          `Toggled status for coupon "${coupon.code}" to ${updated.status}.`
        );
        this.loadCoupons();
      }
    });
  }

  saveCoupon(): void {
    if (!this.formData.code?.trim()) return;

    this.couponService
      .createCoupon({
        code: this.formData.code.trim().toUpperCase(),
        description: this.formData.description || '',
        discountType: this.formData.discountType || 'PERCENTAGE',
        discountValue: Number(this.formData.discountValue || 10),
        minOrderValue: Number(this.formData.minOrderValue || 0),
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        usageLimit: Number(this.formData.usageLimit || 1000),
        status: 'ACTIVE',
      })
      .subscribe((newC) => {
        this.activityLogService.logActivity(
          'COUPON_CREATED',
          'COUPON',
          newC.id,
          `Created new promo coupon "${newC.code}".`
        );
        this.loadCoupons();
      });

    this.isModalOpen = false;
  }
}
