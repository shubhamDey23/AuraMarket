import { Injectable, signal } from '@angular/core';

export type NotificationType = 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly notifications = signal<AppNotification[]>([
    {
      id: 'notif-1',
      type: 'SUCCESS',
      title: 'Welcome to AuraMarket',
      message: 'Your marketplace session has been initialized with Indian Rupees (₹) localization.',
      timestamp: 'Just now',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'INFO',
      title: 'Order Status Update',
      message: 'Order #AM10001 has been dispatched by seller Aura Electronics.',
      timestamp: '10m ago',
      read: false,
    },
  ]);

  readonly unreadCount = signal<number>(2);

  show(type: NotificationType, title: string, message: string): void {
    const item: AppNotification = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      timestamp: 'Just now',
      read: false,
    };
    this.notifications.update((list) => [item, ...list]);
    this.unreadCount.update((cnt) => cnt + 1);
  }

  success(title: string, message: string): void {
    this.show('SUCCESS', title, message);
  }

  info(title: string, message: string): void {
    this.show('INFO', title, message);
  }

  warning(title: string, message: string): void {
    this.show('WARNING', title, message);
  }

  error(title: string, message: string): void {
    this.show('ERROR', title, message);
  }

  markAllAsRead(): void {
    this.notifications.update((list) => list.map((n) => ({ ...n, read: true })));
    this.unreadCount.set(0);
  }

  clear(): void {
    this.notifications.set([]);
    this.unreadCount.set(0);
  }
}
