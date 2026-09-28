import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MOCK_CATEGORIES } from '../../../data/mock/categories.mock';
import { Category } from '../../../core/models/category.model';
import { ToastService } from '../../../core/services/toast.service';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { AppIconComponent } from '../../../shared/components/app-icon.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AppIconComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Category Hierarchy Management</h1>
          <p class="text-xs text-slate-500 mt-1">Manage product taxonomy and departmental categories ({{ categories.length }} total)</p>
        </div>
        <button (click)="openAddModal()" class="btn btn-primary flex items-center gap-1">
          <app-icon name="plus" [size]="16"></app-icon> Add New Category
        </button>
      </div>

      <!-- Categories Table -->
      <div class="card bg-white p-6 space-y-4 border border-slate-200">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Parent Category</th>
                <th>Products Count</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let cat of categories">
                <td>
                  <div class="flex items-center gap-3">
                    <img [src]="cat.image" class="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0" />
                    <div>
                      <div class="font-bold text-slate-900 text-xs">{{ cat.name }}</div>
                      <div class="text-[10px] text-slate-400 font-mono">{{ cat.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="font-mono text-xs text-slate-600">{{ cat.slug }}</td>
                <td class="text-xs text-slate-600 font-medium">{{ getParentName(cat.parentCategoryId) }}</td>
                <td class="font-bold text-xs text-slate-900">{{ cat.productCount || 42 }} products</td>
                <td>
                  <span class="badge text-[10px]" [ngClass]="cat.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'">
                    {{ cat.status || 'ACTIVE' }}
                  </span>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <button (click)="openEditModal(cat)" class="btn btn-xs btn-outline">Edit</button>
                    <button (click)="toggleStatus(cat)" class="text-xs text-amber-600 font-semibold hover:underline">
                      {{ cat.status === 'INACTIVE' ? 'Activate' : 'Deactivate' }}
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
            <h3 class="font-bold text-slate-900 text-base">{{ editingId ? 'Edit Category' : 'Add New Category' }}</h3>
            <button (click)="isModalOpen = false" class="text-slate-400"><app-icon name="x" [size]="20"></app-icon></button>
          </div>

          <div class="space-y-3">
            <div class="form-group">
              <label class="form-label">Category Name *</label>
              <input type="text" [(ngModel)]="formData.name" class="form-input" placeholder="e.g. Smart Wearables" />
            </div>

            <div class="form-group">
              <label class="form-label">Parent Category (Optional)</label>
              <select [(ngModel)]="formData.parentCategoryId" class="form-select">
                <option [ngValue]="undefined">Top-Level Category (None)</option>
                <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Image URL</label>
              <input type="text" [(ngModel)]="formData.image" class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea [(ngModel)]="formData.description" class="form-textarea" rows="3"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button (click)="isModalOpen = false" class="btn btn-sm btn-outline">Cancel</button>
            <button (click)="saveCategory()" class="btn btn-sm btn-primary">Save Category</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminCategoriesComponent {
  categories: Category[] = [...MOCK_CATEGORIES];
  isModalOpen = false;
  editingId: string | null = null;

  formData: Partial<Category> = {
    name: '',
    parentCategoryId: undefined,
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=300',
    description: '',
    status: 'ACTIVE',
  };

  constructor(
    private toastService: ToastService,
    private activityLogService: ActivityLogService
  ) {}

  getParentName(parentId?: string): string {
    if (!parentId) return 'None (Top Level)';
    const parent = this.categories.find((c) => c.id === parentId);
    return parent ? parent.name : 'None';
  }

  openAddModal(): void {
    this.editingId = null;
    this.formData = {
      name: '',
      parentCategoryId: undefined,
      image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=300',
      description: '',
      status: 'ACTIVE',
    };
    this.isModalOpen = true;
  }

  openEditModal(cat: Category): void {
    this.editingId = cat.id;
    this.formData = { ...cat };
    this.isModalOpen = true;
  }

  toggleStatus(cat: Category): void {
    cat.status = cat.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
    this.toastService.info(`Category "${cat.name}" status updated to ${cat.status}.`);
    this.activityLogService.logActivity(
      'CATEGORY_UPDATED',
      'SETTING',
      cat.id,
      `Toggled status for category "${cat.name}" to ${cat.status}.`
    );
  }

  saveCategory(): void {
    if (!this.formData.name?.trim()) return;

    if (this.editingId) {
      const idx = this.categories.findIndex((c) => c.id === this.editingId);
      if (idx !== -1) {
        this.categories[idx] = { ...this.categories[idx], ...this.formData };
        this.toastService.success('Category updated successfully!');
      }
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: this.formData.name,
        slug: this.formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: this.formData.description || '',
        imageUrl: this.formData.image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=300',
        image: this.formData.image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=300',
        icon: 'folder',
        parentCategoryId: this.formData.parentCategoryId,
        status: 'ACTIVE',
        productCount: 0,
        isFeatured: false,
        order: this.categories.length + 1,
      };
      this.categories.unshift(newCat);
      this.toastService.success(`Category "${newCat.name}" created successfully!`);
      this.activityLogService.logActivity(
        'CATEGORY_CREATED',
        'SETTING',
        newCat.id,
        `Created category "${newCat.name}".`
      );
    }
    this.isModalOpen = false;
  }
}
