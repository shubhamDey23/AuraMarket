import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="relative">
      <!-- Bell Button Trigger -->
      <button
        (click)="toggleMenu()"
        class="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        title="Notifications"
      >
        <app-icon name="bell" [size]="20"></app-icon>
        <span
          *ngIf="notificationService.unreadCount() > 0"
          class="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse"
        >
          {{ notificationService.unreadCount() }}
        </span>
      </button>

      <!-- Dropdown Popup -->
      <div
        *ngIf="isOpen"
        class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden space-y-0"
      >
        <!-- Header -->
        <div class="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="font-extrabold text-slate-900 text-sm">Notifications</h3>
            <span class="badge badge-primary text-[10px]">{{ notificationService.unreadCount() }} unread</span>
          </div>
          <button (click)="notificationService.markAllAsRead()" class="text-xs text-indigo-600 font-bold hover:underline">
            Mark all read
          </button>
        </div>

        <!-- Notification List -->
        <div class="max-h-80 overflow-y-auto divide-y divide-slate-100">
          <div
            *ngFor="let item of notificationService.notifications()"
            class="p-4 flex items-start gap-3 hover:bg-slate-50/80 transition-colors"
            [ngClass]="!item.read ? 'bg-indigo-50/30' : ''"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              [ngClass]="{
                'bg-emerald-100 text-emerald-600': item.type === 'SUCCESS',
                'bg-indigo-100 text-indigo-600': item.type === 'INFO',
                'bg-amber-100 text-amber-600': item.type === 'WARNING',
                'bg-red-100 text-red-600': item.type === 'ERROR'
              }"
            >
              <app-icon [name]="item.type === 'SUCCESS' ? 'check' : item.type === 'ERROR' ? 'alert-triangle' : 'bell'" [size]="14"></app-icon>
            </div>

            <div class="flex-1 space-y-0.5 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900">{{ item.title }}</span>
                <span class="text-[10px] text-slate-400">{{ item.timestamp }}</span>
              </div>
              <p class="text-slate-600 leading-relaxed">{{ item.message }}</p>
            </div>
          </div>

          <div *ngIf="notificationService.notifications().length === 0" class="p-8 text-center text-slate-400 text-xs">
            No notifications available.
          </div>
        </div>
      </div>
    </div>
  `,
})
export class NotificationDropdownComponent {
  isOpen = false;

  constructor(public notificationService: NotificationService) {}

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-notification-dropdown')) {
      this.isOpen = false;
    }
  }
}
