import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  selector: 'app-account-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container space-y-6 max-w-2xl">
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/account" class="hover:text-indigo-600">Account</a> /
        <span class="text-slate-800 font-medium">Personal Profile</span>
      </nav>

      <div class="card p-6 bg-white space-y-6 border border-slate-200">
        <div class="border-b border-slate-100 pb-3">
          <h1 class="text-xl font-bold text-slate-900">Edit Personal Profile</h1>
          <p class="text-xs text-slate-500 mt-0.5">Update your contact information for order notifications</p>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="onSaveProfile()" class="space-y-4 text-xs">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" formControlName="name" class="form-input" />
            <div *ngIf="profileForm.get('name')?.invalid && profileForm.get('name')?.touched" class="text-red-500 text-[11px] mt-1">
              Full name is required.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" formControlName="email" class="form-input" />
            <div *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched" class="text-red-500 text-[11px] mt-1">
              Please enter a valid email.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="text" formControlName="phone" class="form-input" />
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <a routerLink="/account" class="btn btn-outline">Cancel</a>
            <button type="submit" [disabled]="profileForm.invalid" class="btn btn-primary disabled:opacity-50">
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class AccountProfileComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const cust = this.authService.currentCustomer();
    this.profileForm = new FormGroup({
      name: new FormControl(cust.name, [Validators.required]),
      email: new FormControl(cust.email, [Validators.required, Validators.email]),
      phone: new FormControl(cust.phone || '', []),
    });
  }

  onSaveProfile(): void {
    if (this.profileForm.valid) {
      const val = this.profileForm.value;
      const cust = this.authService.currentCustomer();
      cust.name = val.name;
      cust.email = val.email;
      cust.phone = val.phone;
      this.toastService.success('Profile details updated successfully!');
    }
  }
}
