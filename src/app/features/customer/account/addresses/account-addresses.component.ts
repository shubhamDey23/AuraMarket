import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AddressService } from '../../../../core/services/address.service';
import { Address } from '../../../../core/models/address.model';
import { AppIconComponent } from '../../../../shared/components/app-icon.component';

@Component({
  selector: 'app-account-addresses',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent],
  template: `
    <div class="container space-y-6">
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/account" class="hover:text-indigo-600">Account</a> /
        <span class="text-slate-800 font-medium">Address Book</span>
      </nav>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Saved Addresses</h1>
          <p class="text-xs text-slate-500 mt-1">Manage delivery addresses for quick marketplace checkout</p>
        </div>
        <button (click)="openAddModal()" class="btn btn-primary flex items-center gap-1">
          <app-icon name="plus" [size]="16"></app-icon> Add New Address
        </button>
      </div>

      <!-- Address Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let addr of addressService.addresses()" class="card p-5 bg-white space-y-3 flex flex-col justify-between border border-slate-200">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="badge badge-primary text-[10px]">{{ addr.type }}</span>
              <span *ngIf="addr.isDefault" class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Default Address</span>
            </div>
            <h3 class="font-bold text-slate-900 text-sm">{{ addr.fullName }}</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              {{ addr.addressLine1 }}<span *ngIf="addr.addressLine2">, {{ addr.addressLine2 }}</span><br />
              {{ addr.city }}, {{ addr.state }} {{ addr.postalCode }}, {{ addr.country }}
            </p>
            <p class="text-xs text-slate-500">Phone: <strong>{{ addr.phone }}</strong></p>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div class="flex items-center gap-3">
              <button (click)="openEditModal(addr)" class="text-indigo-600 hover:underline font-semibold flex items-center gap-1">
                <app-icon name="edit" [size]="12"></app-icon> Edit
              </button>
              <button (click)="deleteAddress(addr.id)" class="text-red-500 hover:underline flex items-center gap-1">
                <app-icon name="trash" [size]="12"></app-icon> Delete
              </button>
            </div>

            <button *ngIf="!addr.isDefault" (click)="setDefault(addr.id)" class="text-xs text-slate-500 hover:text-slate-900 underline">
              Make Default
            </button>
          </div>
        </div>
      </div>

      <!-- Add / Edit Modal -->
      <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-base">{{ editingId ? 'Edit Address' : 'Add New Address' }}</h3>
            <button (click)="isModalOpen = false" class="text-slate-400"><app-icon name="x" [size]="20"></app-icon></button>
          </div>

          <div class="space-y-3 text-xs">
            <div class="form-group"><label class="form-label">Full Name</label><input type="text" [(ngModel)]="formData.fullName" class="form-input" /></div>
            <div class="form-group"><label class="form-label">Phone Number</label><input type="text" [(ngModel)]="formData.phone" class="form-input" /></div>
            <div class="form-group"><label class="form-label">Address Line 1</label><input type="text" [(ngModel)]="formData.addressLine1" class="form-input" /></div>
            <div class="grid grid-cols-2 gap-3">
              <div class="form-group"><label class="form-label">City</label><input type="text" [(ngModel)]="formData.city" class="form-input" /></div>
              <div class="form-group"><label class="form-label">State</label><input type="text" [(ngModel)]="formData.state" class="form-input" /></div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="form-group"><label class="form-label">PIN Code</label><input type="text" [(ngModel)]="formData.postalCode" class="form-input" placeholder="e.g. 834001" /></div>
              <div class="form-group">
                <label class="form-label">Address Type</label>
                <select [(ngModel)]="formData.type" class="form-select">
                  <option value="HOME">HOME</option>
                  <option value="WORK">WORK</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
            </div>
            <label class="flex items-center gap-2 cursor-pointer pt-1">
              <input type="checkbox" [(ngModel)]="formData.isDefault" />
              <span>Set as default shipping address</span>
            </label>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button (click)="isModalOpen = false" class="btn btn-sm btn-outline">Cancel</button>
            <button (click)="saveAddress()" class="btn btn-sm btn-primary">Save Address</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AccountAddressesComponent {
  isModalOpen = false;
  editingId: string | null = null;

  formData: Omit<Address, 'id'> = {
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    type: 'HOME',
    isDefault: false,
  };

  constructor(public addressService: AddressService) {}

  openAddModal(): void {
    this.editingId = null;
    this.formData = {
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      type: 'HOME',
      isDefault: false,
    };
    this.isModalOpen = true;
  }

  openEditModal(addr: Address): void {
    this.editingId = addr.id;
    const { id, ...rest } = addr;
    this.formData = { ...rest };
    this.isModalOpen = true;
  }

  setDefault(id: string): void {
    this.addressService.setDefaultAddress(id);
  }

  deleteAddress(id: string): void {
    this.addressService.deleteAddress(id);
  }

  saveAddress(): void {
    if (this.editingId) {
      this.addressService.updateAddress(this.editingId, this.formData);
    } else {
      this.addressService.addAddress(this.formData);
    }
    this.isModalOpen = false;
  }
}
