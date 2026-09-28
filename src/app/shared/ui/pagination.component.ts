import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppIconComponent } from '../components/app-icon.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule, AppIconComponent],
  template: `
    <div *ngIf="totalItems > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-2 border-t border-slate-200 text-xs text-slate-600">
      <!-- Info & Page Size Picker -->
      <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <span class="font-medium">
          Showing <strong class="text-slate-900 font-semibold">{{ startItem }}–{{ endItem }}</strong> of <strong class="text-slate-900 font-semibold">{{ totalItems }}</strong>
        </span>

        <div *ngIf="showPageSizeSelector" class="flex items-center gap-1.5 border-l border-slate-200 pl-3">
          <span class="text-slate-500 hidden sm:inline">Per page:</span>
          <select
            [ngModel]="pageSize"
            (ngModelChange)="onPageSizeChange($event)"
            class="bg-slate-100 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option *ngFor="let size of pageSizeOptions" [value]="size">{{ size }}</option>
          </select>
        </div>
      </div>

      <!-- Desktop Pagination Controls -->
      <div *ngIf="calculatedTotalPages > 1" class="hidden sm:flex items-center gap-1">
        <button
          (click)="onPage(currentPage - 1)"
          [disabled]="currentPage === 1"
          class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-1"
          title="Previous Page"
        >
          <app-icon name="arrow-left" [size]="14"></app-icon> Prev
        </button>

        <ng-container *ngFor="let p of pageNumbers">
          <button
            *ngIf="p !== -1"
            (click)="onPage(p)"
            class="w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all"
            [ngClass]="p === currentPage ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:bg-slate-100'"
          >
            {{ p }}
          </button>
          <span *ngIf="p === -1" class="w-6 text-center text-slate-400 font-bold select-none">...</span>
        </ng-container>

        <button
          (click)="onPage(currentPage + 1)"
          [disabled]="currentPage === calculatedTotalPages"
          class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-1"
          title="Next Page"
        >
          Next <app-icon name="arrow-right" [size]="14"></app-icon>
        </button>
      </div>

      <!-- Mobile Compact Controls -->
      <div *ngIf="calculatedTotalPages > 1" class="flex sm:hidden items-center justify-between w-full pt-1 border-t border-slate-100">
        <button
          (click)="onPage(currentPage - 1)"
          [disabled]="currentPage === 1"
          class="px-3 py-1.5 rounded-md border border-slate-200 disabled:opacity-40 font-medium"
        >
          ← Prev
        </button>
        <span class="font-semibold text-slate-800">Page {{ currentPage }} of {{ calculatedTotalPages }}</span>
        <button
          (click)="onPage(currentPage + 1)"
          [disabled]="currentPage === calculatedTotalPages"
          class="px-3 py-1.5 rounded-md border border-slate-200 disabled:opacity-40 font-medium"
        >
          Next →
        </button>
      </div>
    </div>
  `,
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() totalItems = 0;
  @Input() totalPages?: number; // Optional explicit totalPages override
  @Input() showPageSizeSelector = true;
  @Input() pageSizeOptions: number[] = [10, 20, 25, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  get calculatedTotalPages(): number {
    if (this.totalPages !== undefined && this.totalPages > 0) {
      return this.totalPages;
    }
    return Math.max(1, Math.ceil(this.totalItems / (this.pageSize || 10)));
  }

  get startItem(): number {
    if (this.totalItems === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get pageNumbers(): number[] {
    const total = this.calculatedTotalPages;
    const current = this.currentPage;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: number[] = [];
    pages.push(1);

    if (current > 3) {
      pages.push(-1); // ellipsis
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push(-1); // ellipsis
    }

    pages.push(total);
    return pages;
  }

  onPage(page: number): void {
    if (page >= 1 && page <= this.calculatedTotalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(newSize: number): void {
    const numSize = Number(newSize);
    if (numSize !== this.pageSize) {
      this.pageSizeChange.emit(numSize);
      this.pageChange.emit(1); // Auto reset to page 1 on page size change
    }
  }
}
