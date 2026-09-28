import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivityLogService, AdminActivity } from '../../../core/services/activity-log.service';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';

@Component({
  selector: 'app-admin-activity',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent, PaginationComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Admin Governance Audit Log</h1>
          <p class="text-xs text-slate-500 mt-1">Immutably recorded platform actions, seller approvals, and stock audit history ({{ activities.length }} entries)</p>
        </div>
      </div>

      <!-- Activity Table -->
      <div class="card bg-white p-6 space-y-4 border border-slate-200">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Admin Operator</th>
                <th>Action Type</th>
                <th>Entity Type</th>
                <th>Entity ID</th>
                <th>Audit Description</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let act of paginatedActivities">
                <td class="text-xs text-slate-500 whitespace-nowrap">{{ act.createdAt | date:'medium' }}</td>
                <td class="font-bold text-slate-900 text-xs">{{ act.adminName }}</td>
                <td>
                  <span
                    class="badge text-[10px]"
                    [ngClass]="{
                      'badge-success': act.action.includes('APPROVED') || act.action.includes('CREATED'),
                      'badge-warning': act.action.includes('UPDATED') || act.action.includes('MODERATED'),
                      'bg-red-50 text-red-700 border-red-200': act.action.includes('SUSPENDED') || act.action.includes('BLOCKED')
                    }"
                  >
                    {{ act.action }}
                  </span>
                </td>
                <td class="text-xs font-semibold text-slate-700">{{ act.entityType }}</td>
                <td class="font-mono text-xs text-slate-500">{{ act.entityId }}</td>
                <td class="text-xs text-slate-600 max-w-sm">{{ act.description }}</td>
              </tr>
              <tr *ngIf="activities.length === 0">
                <td colspan="6" class="text-center py-8 text-slate-400 text-xs">No admin activity logs recorded yet.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Universal Pagination -->
        <app-pagination
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="activities.length"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
})
export class AdminActivityComponent implements OnInit {
  activities: AdminActivity[] = [];
  paginatedActivities: AdminActivity[] = [];
  currentPage = 1;
  pageSize = 10;

  constructor(private activityLogService: ActivityLogService) {}

  ngOnInit(): void {
    this.activityLogService.getActivities().subscribe((res) => {
      this.activities = res;
      this.paginate();
    });
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedActivities = this.activities.slice(start, start + this.pageSize);
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
