import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { UserRole } from '../../core/auth/auth.models';
import { GoogleSignInButtonComponent } from '../../shared/components/google-sign-in-button.component';
import { AppIconComponent } from '../../shared/components/app-icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, GoogleSignInButtonComponent, AppIconComponent],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <!-- Logo -->
        <a routerLink="/" class="inline-flex items-center gap-2">
          <div class="w-10 h-10 rounded-2xl bg-[#2F6B4F] text-white flex items-center justify-center font-black text-xl shadow-md">
            A
          </div>
          <span class="text-2xl font-black text-[#1F2933] tracking-tight">Aura <span class="text-[#2F6B4F]">Ayurveda</span></span>
        </a>
        <h2 class="text-2xl font-extrabold text-[#1F2933]">Sign in to your account</h2>
        <p class="text-xs text-[#64748B]">Natural Wellness. Trusted Ayurveda. Personalized Care.</p>
      </div>

      <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <!-- Role Portal Selector Tabs -->
        <div class="flex bg-slate-200/70 p-1.5 rounded-2xl mb-4 text-xs font-bold gap-1">
          <button
            (click)="selectRole('CUSTOMER')"
            class="flex-1 py-2 rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
            [ngClass]="activeRole === 'CUSTOMER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
          >
            <app-icon name="user" [size]="14"></app-icon> Customer
          </button>
          <button
            (click)="selectRole('SELLER')"
            class="flex-1 py-2 rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
            [ngClass]="activeRole === 'SELLER' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
          >
            <app-icon name="store" [size]="14"></app-icon> Seller Portal
          </button>
          <button
            (click)="selectRole('ADMIN')"
            class="flex-1 py-2 rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
            [ngClass]="activeRole === 'ADMIN' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
          >
            <app-icon name="shield" [size]="14"></app-icon> Admin Portal
          </button>
        </div>

        <div class="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200 sm:px-10 space-y-6">
          <!-- Banner indicator if returnUrl is set -->
          <div *ngIf="returnUrl" class="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-900 text-xs font-semibold">
            <app-icon name="lock" [size]="16" class="text-amber-600 shrink-0"></app-icon>
            <span>Please sign in to proceed to checkout or protected area.</span>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
            <app-icon name="alert-triangle" [size]="16" class="text-red-500 shrink-0"></app-icon>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Login Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-4 text-xs">
            <div>
              <label class="form-label font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                placeholder="name&#64;example.com"
                class="form-input text-xs py-2.5 mt-1"
                [disabled]="isLoading"
              />
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label class="form-label font-bold text-slate-700">Password</label>
                <a routerLink="/forgot-password" class="text-[11px] font-bold text-indigo-600 hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                required
                placeholder="••••••••"
                class="form-input text-xs py-2.5 mt-1"
                [disabled]="isLoading"
              />
            </div>

            <div class="flex items-center justify-between pt-1">
              <label class="flex items-center gap-2 cursor-pointer text-slate-600">
                <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" class="rounded border-slate-300 text-indigo-600" />
                <span>Remember me on this device</span>
              </label>
            </div>

            <button
              type="submit"
              [disabled]="isLoading"
              class="btn btn-lg btn-primary w-full text-center flex items-center justify-center gap-2 font-bold py-3"
            >
              <span *ngIf="!isLoading">Sign In to {{ activeRole === 'CUSTOMER' ? 'Storefront' : activeRole === 'SELLER' ? 'Seller Portal' : 'Admin Console' }}</span>
              <span *ngIf="isLoading" class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                Authenticating...
              </span>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200"></div></div>
            <div class="relative flex justify-center text-xs uppercase"><span class="bg-white px-3 text-slate-400 font-bold text-[10px]">Or continue with</span></div>
          </div>

          <!-- Google Sign-In -->
          <app-google-sign-in-button
            [buttonText]="'Continue with Google'"
            [targetRole]="activeRole === 'SELLER' ? 'SELLER' : 'CUSTOMER'"
            (authenticated)="onGoogleAuthenticated($event)"
          ></app-google-sign-in-button>

          <!-- Quick Fill Demo Credentials Helper -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div class="font-bold text-slate-700 flex items-center gap-1">
              <app-icon name="sparkles" [size]="14" class="text-amber-500"></app-icon> Quick Fill Demo Account
            </div>
            <div class="flex flex-wrap gap-1.5">
              <button (click)="fillDemo('customer@auramarket.demo', 'CUSTOMER')" class="btn btn-xs btn-outline bg-white text-[11px]">
                Customer Demo
              </button>
              <button (click)="fillDemo('seller@auramarket.demo', 'SELLER')" class="btn btn-xs btn-outline bg-white text-[11px]">
                Seller Demo
              </button>
              <button (click)="fillDemo('admin@auramarket.demo', 'ADMIN')" class="btn btn-xs btn-outline bg-white text-[11px]">
                Admin Demo
              </button>
            </div>
          </div>

          <!-- Register Links -->
          <div class="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            <p *ngIf="activeRole === 'CUSTOMER'">
              Don't have a customer account?
              <a routerLink="/register" class="font-bold text-indigo-600 hover:underline">Create Account</a>
            </p>
            <p *ngIf="activeRole === 'SELLER'">
              Want to sell on AuraMarket?
              <a routerLink="/seller/register" class="font-bold text-indigo-600 hover:underline">Register Seller Store</a>
            </p>
            <p *ngIf="activeRole === 'ADMIN'">
              Administrative accounts require platform authorization.
            </p>

            <div class="mt-3">
              <a routerLink="/" class="text-slate-400 hover:text-slate-700 font-semibold text-[11px]">← Continue browsing as Guest</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  email = '';
  password = 'password123';
  rememberMe = true;
  activeRole: UserRole = 'CUSTOMER';
  returnUrl: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'] || null;
      const roleParam = params['role'];
      if (roleParam === 'seller') this.activeRole = 'SELLER';
      else if (roleParam === 'admin') this.activeRole = 'ADMIN';
      else if (roleParam === 'customer') this.activeRole = 'CUSTOMER';
    });

    // Default fill for fast evaluation
    this.email = this.activeRole === 'CUSTOMER' ? 'customer@auramarket.demo' : this.activeRole === 'SELLER' ? 'seller@auramarket.demo' : 'admin@auramarket.demo';
  }

  selectRole(role: UserRole): void {
    this.activeRole = role;
    this.errorMessage = null;
    this.email = role === 'CUSTOMER' ? 'customer@auramarket.demo' : role === 'SELLER' ? 'seller@auramarket.demo' : 'admin@auramarket.demo';
  }

  fillDemo(demoEmail: string, role: UserRole): void {
    this.activeRole = role;
    this.email = demoEmail;
    this.password = 'password123';
    this.errorMessage = null;
  }

  onSubmit(): void {
    if (!this.email.trim()) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login({ email: this.email, password: this.password, rememberMe: this.rememberMe }, this.activeRole).subscribe({
      next: ({ user }) => {
        this.isLoading = false;
        this.toastService.success(`Welcome back, ${user.name}!`);
        this.navigateAfterLogin(user.role);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Authentication failed. Please verify your credentials.';
      },
    });
  }

  onGoogleAuthenticated(payload: any): void {
    this.isLoading = true;
    this.authService.loginWithGoogle(payload, this.activeRole).subscribe({
      next: ({ user }) => {
        this.isLoading = false;
        this.toastService.success(`Signed in via Google as ${user.name}`);
        this.navigateAfterLogin(user.role);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Google authentication error.';
      },
    });
  }

  private navigateAfterLogin(role: UserRole): void {
    if (this.returnUrl) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      if (role === 'SELLER') this.router.navigate(['/seller/dashboard']);
      else if (role === 'ADMIN') this.router.navigate(['/admin/dashboard']);
      else this.router.navigate(['/']);
    }
  }
}
