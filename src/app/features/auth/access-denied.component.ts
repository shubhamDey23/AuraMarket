import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AppIconComponent } from '../../shared/components/app-icon.component';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-center">
      <div class="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div class="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-md">
          <app-icon name="lock" [size]="32"></app-icon>
        </div>

        <div class="space-y-2">
          <h1 class="text-2xl font-extrabold text-slate-900">403 — Access Denied</h1>
          <p class="text-xs text-slate-500 leading-relaxed">
            Your account does not have permission to access the requested portal or resource.
          </p>
        </div>

        <div *ngIf="requiredRole" class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
          Required Permission: <strong class="text-indigo-600 uppercase">{{ requiredRole }}</strong><br />
          Your Active Session: <strong>{{ authService.userRole() || 'GUEST' }}</strong>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a routerLink="/" class="btn btn-primary text-xs font-bold w-full sm:w-auto px-6 py-2.5">
            Return to Storefront
          </a>
          <a [routerLink]="['/login']" [queryParams]="{ role: (requiredRole | lowercase) }" class="btn btn-outline text-xs font-bold w-full sm:w-auto px-6 py-2.5">
            Switch Account / Sign In
          </a>
        </div>
      </div>
    </div>
  `,
})
export class AccessDeniedComponent implements OnInit {
  requiredRole: string | null = null;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.requiredRole = params['requiredRole'] || null;
    });
  }
}
