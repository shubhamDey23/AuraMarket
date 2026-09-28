import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="card p-12 text-center flex flex-col items-center justify-center bg-white my-6">
      <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <app-icon [name]="icon" [size]="32"></app-icon>
      </div>
      <h3 class="text-lg font-bold text-slate-900 mb-1">{{ title }}</h3>
      <p class="text-sm text-slate-500 max-w-sm mb-6">{{ description }}</p>
      <button *ngIf="actionLabel" (click)="action.emit()" class="btn btn-primary">
        {{ actionLabel }}
      </button>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon = 'package';
  @Input() title = 'No data available';
  @Input() description = 'There are no items matching your criteria at this moment.';
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();
}
