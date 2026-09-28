import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { AppIconComponent } from '../../shared/components/app-icon.component';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent],
  template: `
    <div class="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-indigo-500/20">
          A
        </div>
        <h2 class="text-2xl font-extrabold text-white">Platform Administrator Console</h2>
        <p class="text-xs text-slate-400">Secure governance portal for AuraMarket platform operations</p>
      </div>

      <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl border border-slate-700 sm:px-10 space-y-6">
          <div *ngIf="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
            <app-icon name="alert-triangle" [size]="16" class="text-red-500 shrink-0"></app-icon>
            <span>{{ errorMessage }}</span>
          </div>

          <form (ngSubmit)="onSubmit()" class="space-y-4 text-xs">
            <div>
              <label class="form-label font-bold text-slate-700">Administrator Email</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                placeholder="admin@auramarket.demo"
                class="form-input text-xs py-2.5 mt-1"
              />
            </div>

            <div>
              <label class="form-label font-bold text-slate-700">Password</label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                required
                placeholder="••••••••"
                class="form-input text-xs py-2.5 mt-1"
              />
            </div>

            <button
              type="submit"
              [disabled]="isLoading"
              class="btn btn-lg bg-indigo-600 hover:bg-indigo-700 text-white w-full text-center flex items-center justify-center gap-2 font-bold py-3 mt-2"
            >
              <span *ngIf="!isLoading">Authenticate Admin Console</span>
              <span *ngIf="isLoading">Verifying credentials...</span>
            </button>
          </form>

          <div class="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 text-center space-y-1">
            <p class="font-bold text-slate-800">Demo Admin Credentials</p>
            <p class="font-mono text-[11px]">admin&#64;auramarket.demo</p>
          </div>

          <div class="text-center text-xs">
            <a routerLink="/login" class="text-slate-500 hover:text-slate-800 font-semibold text-[11px]">← Return to Customer Storefront Login</a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminLoginComponent {
  email = 'admin@auramarket.demo';
  password = 'password123';
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login({ email: this.email, password: this.password }, 'ADMIN').subscribe({
      next: ({ user }) => {
        this.isLoading = false;
        this.toastService.success(`Admin session verified: ${user.name}`);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Administrator authentication failed.';
      },
    });
  }
}
