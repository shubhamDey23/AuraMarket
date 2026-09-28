import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="pointer-events-auto p-4 rounded-lg shadow-lg border flex items-start gap-3 transform transition-all duration-300 animate-slide-in bg-white"
        [ngClass]="{
          'border-emerald-200 text-emerald-950': toast.type === 'success',
          'border-red-200 text-red-950': toast.type === 'error',
          'border-indigo-200 text-indigo-950': toast.type === 'info',
          'border-amber-200 text-amber-950': toast.type === 'warning'
        }"
      >
        <div [ngSwitch]="toast.type" class="mt-0.5">
          <app-icon *ngSwitchCase="'success'" name="check" [size]="18" customClass="text-emerald-600"></app-icon>
          <app-icon *ngSwitchCase="'error'" name="x" [size]="18" customClass="text-red-600"></app-icon>
          <app-icon *ngSwitchCase="'info'" name="bell" [size]="18" customClass="text-indigo-600"></app-icon>
          <app-icon *ngSwitchCase="'warning'" name="bell" [size]="18" customClass="text-amber-600"></app-icon>
        </div>
        <div class="flex-1">
          <div *ngIf="toast.title" class="font-semibold text-sm">{{ toast.title }}</div>
          <div class="text-xs mt-0.5 opacity-90">{{ toast.message }}</div>
        </div>
        <button (click)="toastService.remove(toast.id)" class="opacity-60 hover:opacity-100 text-slate-500">
          <app-icon name="x" [size]="16"></app-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { transform: translateY(1rem); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-in {
      animation: slideIn 0.25s ease-out forwards;
    }
  `],
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
