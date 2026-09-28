import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="type === 'card'" class="card bg-white p-4 space-y-4 animate-pulse">
      <div class="w-full aspect-square bg-slate-200 rounded-xl"></div>
      <div class="space-y-2">
        <div class="h-3 bg-slate-200 rounded w-1/3"></div>
        <div class="h-4 bg-slate-200 rounded w-5/6"></div>
        <div class="h-3 bg-slate-200 rounded w-1/2"></div>
      </div>
      <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div class="h-5 bg-slate-200 rounded w-1/3"></div>
        <div class="h-8 bg-slate-200 rounded w-16"></div>
      </div>
    </div>

    <div *ngIf="type === 'grid'" class="grid-products">
      <app-product-skeleton type="card" *ngFor="let i of [1,2,3,4,5,6,7,8]"></app-product-skeleton>
    </div>

    <div *ngIf="type === 'detail'" class="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-8 rounded-2xl border border-slate-200 animate-pulse">
      <div class="w-full aspect-square bg-slate-200 rounded-2xl"></div>
      <div class="space-y-6">
        <div class="h-4 bg-slate-200 rounded w-1/4"></div>
        <div class="h-8 bg-slate-200 rounded w-3/4"></div>
        <div class="h-4 bg-slate-200 rounded w-1/2"></div>
        <div class="h-10 bg-slate-200 rounded w-1/3"></div>
        <div class="h-20 bg-slate-200 rounded w-full"></div>
        <div class="h-12 bg-slate-200 rounded w-full"></div>
      </div>
    </div>
  `,
})
export class ProductSkeletonComponent {
  @Input() type: 'card' | 'grid' | 'detail' = 'card';
}
