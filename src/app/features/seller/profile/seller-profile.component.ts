import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container space-y-6 max-w-3xl">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/seller/dashboard" class="hover:text-indigo-600">Seller Portal</a> /
        <span class="text-slate-800 font-medium">Store Profile</span>
      </nav>

      <!-- Store Profile Form -->
      <div class="card p-6 sm:p-8 bg-white space-y-6 border border-slate-200">
        <div class="flex items-center gap-4 border-b border-slate-100 pb-4">
          <img [src]="authService.currentSeller().logoUrl" class="w-16 h-16 rounded-2xl object-cover border border-slate-200 bg-slate-50 shrink-0" />
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900">{{ authService.currentSeller().storeName }}</h1>
            <p class="text-xs text-slate-500 mt-0.5">
              Marketplace Storefront Rating: <strong class="text-amber-500">★ {{ authService.currentSeller().rating }}</strong> ({{ authService.currentSeller().reviewCount }} reviews)
            </p>
          </div>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Store Name *</label>
              <input type="text" formControlName="storeName" class="form-input" />
              <div *ngIf="profileForm.get('storeName')?.invalid && profileForm.get('storeName')?.touched" class="text-red-500 text-[11px] mt-1">
                Store name is required.
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Store Owner Full Name *</label>
              <input type="text" formControlName="ownerName" class="form-input" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Business Email *</label>
              <input type="email" formControlName="email" class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input type="text" formControlName="phone" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Store Logo Image URL</label>
            <input type="text" formControlName="logoUrl" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Store Description</label>
            <textarea formControlName="description" class="form-textarea" rows="3"></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <a routerLink="/seller/dashboard" class="btn btn-outline">Cancel</a>
            <button type="submit" [disabled]="profileForm.invalid" class="btn btn-primary disabled:opacity-50">
              Save Store Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class SellerProfileComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(
    public authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const sel = this.authService.currentSeller();
    this.profileForm = new FormGroup({
      storeName: new FormControl(sel.storeName, [Validators.required]),
      ownerName: new FormControl(sel.ownerName, [Validators.required]),
      email: new FormControl(sel.email, [Validators.required, Validators.email]),
      phone: new FormControl(sel.phone || '', [Validators.required]),
      logoUrl: new FormControl(sel.logoUrl, []),
      description: new FormControl(sel.description, []),
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    const val = this.profileForm.value;
    const sel = this.authService.currentSeller();
    sel.storeName = val.storeName;
    sel.ownerName = val.ownerName;
    sel.email = val.email;
    sel.phone = val.phone;
    sel.logoUrl = val.logoUrl;
    sel.description = val.description;

    this.toastService.success('Store profile updated successfully!');
  }
}
