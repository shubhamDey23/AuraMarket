import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatus } from '../../core/models/order.model';
import { AppIconComponent } from '../components/app-icon.component';

export interface TimelineStep {
  key: OrderStatus;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-order-tracking-timeline',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div *ngIf="status === 'CANCELLED'" class="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-900 text-xs">
      <app-icon name="x" [size]="20" customClass="text-red-600"></app-icon>
      <div>
        <div class="font-bold">This order has been cancelled.</div>
        <div class="text-red-700 mt-0.5">Refund processing (if paid) is being handled by the marketplace platform.</div>
      </div>
    </div>

    <div *ngIf="status !== 'CANCELLED'" class="relative py-4">
      <div class="flex items-center justify-between w-full relative z-10">
        <ng-container *ngFor="let step of steps; let idx = index; let last = last">
          <!-- Step Item -->
          <div class="flex flex-col items-center text-center flex-1">
            <!-- Icon Bubble -->
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-xs mb-2"
              [ngClass]="getStepClass(step.key, idx)"
            >
              <app-icon [name]="step.icon" [size]="18"></app-icon>
            </div>

            <!-- Label -->
            <span class="text-xs font-bold" [ngClass]="isStepActiveOrCompleted(step.key, idx) ? 'text-slate-900' : 'text-slate-400'">
              {{ step.label }}
            </span>
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
export class OrderTrackingTimelineComponent {
  @Input() status: OrderStatus = 'CONFIRMED';
  @Input() date?: string;

  steps: TimelineStep[] = [
    { key: 'PENDING', label: 'Order Placed', icon: 'shopping-cart' },
    { key: 'CONFIRMED', label: 'Confirmed', icon: 'check' },
    { key: 'PROCESSING', label: 'Processing', icon: 'package' },
    { key: 'SHIPPED', label: 'Shipped', icon: 'truck' },
    { key: 'DELIVERED', label: 'Delivered', icon: 'home' },
  ];

  private statusOrder: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

  getCurrentStepIndex(): number {
    const idx = this.statusOrder.indexOf(this.status);
    return idx >= 0 ? idx : 1;
  }

  isStepActiveOrCompleted(stepKey: OrderStatus, idx: number): boolean {
    return idx <= this.getCurrentStepIndex();
  }

  getStepClass(stepKey: OrderStatus, idx: number): string {
    const currentIdx = this.getCurrentStepIndex();
    if (idx < currentIdx) {
      return 'bg-emerald-600 text-white shadow-emerald-200'; // Completed
    }
    if (idx === currentIdx) {
      return 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-indigo-200 scale-110'; // Active
    }
    return 'bg-slate-100 text-slate-400'; // Future
  }
}
