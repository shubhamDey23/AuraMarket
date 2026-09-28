import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatus } from '../../core/models/order.model';

@Component({
  selector: 'app-order-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider"
      [ngClass]="{
        'bg-emerald-100 text-emerald-800 border border-emerald-200': status === 'DELIVERED',
        'bg-sky-100 text-sky-800 border border-sky-200': status === 'SHIPPED',
        'bg-indigo-100 text-indigo-800 border border-indigo-200': status === 'PROCESSING',
        'bg-amber-100 text-amber-800 border border-amber-200': status === 'CONFIRMED' || status === 'PENDING',
        'bg-red-100 text-red-800 border border-red-200': status === 'CANCELLED' || status === 'RETURNED'
      }"
    >
      {{ status }}
    </span>
  `,
})
export class OrderStatusBadgeComponent {
  @Input() status: OrderStatus = 'PENDING';
}
