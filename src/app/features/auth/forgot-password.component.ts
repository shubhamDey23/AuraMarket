import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppIconComponent } from '../../shared/components/app-icon.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <a routerLink="/" class="inline-flex items-center gap-2">
          <div class="w-10 h-10 rounded-2xl bg-[#635BFF] text-white flex items-center justify-center font-black text-xl shadow-md">
            A
          </div>
          <span class="text-2xl font-black text-slate-900 tracking-tight">Aura<span class="text-[#635BFF]">Market</span></span>
        </a>
        <h2 class="text-2xl font-extrabold text-slate-900">Reset Your Password</h2>
        <p class="text-xs text-slate-500">Enter your registered account email address to receive password reset instructions</p>
      </div>

      <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200 sm:px-10 space-y-6">
          <div *ngIf="isSubmitted" class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs text-emerald-900 text-center">
            <app-icon name="check" [size]="24" class="text-emerald-600 mx-auto"></app-icon>
            <div class="font-bold text-sm">Reset Link Dispatched</div>
            <p class="text-emerald-800">
              Demo reset instructions have been sent to <strong>{{ email }}</strong>. (In live mode, a secure OTP link is dispatched).
            </p>
          </div>

          <form *ngIf="!isSubmitted" (ngSubmit)="onSubmit()" class="space-y-4 text-xs">
            <div>
              <label class="form-label font-bold text-slate-700">Account Email Address</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                placeholder="name&#64;example.com"
                class="form-input text-xs py-2.5 mt-1"
              />
            </div>

            <button type="submit" class="btn btn-lg btn-primary w-full text-center flex items-center justify-center font-bold py-3">
              Send Reset Instructions
            </button>
          </form>

          <div class="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Remembered your password?
            <a routerLink="/login" class="font-bold text-indigo-600 hover:underline">Return to Login</a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  email = '';
  isSubmitted = false;

  onSubmit(): void {
    if (this.email.trim()) {
      this.isSubmitted = true;
    }
  }
}
