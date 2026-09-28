import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReturnService, ReturnRequest, ReturnStatus } from '../../../core/services/return.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-admin-return-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  template: `
    <div class="container space-y-6 max-w-4xl">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/admin/dashboard" class="hover:text-indigo-600">Admin Console</a> /
        <a routerLink="/admin/returns" class="hover:text-indigo-600">Returns</a> /
        <span class="text-slate-800 font-medium">Return Claim Workflow</span>
      </nav>

      <div *ngIf="returnReq" class="space-y-6">
        <!-- Header Card -->
        <div class="card p-6 bg-white space-y-4 border border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-xl font-bold text-slate-900">Return Ref #{{ returnReq.returnNumber }}</h1>
                <span class="badge badge-warning text-xs">{{ returnReq.status }}</span>
              </div>
              <p class="text-xs text-slate-500 mt-1">
                Parent Order: <strong class="text-slate-700 font-mono">{{ returnReq.orderNumber }}</strong> • Customer: {{ returnReq.customerName }}
              </p>
            </div>

            <!-- Workflow Controls -->
            <div class="flex flex-wrap items-center gap-2">
              <button
                *ngIf="returnReq.status === 'REQUESTED'"
                (click)="updateStatus('APPROVED')"
                class="btn btn-sm btn-primary"
              >
                Approve Return & Authorize Pickup
              </button>
              <button
                *ngIf="returnReq.status === 'REQUESTED' || returnReq.status === 'PICKUP_PENDING'"
                (click)="updateStatus('REJECTED')"
                class="btn btn-sm btn-outline text-red-600 border-red-200 hover:bg-red-50"
              >
                Reject Claim
              </button>
              <button
                *ngIf="returnReq.status === 'APPROVED' || returnReq.status === 'PICKUP_PENDING'"
                (click)="updateStatus('REFUNDED')"
                class="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Issue INR Refund
              </button>
            </div>
          </div>

          <!-- Product Details Card -->
          <div class="space-y-4 text-xs">
            <h3 class="font-bold text-slate-900 text-sm">Returned Product Information</h3>
            <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <img [src]="returnReq.productImage" class="w-16 h-16 rounded-xl object-cover bg-white border border-slate-200 shrink-0" />
              <div>
                <h4 class="font-bold text-slate-900 text-sm">{{ returnReq.productName }}</h4>
                <p class="text-slate-500">Quantity Returned: <strong>{{ returnReq.quantity }}</strong></p>
              </div>
            </div>

            <div class="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-1 text-slate-700">
              <div class="font-bold text-amber-950">Customer Claim Reason:</div>
              <p class="italic">"{{ returnReq.reason }}"</p>
            </div>

            <div class="flex justify-between items-center pt-2 border-t border-slate-100 font-extrabold text-sm">
              <span>Refund Amount Calculated:</span>
              <span class="text-indigo-600 text-base">{{ formatInr(returnReq.refundAmount) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminReturnDetailComponent implements OnInit {
  formatInr = formatInr;
  returnId: string | null = null;
  returnReq: ReturnRequest | null = null;

  constructor(
    private route: ActivatedRoute,
    private returnService: ReturnService,
    private toastService: ToastService,
    private activityLogService: ActivityLogService
  ) {}

  ngOnInit(): void {
    this.returnId = this.route.snapshot.paramMap.get('id');
    if (this.returnId) {
      this.returnService.getReturnById(this.returnId).subscribe((r) => {
        if (r) this.returnReq = r;
      });
    }
  }

  updateStatus(newStatus: ReturnStatus): void {
    if (!this.returnReq) return;
    this.returnService.updateReturnStatus(this.returnReq.id, newStatus).subscribe((updated) => {
      if (updated) {
        this.returnReq = updated;
        this.activityLogService.logActivity(
          `RETURN_${newStatus}`,
          'RETURN',
          this.returnReq.id,
          `Updated status for return claim ${this.returnReq.returnNumber} to ${newStatus}.`
        );
      }
    });
  }
}
