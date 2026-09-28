import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { GoogleSignInButtonComponent } from '../../shared/components/google-sign-in-button.component';
import { AppIconComponent } from '../../shared/components/app-icon.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, GoogleSignInButtonComponent, AppIconComponent],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <a routerLink="/" class="inline-flex items-center gap-2">
          <div class="w-10 h-10 rounded-2xl bg-[#2F6B4F] text-white flex items-center justify-center font-black text-xl shadow-md">
            A
          </div>
          <span class="text-2xl font-black text-[#1F2933] tracking-tight">Aura <span class="text-[#2F6B4F]">Ayurveda</span></span>
        </a>
        <h2 class="text-2xl font-extrabold text-[#1F2933]">Create Wellness Account</h2>
        <p class="text-xs text-[#64748B]">Natural Wellness. Trusted Ayurveda. Personalized Care.</p>
      </div>

      <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div class="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200 sm:px-10 space-y-6">
          <div *ngIf="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
            <app-icon name="alert-triangle" [size]="16" class="text-red-500 shrink-0"></app-icon>
            <span>{{ errorMessage }}</span>
          </div>

          <form (ngSubmit)="onSubmit()" class="space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="form-label font-bold text-slate-700">First Name *</label>
                <input
                  type="text"
                  [(ngModel)]="formData.firstName"
                  name="firstName"
                  required
                  placeholder="Rahul"
                  class="form-input text-xs py-2.5 mt-1"
                />
              </div>
              <div>
                <label class="form-label font-bold text-slate-700">Last Name *</label>
                <input
                  type="text"
                  [(ngModel)]="formData.lastName"
                  name="lastName"
                  required
                  placeholder="Sharma"
                  class="form-input text-xs py-2.5 mt-1"
                />
              </div>
            </div>

            <div>
              <label class="form-label font-bold text-slate-700">Email Address *</label>
              <input
                type="email"
                [(ngModel)]="formData.email"
                name="email"
                required
                placeholder="rahul.sharma&#64;example.com"
                class="form-input text-xs py-2.5 mt-1"
              />
            </div>

            <div>
              <label class="form-label font-bold text-slate-700">Mobile Number (+91) *</label>
              <input
                type="tel"
                [(ngModel)]="formData.phone"
                name="phone"
                required
                placeholder="+91 98765 43210"
                class="form-input text-xs py-2.5 mt-1"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="form-label font-bold text-slate-700">Password *</label>
                <input
                  type="password"
                  [(ngModel)]="formData.password"
                  name="password"
                  required
                  placeholder="At least 6 characters"
                  class="form-input text-xs py-2.5 mt-1"
                />
              </div>
              <div>
                <label class="form-label font-bold text-slate-700">Confirm Password *</label>
                <input
                  type="password"
                  [(ngModel)]="confirmPassword"
                  name="confirmPassword"
                  required
                  placeholder="Re-enter password"
                  class="form-input text-xs py-2.5 mt-1"
                />
              </div>
            </div>

            <div class="pt-1">
              <label class="flex items-start gap-2 cursor-pointer text-slate-600">
                <input type="checkbox" [(ngModel)]="formData.acceptTerms" name="acceptTerms" required class="mt-0.5 rounded border-slate-300 text-indigo-600" />
                <span>I agree to AuraMarket's <a href="#" class="text-indigo-600 underline">Terms of Service</a> & <a href="#" class="text-indigo-600 underline">Privacy Policy</a></span>
              </label>
            </div>

            <button
              type="submit"
              [disabled]="isLoading"
              class="btn btn-lg btn-primary w-full text-center flex items-center justify-center gap-2 font-bold py-3 mt-2"
            >
              <span *ngIf="!isLoading">Create Account & Shop</span>
              <span *ngIf="isLoading">Creating account...</span>
            </button>
          </form>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200"></div></div>
            <div class="relative flex justify-center text-xs uppercase"><span class="bg-white px-3 text-slate-400 font-bold text-[10px]">Or Sign Up with</span></div>
          </div>

          <app-google-sign-in-button
            buttonText="Sign Up with Google"
            targetRole="CUSTOMER"
            (authenticated)="onGoogleAuthenticated($event)"
          ></app-google-sign-in-button>

          <div class="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Already have an account?
            <a routerLink="/login" class="font-bold text-indigo-600 hover:underline">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    acceptTerms: true,
  };
  confirmPassword = '';
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.formData.firstName || !this.formData.lastName || !this.formData.email || !this.formData.password) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    if (this.formData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (!this.formData.acceptTerms) {
      this.errorMessage = 'You must accept the Terms of Service to register.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.registerCustomer(this.formData).subscribe({
      next: ({ user }) => {
        this.isLoading = false;
        this.toastService.success(`Welcome to AuraMarket, ${user.name}!`);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Registration failed.';
      },
    });
  }

  onGoogleAuthenticated(payload: any): void {
    this.isLoading = true;
    this.authService.loginWithGoogle(payload, 'CUSTOMER').subscribe({
      next: ({ user }) => {
        this.isLoading = false;
        this.toastService.success(`Registered with Google as ${user.name}`);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Google registration failed.';
      },
    });
  }
}
