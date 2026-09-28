import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AppIconComponent } from '../../shared/components/app-icon.component';
import { ToastContainerComponent } from '../../shared/components/toast-container.component';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppIconComponent,
    ToastContainerComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-[#F8FAFC]">
      <!-- Role Switcher Demo Topbar -->
      <div class="bg-[#EAF4EC] text-[#1F2933] text-xs py-2 px-4 flex flex-wrap items-center justify-between border-b border-[#DDE7DF] gap-2 z-50">
        <div class="flex items-center gap-2">
          <span class="bg-[#2F6B4F] text-white font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">Admin Portal</span>
          <span class="hidden sm:inline text-[#64748B] font-medium">Aura Ayurveda Platform Governance Hub</span>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="switchRole('CUSTOMER')" class="px-3 py-1 bg-white hover:bg-[#EAF4EC] text-[#1F2933] font-bold rounded-lg text-xs border border-[#DDE7DF]">Customer View</button>
          <button (click)="switchRole('SELLER')" class="px-3 py-1 bg-white hover:bg-[#EAF4EC] text-[#1F2933] font-bold rounded-lg text-xs border border-[#DDE7DF]">Seller Portal</button>
        </div>
      </div>
      

      <div class="flex-1 flex overflow-hidden">
        <!-- Admin Light Sidebar (Desktop) -->
        <aside class="hidden lg:flex w-64 bg-white text-[#1F2933] flex-col border-r border-[#DDE7DF] flex-shrink-0 shadow-xs">
          <div class="p-4 border-b border-[#DDE7DF] flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-[#2F6B4F] text-white flex items-center justify-center font-bold shadow-xs">
              <app-icon name="dashboard" [size]="18"></app-icon>
            </div>
            <div>
              <h2 class="font-extrabold text-[#1F2933] text-sm">Aura Ayurveda Admin</h2>
              <p class="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider">Platform Operations</p>
            </div>
          </div>

          <!-- Nav Menu -->
          <nav class="flex-1 p-3 space-y-1 overflow-y-auto text-xs font-semibold">
            <a routerLink="/admin/dashboard" routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors">
              <app-icon name="dashboard" [size]="16"></app-icon>
              <span>Admin Overview</span>
            </a>

            <a routerLink="/admin/doctors" routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors">
              <app-icon name="user-check" [size]="16"></app-icon>
              <span>Manage Doctors & Licenses</span>
            </a>

            <a routerLink="/admin/sellers" routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors">
              <app-icon name="store" [size]="16"></app-icon>
              <span>Manage Sellers</span>
            </a>

            <a routerLink="/admin/customers" routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors">
              <app-icon name="user" [size]="16"></app-icon>
              <span>Manage Customers</span>
            </a>

            <a routerLink="/admin/products" routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors">
              <app-icon name="package" [size]="16"></app-icon>
              <span>Products & Moderation</span>
            </a>

            <a routerLink="/admin/consultations" routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors">
              <app-icon name="calendar" [size]="16"></app-icon>
              <span>Tele-Consultations</span>
            </a>

            <a routerLink="/admin/prescriptions" routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors">
              <app-icon name="file-text" [size]="16"></app-icon>
              <span>Prescription Audit</span>
            </a>

            <a routerLink="/admin/categories" routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors">
              <app-icon name="layers" [size]="16"></app-icon>
              <span>Categories</span>
            </a>

            <a routerLink="/admin/inventory" routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors">
              <app-icon name="layers" [size]="16"></app-icon>
              <span>Global Inventory</span>
            </a>

            <a routerLink="/admin/orders" routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors">
              <app-icon name="truck" [size]="16"></app-icon>
              <span>Platform Orders</span>
            </a>

            <a routerLink="/admin/returns" routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors">
              <app-icon name="arrow-left" [size]="16"></app-icon>
              <span>Returns & Refunds</span>
            </a>

            <a routerLink="/admin/reports" routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors">
              <app-icon name="trending-up" [size]="16"></app-icon>
              <span>Reports & Analytics</span>
            </a>

            <a routerLink="/admin/activity" routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors">
              <app-icon name="clock" [size]="16"></app-icon>
              <span>Audit Log</span>
            </a>

            <a routerLink="/admin/settings" routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors">
              <app-icon name="settings" [size]="16"></app-icon>
              <span>Settings</span>
            </a>
          </nav>
        </aside>

        <!-- Main Content Viewport -->
        <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <header class="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
            <div class="flex items-center gap-3">
              <button (click)="isSidebarOpen = !isSidebarOpen" class="lg:hidden p-2 text-slate-600">
                <app-icon name="menu" [size]="22"></app-icon>
              </button>
              <h1 class="text-lg font-bold text-slate-900 hidden sm:block">Admin Operations Control Center</h1>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span class="text-slate-500">Logged in as: <strong class="text-slate-900">{{ authService.currentAdmin().name }}</strong></span>
              <button (click)="logout()" class="btn btn-sm btn-outline text-red-600 border-red-200 hover:bg-red-50 text-xs font-bold flex items-center gap-1">
                <app-icon name="log-out" [size]="14"></app-icon> Sign Out
              </button>
            </div>
          </header>

          <!-- Mobile Sidebar Overlay -->
          <div *ngIf="isSidebarOpen" class="lg:hidden fixed inset-0 z-40 flex">
            <div (click)="isSidebarOpen = false" class="fixed inset-0 bg-slate-900/30 backdrop-blur-xs"></div>
            <div class="relative flex-1 max-w-xs w-full bg-white text-slate-800 flex flex-col z-50 shadow-xl">
              <div class="p-4 border-b border-slate-100 flex items-center justify-between">
                <span class="font-bold text-slate-900 text-sm">Marketplace Admin</span>
                <button (click)="isSidebarOpen = false" class="text-slate-400 hover:text-slate-600"><app-icon name="x" [size]="20"></app-icon></button>
              </div>
              <nav class="p-3 space-y-1 flex-1 overflow-y-auto text-xs font-semibold">
                <a routerLink="/admin/dashboard" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Dashboard</a>
                <a routerLink="/admin/doctors" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Manage Doctors</a>
                <a routerLink="/admin/sellers" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Sellers</a>
                <a routerLink="/admin/customers" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Customers</a>
                <a routerLink="/admin/products" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Products</a>
                <a routerLink="/admin/consultations" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Consultations</a>
                <a routerLink="/admin/prescriptions" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Prescription Audit</a>
                <a routerLink="/admin/reports" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Reports</a>
                <a routerLink="/admin/activity" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Audit Log</a>
                <a routerLink="/admin/settings" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Settings</a>
              </nav>
            </div>
          </div>

          <div class="p-4 sm:p-6 lg:p-8 flex-1">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>

      <app-toast-container></app-toast-container>
    </div>
  `,
})
export class AdminLayoutComponent {
  isSidebarOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/admin/login']);
    });
  }

  switchRole(role: any): void {
    this.authService.switchRole(role);
    if (role === 'CUSTOMER') {
      this.router.navigate(['/']);
    } else if (role === 'SELLER') {
      this.router.navigate(['/seller/dashboard']);
    }
  }
}
