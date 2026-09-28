import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { AppIconComponent } from '../../../shared/components/app-icon.component';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AppIconComponent],
  template: `
    <div class="container space-y-6 max-w-3xl">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/admin/dashboard" class="hover:text-indigo-600">Admin Console</a> /
        <span class="text-slate-800 font-medium">Platform Settings</span>
      </nav>

      <!-- Settings Card -->
      <div class="card p-6 sm:p-8 bg-white space-y-6 border border-slate-200">
        <div class="border-b border-slate-100 pb-3">
          <h1 class="text-2xl font-bold text-slate-900">Platform Global Configuration</h1>
          <p class="text-xs text-slate-500 mt-1">Configure marketplace branding, tax rates, seller commission, and operational thresholds</p>
        </div>

        <div class="space-y-6 text-xs">
          <!-- General Settings -->
          <div class="space-y-4">
            <h3 class="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">1. General Marketplace Settings</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Marketplace Platform Name</label>
                <input type="text" [(ngModel)]="marketplaceName" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">Platform Operating Currency</label>
                <select [(ngModel)]="currency" class="form-select">
                  <option value="INR">INR (₹ - Indian Rupee)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Financial & Commission Settings -->
          <div class="space-y-4 pt-4 border-t border-slate-100">
            <h3 class="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">2. Financial & Seller Commission Rules</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Default Seller Platform Commission (%)</label>
                <input type="number" [(ngModel)]="platformCommissionRate" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">Standard Marketplace Tax Rate (GST %)</label>
                <input type="number" [(ngModel)]="defaultTaxRate" class="form-input" />
              </div>
            </div>
          </div>

          <!-- Inventory Thresholds -->
          <div class="space-y-4 pt-4 border-t border-slate-100">
            <h3 class="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">3. Inventory & Operations</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Global Low Stock Threshold</label>
                <input type="number" [(ngModel)]="lowStockThreshold" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">Free Shipping Qualification Threshold (₹)</label>
                <input type="number" [(ngModel)]="freeShippingThreshold" class="form-input" />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button (click)="saveSettings()" class="btn btn-primary">Save Platform Configuration</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminSettingsComponent {
  marketplaceName = 'AuraMarket E-Commerce';
  currency = 'INR';
  platformCommissionRate = 5.0;
  defaultTaxRate = 18.0;
  lowStockThreshold = 10;
  freeShippingThreshold = 999.0;

  constructor(
    private toastService: ToastService,
    private activityLogService: ActivityLogService
  ) {}

  saveSettings(): void {
    this.toastService.success('Platform global configuration updated!');
    this.activityLogService.logActivity(
      'SETTINGS_UPDATED',
      'SETTING',
      'global-settings',
      'Updated marketplace global financial & operational configuration.'
    );
  }
}
