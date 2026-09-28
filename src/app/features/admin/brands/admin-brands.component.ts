import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MOCK_BRANDS } from '../../../data/mock/brands.mock';
import { Brand } from '../../../core/models/brand.model';
import { ToastService } from '../../../core/services/toast.service';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { AppIconComponent } from '../../../shared/components/app-icon.component';

@Component({
  selector: 'app-admin-brands',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AppIconComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Brand Registry Management</h1>
          <p class="text-xs text-slate-500 mt-1">Manage brand profiles, logos, and status ({{ brands.length }} total)</p>
        </div>
        <button (click)="openAddModal()" class="btn btn-primary flex items-center gap-1">
          <app-icon name="plus" [size]="16"></app-icon> Add New Brand
        </button>
      </div>

      <!-- Brands Table -->
      <div class="card bg-white p-6 space-y-4 border border-slate-200">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Brand Logo</th>
                <th>Brand Name</th>
                <th>Slug</th>
                <th>Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let brand of brands">
                <td>
                  <img [src]="brand.logo" class="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0" />
                </td>
                <td class="font-bold text-slate-900 text-xs">{{ brand.name }}</td>
                <td class="font-mono text-xs text-slate-600">{{ brand.slug }}</td>
                <td class="font-bold text-xs text-slate-900">{{ brand.productCount || 18 }} products</td>
                <td>
                  <span class="badge text-[10px]" [ngClass]="brand.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'">
                    {{ brand.status || 'ACTIVE' }}
                  </span>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <button (click)="openEditModal(brand)" class="btn btn-xs btn-outline">Edit</button>
                    <button (click)="toggleStatus(brand)" class="text-xs text-amber-600 font-semibold hover:underline">
                      {{ brand.status === 'INACTIVE' ? 'Activate' : 'Deactivate' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-xs">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-base">{{ editingId ? 'Edit Brand' : 'Add New Brand' }}</h3>
            <button (click)="isModalOpen = false" class="text-slate-400"><app-icon name="x" [size]="20"></app-icon></button>
          </div>

          <div class="space-y-3">
            <div class="form-group">
              <label class="form-label">Brand Name *</label>
              <input type="text" [(ngModel)]="formData.name" class="form-input" placeholder="e.g. Apex Audio" />
            </div>

            <div class="form-group">
              <label class="form-label">Logo URL</label>
              <input type="text" [(ngModel)]="formData.logo" class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea [(ngModel)]="formData.description" class="form-textarea" rows="3"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button (click)="isModalOpen = false" class="btn btn-sm btn-outline">Cancel</button>
            <button (click)="saveBrand()" class="btn btn-sm btn-primary">Save Brand</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminBrandsComponent {
  brands: Brand[] = [...MOCK_BRANDS];
  isModalOpen = false;
  editingId: string | null = null;

  formData: Partial<Brand> = {
    name: '',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    description: '',
    status: 'ACTIVE',
  };

  constructor(
    private toastService: ToastService,
    private activityLogService: ActivityLogService
  ) {}

  openAddModal(): void {
    this.editingId = null;
    this.formData = {
      name: '',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      description: '',
      status: 'ACTIVE',
    };
    this.isModalOpen = true;
  }

  openEditModal(brand: Brand): void {
    this.editingId = brand.id;
    this.formData = { ...brand };
    this.isModalOpen = true;
  }

  toggleStatus(brand: Brand): void {
    brand.status = brand.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
    this.toastService.info(`Brand "${brand.name}" status updated to ${brand.status}.`);
    this.activityLogService.logActivity(
      'BRAND_UPDATED',
      'SETTING',
      brand.id,
      `Toggled status for brand "${brand.name}" to ${brand.status}.`
    );
  }

  saveBrand(): void {
    if (!this.formData.name?.trim()) return;

    if (this.editingId) {
      const idx = this.brands.findIndex((b) => b.id === this.editingId);
      if (idx !== -1) {
        this.brands[idx] = { ...this.brands[idx], ...this.formData };
        this.toastService.success('Brand updated successfully!');
      }
    } else {
      const newBrand: Brand = {
        id: `brand-${Date.now()}`,
        name: this.formData.name,
        slug: this.formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: this.formData.description || '',
        logoUrl: this.formData.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
        logo: this.formData.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
        status: 'ACTIVE',
        productCount: 0,
        isFeatured: false,
      };
      this.brands.unshift(newBrand);
      this.toastService.success(`Brand "${newBrand.name}" created successfully!`);
      this.activityLogService.logActivity(
        'BRAND_CREATED',
        'SETTING',
        newBrand.id,
        `Created brand "${newBrand.name}".`
      );
    }
    this.isModalOpen = false;
  }
}
