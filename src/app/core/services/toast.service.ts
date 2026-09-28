import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly toasts = signal<ToastMessage[]>([]);

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', title?: string, duration = 4000): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const toast: ToastMessage = { id, type, title, message, duration };
    this.toasts.update((current) => [...current, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, title?: string): void {
    this.show(message, 'success', title);
  }

  error(message: string, title?: string): void {
    this.show(message, 'error', title);
  }

  info(message: string, title?: string): void {
    this.show(message, 'info', title);
  }

  warning(message: string, title?: string): void {
    this.show(message, 'warning', title);
  }

  remove(id: string): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
