import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AddressService } from '../../../../core/services/address.service';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { Address } from '../../../../core/models/address.model';
import { AppIconComponent } from '../../../../shared/components/app-icon.component';

@Component({
  selector: 'app-checkout-address',
  standalone: true,
  imports: [CommonModule, FormsModule, AppIconComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Select Shipping Address</h2>
          <p class="text-xs text-slate-500 mt-0.5">Where should your multi-seller order be delivered?</p>
        </div>
        <button (click)="openAddModal()" class="btn btn-sm btn-primary flex items-center gap-1">
          <app-icon name="plus" [size]="14"></app-icon> Add New Address
        </button>
      </div>

      <!-- Address Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          *ngFor="let addr of addressService.addresses()"
          (click)="selectAddress(addr)"
          class="card p-5 cursor-pointer relative transition-all border-2 flex flex-col justify-between"
          [ngClass]="isSelected(addr) ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-300 bg-white'"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="badge badge-primary text-[10px]">{{ addr.type }}</span>
              <span *ngIf="addr.isDefault" class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Default</span>
            </div>
            <h4 class="font-bold text-slate-900 text-sm">{{ addr.fullName }}</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              {{ addr.addressLine1 }}<span *ngIf="addr.addressLine2">, {{ addr.addressLine2 }}</span><br />
              {{ addr.city }}, {{ addr.state }} {{ addr.postalCode }}, {{ addr.country }}
            </p>
            <p class="text-xs text-slate-500">Phone: <strong>{{ addr.phone }}</strong></p>
          </div>

          <div class="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
            <button (click)="openEditModal(addr, $event)" class="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1">
              <app-icon name="edit" [size]="12"></app-icon> Edit
            </button>
            <span *ngIf="isSelected(addr)" class="text-xs font-bold text-indigo-600 flex items-center gap-1">
              <app-icon name="check" [size]="14"></app-icon> Selected
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation Actions -->
      <div class="flex justify-end pt-4 border-t border-slate-200">
        <button
          (click)="proceedToDelivery()"
          [disabled]="!checkoutService.canProceedToDelivery()"
          class="btn btn-lg btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <span>Continue to Delivery</span>
          <app-icon name="arrow-right" [size]="18"></app-icon>
        </button>
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
              <div class="form-group"><label class="form-label">PIN Code</label><input type="text" [(ngModel)]="formData.postalCode" placeholder="e.g. 834001" class="form-input" /></div>
              <div class="form-group">
                <label class="form-label">Address Type</label>
                <select [(ngModel)]="formData.type" class="form-select">
                  <option value="SHIPPING">HOME</option>
                  <option value="WORK">WORK</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
            </div>
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
export class CheckoutAddressComponent implements OnInit {
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

  constructor(
    public addressService: AddressService,
    public checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const list = this.addressService.addresses();
    if (list.length > 0 && !this.checkoutService.selectedAddress()) {
      this.checkoutService.setAddress(list[0]);
    }
  }

  isSelected(addr: Address): boolean {
    return this.checkoutService.selectedAddress()?.id === addr.id;
  }

  selectAddress(addr: Address): void {
    this.checkoutService.setAddress(addr);
  }

  proceedToDelivery(): void {
    this.checkoutService.setStep(2);
    this.router.navigate(['/checkout/delivery']);
  }

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
      country: 'USA',
      type: 'HOME',
      isDefault: false,
    };
    this.isModalOpen = true;
  }

  openEditModal(addr: Address, event: Event): void {
    event.stopPropagation();
    this.editingId = addr.id;
    const { id, ...rest } = addr;
    this.formData = { ...rest };
    this.isModalOpen = true;
  }

  saveAddress(): void {
    if (this.editingId) {
      this.addressService.updateAddress(this.editingId, this.formData).subscribe((updated) => {
        if (updated) this.checkoutService.setAddress(updated);
      });
    } else {
      this.addressService.addAddress(this.formData).subscribe((newAddr) => {
        this.checkoutService.setAddress(newAddr);
      });
    }
    this.isModalOpen = false;
  }
}
