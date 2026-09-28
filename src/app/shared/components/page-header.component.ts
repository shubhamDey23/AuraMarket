import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div *ngIf="breadcrumbs && breadcrumbs.length" class="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
          <ng-container *ngFor="let item of breadcrumbs; let last = last">
            <span *ngIf="!last"><a [href]="item.link" class="hover:text-indigo-600">{{ item.label }}</a> /</span>
            <span *ngIf="last" class="font-medium text-slate-700">{{ item.label }}</span>
          </ng-container>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">{{ title }}</h1>
        <p *ngIf="subtitle" class="text-sm text-slate-500 mt-1">{{ subtitle }}</p>
      </div>
      <div class="flex items-center gap-3">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() breadcrumbs?: BreadcrumbItem[];
}
