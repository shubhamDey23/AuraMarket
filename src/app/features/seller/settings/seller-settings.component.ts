import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
@Component({
  selector: 'app-seller-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container space-y-6 max-w-3xl">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/seller/dashboard" class="hover:text-indigo-600">Seller Portal</a> /
        <span class="text-slate-800 font-medium">Store Settings</span>
      </nav>

      <!-- Settings Card -->
      <div class="card p-6 sm:p-8 bg-white space-y-6 border border-slate-200">
        <div class="border-b border-slate-100 pb-3">
          <h1 class="text-2xl font-bold text-slate-900">Store Settings & Preferences</h1>
          <p class="text-xs text-slate-500 mt-1">
            Configure notification alerts and fulfillment preferences for <strong>{{ authService.currentSeller().storeName }}</strong>
          </p>
        </div>

        <div class="space-y-6 text-xs">
          <!-- Notification Preferences -->
          <div class="space-y-3">
            <h3 class="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">1. Notification Preferences</h3>
            <label class="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
              <div>
                <div class="font-bold text-slate-900">New Order Email Alerts</div>
                <div class="text-slate-500 text-[11px]">Receive real-time email notifications when a customer purchases your store items.</div>
              </div>
              <input type="checkbox" [(ngModel)]="emailNotifications" class="toggle" />
            </label>

            <label class="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
              <div>
                <div class="font-bold text-slate-900">Low Stock Warning Alerts</div>
                <div class="text-slate-500 text-[11px]">Get alerted when available stock drops below reorder thresholds.</div>
              </div>
              <input type="checkbox" [(ngModel)]="lowStockAlerts" class="toggle" />
            </label>
          </div>

          <!-- Fulfillment Settings -->
          <div class="space-y-3 pt-4 border-t border-slate-100">
            <h3 class="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">2. Fulfillment Preferences</h3>
            <div class="form-group">
              <label class="form-label">Default Preferred Carrier Partner</label>
              <select [(ngModel)]="defaultCarrier" class="form-select">
                <option value="FedEx Express">FedEx Express Logistics</option>
                <option value="DHL Express">DHL Express Global</option>
                <option value="AuraMarket Express">AuraMarket Managed Shipping</option>
              </select>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button (click)="saveSettings()" class="btn btn-primary">Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SellerSettingsComponent {
  emailNotifications = true;
  lowStockAlerts = true;
  defaultCarrier = 'FedEx Express';

  constructor(
    public authService: AuthService,
    private toastService: ToastService
  ) {}

  saveSettings(): void {
    this.toastService.success('Store preferences saved successfully!');
  }
}
