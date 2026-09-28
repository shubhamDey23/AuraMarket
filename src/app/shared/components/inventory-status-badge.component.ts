import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryStatus } from '../../core/models/inventory.model';

@Component({
  selector: 'app-inventory-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider"
      [ngClass]="{
        'bg-emerald-100 text-emerald-800': status === 'IN_STOCK',
        'bg-amber-100 text-amber-800': status === 'LOW_STOCK',
        'bg-red-100 text-red-800': status === 'OUT_OF_STOCK',
        'bg-slate-100 text-slate-700': status === 'DISABLED'
      }"
    >
      <span
        class="w-1.5 h-1.5 rounded-full"
        [ngClass]="{
          'bg-emerald-500': status === 'IN_STOCK',
          'bg-amber-500': status === 'LOW_STOCK',
          'bg-red-500': status === 'OUT_OF_STOCK',
          'bg-slate-400': status === 'DISABLED'
        }"
      ></span>
      {{ status ? status.replace('_', ' ') : 'UNKNOWN' }}
    </span>
  `,
})
export class InventoryStatusBadgeComponent {
  @Input() status: InventoryStatus = 'IN_STOCK';
}
