import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="card p-5 bg-white flex items-start justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{{ title }}</p>
        <h3 class="text-2xl font-bold text-slate-900 tracking-tight">{{ value }}</h3>
        <div *ngIf="change" class="flex items-center gap-1 mt-2 text-xs font-medium" [ngClass]="isPositive ? 'text-emerald-600' : 'text-red-600'">
          <app-icon [name]="isPositive ? 'trending-up' : 'chevron-down'" [size]="14"></app-icon>
          <span>{{ change }}</span>
          <span class="text-slate-400 font-normal ml-1">vs last period</span>
        </div>
      </div>
      <div class="p-3 rounded-xl" [ngClass]="iconBgClass || 'bg-indigo-50 text-indigo-600'">
        <app-icon [name]="icon" [size]="22"></app-icon>
      </div>
    </div>
  `,
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() change?: string;
  @Input() isPositive = true;
  @Input() icon = 'trending-up';
  @Input() iconBgClass = '';
}
