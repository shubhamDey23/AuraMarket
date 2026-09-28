import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AppIconComponent } from '../../shared/components/app-icon.component';
import { ToastContainerComponent } from '../../shared/components/toast-container.component';
import { MOCK_SELLERS } from '../../data/mock/sellers.mock';
import { UserRole } from '../../core/models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seller-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AppIconComponent,
    ToastContainerComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-[#F8FAFC]">
      <!-- Role Switcher Demo Topbar -->
      <div class="bg-[#EAF4EC] text-[#1F2933] text-xs py-2 px-4 flex flex-wrap items-center justify-between border-b border-[#DDE7DF] gap-2 z-50">
        <div class="flex items-center gap-2">
          <span class="bg-[#2F6B4F] text-white font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">Seller Portal</span>
          <span class="hidden sm:inline text-[#64748B] font-medium">Managing store: <strong class="text-[#1F2933]">{{ authService.currentSeller().storeName }}</strong></span>
        </div>
        <div class="flex items-center gap-2">
          <!-- Switch Seller Dropdown -->
          <select
            [ngModel]="authService.currentSellerId()"
            (ngModelChange)="onSellerChange($event)"
            class="bg-white text-[#1F2933] border border-[#DDE7DF] text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#2F6B4F] font-semibold"
          >
            <option *ngFor="let s of sellers" [value]="s.id">Store: {{ s.storeName }}</option>
          </select>
          <button (click)="switchRole('CUSTOMER')" class="px-3 py-1 bg-white hover:bg-[#EAF4EC] text-[#1F2933] font-bold rounded-lg text-xs border border-[#DDE7DF]">Customer Storefront</button>
          <button (click)="switchRole('ADMIN')" class="px-3 py-1 bg-white hover:bg-[#EAF4EC] text-[#1F2933] font-bold rounded-lg text-xs border border-[#DDE7DF]">Admin Portal</button>
        </div>
      </div>

      <div class="flex-1 flex overflow-hidden">
        <!-- Seller Light Sidebar (Desktop) -->
        <aside class="hidden lg:flex w-64 bg-white text-[#1F2933] flex-col border-r border-[#DDE7DF] flex-shrink-0 shadow-xs">
          <!-- Store Header -->
          <div class="p-4 border-b border-[#DDE7DF] flex items-center gap-3">
            <img [src]="authService.currentSeller().logoUrl" class="w-10 h-10 rounded-xl object-cover border border-[#DDE7DF] bg-[#F8FAF7]" />
            <div class="overflow-hidden">
              <h2 class="font-extrabold text-[#1F2933] text-sm truncate">{{ authService.currentSeller().storeName }}</h2>
              <div class="text-[11px] text-[#2F6B4F] font-bold flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-[#2F6B4F]"></span>
                <span>Verified Seller</span>
              </div>
            </div>
          </div>

          <!-- Nav Menu -->
          <nav class="flex-1 p-3 space-y-1 overflow-y-auto text-xs font-semibold">
            <a
              routerLink="/seller/dashboard"
              routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors"
            >
              <app-icon name="dashboard" [size]="18"></app-icon>
              <span>Seller Dashboard</span>
            </a>
            <a
              routerLink="/seller/products"
              routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors"
            >
              <app-icon name="package" [size]="18"></app-icon>
              <span>Manage Products</span>
            </a>
            <a
              routerLink="/seller/inventory"
              routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors"
            >
              <app-icon name="layers" [size]="18"></app-icon>
              <span>Manage Inventory</span>
            </a>
            <a
              routerLink="/seller/orders"
              routerLinkActive="bg-[#EAF4EC] text-[#2F6B4F] font-extrabold"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF4EC]/50 hover:text-[#2F6B4F] transition-colors"
            >
              <app-icon name="truck" [size]="18"></app-icon>
              <span>Manage Orders</span>
            </a>
            <a
              routerLink="/seller/fulfillment"
              routerLinkActive="bg-[#F1F0FF] text-[#635BFF] font-extrabold"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <app-icon name="check" [size]="18"></app-icon>
              <span>Fulfillment Group</span>
            </a>
            <a
              routerLink="/seller/earnings"
              routerLinkActive="bg-[#F1F0FF] text-[#635BFF] font-extrabold"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <app-icon name="indian-rupee" [size]="18"></app-icon>
              <span>Earnings & Payouts</span>
            </a>
            <a
              routerLink="/seller/profile"
              routerLinkActive="bg-[#F1F0FF] text-[#635BFF] font-extrabold"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <app-icon name="user" [size]="18"></app-icon>
              <span>Store Profile</span>
            </a>
          </nav>

          <!-- Sidebar Footer -->
          <div class="p-4 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            Fulfillment Rate: <strong class="text-slate-900 font-bold">{{ authService.currentSeller().metrics.fulfillmentRate }}%</strong>
          </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <!-- Top Header -->
          <header class="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
            <div class="flex items-center gap-3">
              <button (click)="isSidebarOpen = !isSidebarOpen" class="lg:hidden p-2 text-slate-600">
                <app-icon name="menu" [size]="22"></app-icon>
              </button>
              <h1 class="text-lg font-bold text-slate-900 hidden sm:block">Seller Portal</h1>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-xs text-slate-500 hidden sm:inline">Owner: <strong class="text-slate-900">{{ authService.currentSeller().ownerName }}</strong></span>
              <a routerLink="/" class="btn btn-sm btn-outline flex items-center gap-1 text-xs">
                <app-icon name="eye" [size]="14"></app-icon>
                <span>Live Storefront</span>
              </a>
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
                <span class="font-bold text-slate-900 text-sm">{{ authService.currentSeller().storeName }}</span>
                <button (click)="isSidebarOpen = false" class="text-slate-400 hover:text-slate-600"><app-icon name="x" [size]="20"></app-icon></button>
              </div>
              <nav class="p-3 space-y-1 flex-1 overflow-y-auto text-xs font-semibold">
                <a routerLink="/seller/dashboard" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Dashboard</a>
                <a routerLink="/seller/products" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Products</a>
                <a routerLink="/seller/inventory" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Inventory</a>
                <a routerLink="/seller/orders" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Orders</a>
                <a routerLink="/seller/fulfillment" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Fulfillment</a>
                <a routerLink="/seller/earnings" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Earnings</a>
                <a routerLink="/seller/profile" (click)="isSidebarOpen = false" class="block px-3 py-2 rounded-lg hover:bg-slate-50">Store Profile</a>
              </nav>
            </div>
          </div>

          <!-- Page Body -->
          <div class="p-4 sm:p-6 lg:p-8 flex-1">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>

      <app-toast-container></app-toast-container>
    </div>
  `,
})
export class SellerLayoutComponent {
  sellers = MOCK_SELLERS;
  isSidebarOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  onSellerChange(sellerId: string): void {
    const s = MOCK_SELLERS.find(x => x.id === sellerId);
    if (s && this.authService.currentUser()) {
      this.authService.store.setUser({
        ...this.authService.currentUser()!,
        sellerId: sellerId,
        name: `${s.ownerName} (${s.storeName})`
      }, this.authService.store.token());
    }
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login'], { queryParams: { role: 'seller' } });
    });
  }

  switchRole(role: any): void {
    this.authService.switchRole(role);
    if (role === 'CUSTOMER') {
      this.router.navigate(['/']);
    } else if (role === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    }
  }
}
