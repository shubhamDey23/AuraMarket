import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { BrandConfigService } from '../../core/services/brand-config.service';
import { TenantConfigStore } from '../../core/config/tenant-config.store';
import { MenuItem } from '../../core/config/tenant-config.model';
import { AppIconComponent } from '../../shared/components/app-icon.component';
import { ToastContainerComponent } from '../../shared/components/toast-container.component';
import { NotificationDropdownComponent } from '../../shared/components/notification-dropdown.component';
import { UserRole } from '../../core/auth/auth.models';

interface MegaCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: { name: string; route: string }[];
}

@Component({
  selector: 'app-storefront-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AppIconComponent,
    ToastContainerComponent,
    NotificationDropdownComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-[var(--tenant-background,#F8FAF7)] text-[var(--tenant-text,#1F2933)]">
      <!-- 1. Top Utility Bar (Tenant & Role Switcher Demo) -->
      <div class="header-top-bar text-xs py-2 px-4 flex flex-wrap items-center justify-between gap-2 relative z-[1000] border-b border-black/5 bg-white/50 backdrop-blur-xs">
        <div class="flex items-center gap-2">
          <span class="bg-[var(--tenant-primary,#2F6B4F)] text-white font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider shadow-xs">
            {{ tenantConfigStore.tenantName() }}
          </span>
          <span class="hidden sm:inline text-[#64748B] font-medium">{{ brandConfig.brandTagline() }}</span>
        </div>

        <div class="flex items-center gap-3">
          <!-- Tenant Switcher Dropdown for Testing & Evaluation -->
          <div class="flex items-center gap-1.5 bg-white/80 border border-gray-200 px-2 py-1 rounded-lg text-xs shadow-2xs">
            <span class="text-[10px] font-bold text-gray-500 uppercase">Tenant:</span>
            <select
              [ngModel]="tenantConfigStore.tenant()?.tenantCode"
              (ngModelChange)="onSwitchTenant($event)"
              class="bg-transparent font-extrabold text-[var(--tenant-primary,#2F6B4F)] focus:outline-none cursor-pointer"
            >
              <option value="AURA_AYURVEDA">Aura Ayurveda</option>
              <option value="FASHION_STORE">Demo Fashion Store</option>
            </select>
          </div>

          <!-- Role Switcher -->
          <div class="flex items-center gap-1">
            <button
              (click)="switchRole('CUSTOMER')"
              class="px-2.5 py-1 rounded-lg transition-all text-xs font-bold"
              [ngClass]="authService.isCustomer() ? 'bg-[var(--tenant-primary,#2F6B4F)] text-white shadow-xs' : 'text-[#1F2933] hover:text-[var(--tenant-primary,#2F6B4F)] hover:bg-white'"
            >
              Customer
            </button>
            <button
              (click)="switchRole('SELLER')"
              class="px-2.5 py-1 rounded-lg transition-all text-xs font-bold"
              [ngClass]="authService.isSeller() ? 'bg-[var(--tenant-primary,#2F6B4F)] text-white shadow-xs' : 'text-[#1F2933] hover:text-[var(--tenant-primary,#2F6B4F)] hover:bg-white'"
            >
              Seller
            </button>
            <button
              (click)="switchRole('ADMIN')"
              class="px-2.5 py-1 rounded-lg transition-all text-xs font-bold"
              [ngClass]="authService.isAdmin() ? 'bg-[var(--tenant-primary,#2F6B4F)] text-white shadow-xs' : 'text-[#1F2933] hover:text-[var(--tenant-primary,#2F6B4F)] hover:bg-white'"
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      <!-- 2. Main Header Bar: Dynamic Logo, Search & User Actions -->
      <div class="header-main-bar relative z-[1100] bg-white border-b border-gray-100 shadow-2xs">
        <div class="container h-[76px] flex items-center justify-between gap-4 sm:gap-6 px-4">
          <!-- Dynamic Brand Logo -->
          <a
            routerLink="/"
            class="aura-logo flex items-center gap-2.5 font-extrabold text-2xl tracking-tight shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--tenant-primary)]/20 rounded-xl"
            [attr.aria-label]="tenantConfigStore.tenantName() + ' Home'"
          >
            <div *ngIf="tenantConfigStore.logoUrl(); else textLogoIcon" class="w-10 h-10 rounded-xl overflow-hidden shadow-xs flex items-center justify-center bg-white border border-gray-100">
              <img [src]="tenantConfigStore.logoUrl()" [alt]="tenantConfigStore.tenantName()" class="w-full h-full object-contain" />
            </div>
            <ng-template #textLogoIcon>
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--tenant-primary,#2F6B4F)] to-[var(--tenant-secondary,#8BAF91)] text-white flex items-center justify-center shadow-xs">
                <app-icon name="sparkles" [size]="22"></app-icon>
              </div>
            </ng-template>
            <span class="text-[var(--tenant-text,#1F2933)] font-extrabold tracking-tight">
              {{ tenantConfigStore.tenantName() }}
            </span>
          </a>

          <!-- Search Input Area -->
          <form (submit)="onSearch($event)" class="hidden md:flex flex-1 max-w-xl items-center relative">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              name="search"
              [placeholder]="brandConfig.searchPlaceholder()"
              class="aura-search-input w-full pl-10 pr-24 py-2.5 text-sm text-[var(--tenant-text,#1F2933)] placeholder:text-[#64748B] border border-gray-200 rounded-xl focus:border-[var(--tenant-primary,#2F6B4F)] focus:outline-none"
              aria-label="Search Marketplace"
            />
            <app-icon name="search" [size]="18" customClass="absolute left-3.5 text-[#64748B] pointer-events-none"></app-icon>
            <button
              type="submit"
              class="absolute right-1.5 px-4 py-1.5 bg-[var(--tenant-primary,#2F6B4F)] hover:opacity-90 text-white text-xs font-bold rounded-lg transition-all shadow-xs"
            >
              Search
            </button>
          </form>

          <!-- Header Right Actions (Wishlist, Cart, User Account) -->
          <div class="flex items-center gap-1.5 sm:gap-3">
            <app-notification-dropdown></app-notification-dropdown>

            <!-- Wishlist Button (Controlled by Feature Flag WISHLIST) -->
            <a
              *ngIf="tenantConfigStore.isFeatureEnabled('WISHLIST')"
              routerLink="/wishlist"
              class="aura-icon-btn relative p-2 text-gray-700 hover:text-[var(--tenant-primary,#2F6B4F)] transition-colors"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <app-icon name="heart" [size]="22"></app-icon>
              <span
                *ngIf="wishlistService.itemCount() > 0"
                class="absolute -top-1 -right-1 w-4 h-4 bg-[#C62828] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs"
              >
                {{ wishlistService.itemCount() }}
              </span>
            </a>

            <!-- Cart Button (Controlled by Feature Flag CART) -->
            <a
              *ngIf="tenantConfigStore.isFeatureEnabled('CART')"
              routerLink="/cart"
              class="aura-icon-btn relative p-2 text-gray-700 hover:text-[var(--tenant-primary,#2F6B4F)] transition-colors"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <app-icon name="shopping-cart" [size]="22"></app-icon>
              <span
                *ngIf="cartService.itemCount() > 0"
                class="absolute -top-1 -right-1 w-4 h-4 bg-[var(--tenant-primary,#2F6B4F)] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs"
              >
                {{ cartService.itemCount() }}
              </span>
            </a>

            <!-- Authenticated User Menu vs Guest Sign In -->
            <div *ngIf="authService.isAuthenticated(); else guestAuthLinks" class="relative">
              <button
                (click)="toggleAccountDropdown($event)"
                class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-black/5 transition-colors focus:outline-none"
                aria-haspopup="true"
                [attr.aria-expanded]="isAccountDropdownOpen"
              >
                <img
                  [src]="authService.currentUser()?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'"
                  class="w-8 h-8 rounded-full object-cover border border-gray-200"
                  [alt]="authService.currentUser()?.name || 'User Avatar'"
                />
                <div class="hidden lg:block text-left text-xs">
                  <div class="font-bold text-[var(--tenant-text,#1F2933)] line-clamp-1">{{ authService.currentUser()?.name }}</div>
                  <div class="text-[10px] text-[var(--tenant-primary,#2F6B4F)] font-extrabold uppercase tracking-wider">{{ authService.userRole() }}</div>
                </div>
                <app-icon
                  name="chevron-down"
                  [size]="14"
                  [customClass]="isAccountDropdownOpen ? 'rotate-180-smooth text-[var(--tenant-primary)]' : 'rotate-0-smooth text-[#64748B]'"
                  class="hidden lg:inline"
                ></app-icon>
              </button>

              <!-- Account Dropdown Menu -->
              <div
                *ngIf="isAccountDropdownOpen"
                class="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 space-y-1"
              >
                <div class="px-4 py-2.5 border-b border-gray-100 text-xs">
                  <div class="font-bold text-[#1F2933]">{{ authService.currentUser()?.name }}</div>
                  <div class="text-[#64748B] text-[11px] truncate">{{ authService.currentUser()?.email }}</div>
                </div>

                <ng-container *ngIf="authService.isCustomer()">
                  <a routerLink="/account" (click)="isAccountDropdownOpen = false" class="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-black/5 transition-colors">
                    <app-icon name="user" [size]="15"></app-icon> Account Details
                  </a>
                  <a routerLink="/orders" (click)="isAccountDropdownOpen = false" class="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-black/5 transition-colors">
                    <app-icon name="truck" [size]="15"></app-icon> My Orders
                  </a>
                </ng-container>

                <div class="border-t border-gray-100 pt-1 mt-1">
                  <button
                    (click)="logout()"
                    class="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#C62828] hover:bg-[#FDF2F2] transition-colors"
                  >
                    <app-icon name="log-out" [size]="15"></app-icon> Sign Out
                  </button>
                </div>
              </div>
            </div>

            <ng-template #guestAuthLinks>
              <div class="flex items-center gap-2">
                <a routerLink="/login" class="px-4 py-2 bg-[var(--tenant-primary,#2F6B4F)] text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-90 transition-all">
                  Sign In
                </a>
              </div>
            </ng-template>

            <!-- Mobile Menu Toggle Button -->
            <button
              (click)="isMobileMenuOpen = !isMobileMenuOpen"
              class="md:hidden p-2 text-gray-700 hover:text-[var(--tenant-primary,#2F6B4F)] focus:outline-none"
              [attr.aria-label]="isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'"
            >
              <app-icon [name]="isMobileMenuOpen ? 'x' : 'menu'" [size]="24"></app-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- 3. Secondary Main Navigation Bar: Dynamic Backend Menu Rendering -->
      <nav
        class="aura-sage-navbar sticky top-0 z-[1100] bg-[var(--tenant-surface,#FFFFFF)] border-b border-gray-200/60 shadow-xs"
        [class.scrolled]="isScrolled"
      >
        <div class="container h-[54px] flex items-center justify-between px-4 relative">
          <!-- Main Dynamic Navigation Links -->
          <div class="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 flex-1">
            <ng-container *ngFor="let item of tenantConfigStore.menus()">
              <!-- Top-level Item without children -->
              <a
                *ngIf="!item.children || item.children.length === 0"
                [routerLink]="item.route"
                routerLinkActive="bg-[var(--tenant-primary,#2F6B4F)]/10 text-[var(--tenant-primary,#2F6B4F)] font-bold"
                [routerLinkActiveOptions]="{exact: item.route === '/'}"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-black/5 flex items-center gap-2 whitespace-nowrap"
              >
                <app-icon *ngIf="item.icon" [name]="item.icon" [size]="15"></app-icon>
                <span>{{ item.label }}</span>
              </a>

              <!-- Top-level Item with children (Dropdown) -->
              <div *ngIf="item.children && item.children.length > 0" class="relative inline-block text-left">
                <button
                  (click)="toggleMenuDropdown(item.id, $event)"
                  class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-black/5 flex items-center gap-2 whitespace-nowrap focus:outline-none"
                  [class.text-[var(--tenant-primary,#2F6B4F)]]="openDropdownId === item.id"
                >
                  <app-icon *ngIf="item.icon" [name]="item.icon" [size]="15"></app-icon>
                  <span>{{ item.label }}</span>
                  <app-icon name="chevron-down" [size]="14" [customClass]="openDropdownId === item.id ? 'rotate-180-smooth text-[var(--tenant-primary)]' : 'rotate-0-smooth'"></app-icon>
                </button>

                <div
                  *ngIf="openDropdownId === item.id"
                  class="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 text-xs font-medium space-y-0.5"
                >
                  <a
                    *ngFor="let child of item.children"
                    [routerLink]="child.route"
                    (click)="openDropdownId = null"
                    class="block px-4 py-2 hover:bg-black/5 hover:text-[var(--tenant-primary,#2F6B4F)] transition-colors"
                  >
                    {{ child.label }}
                  </a>
                </div>
              </div>
            </ng-container>
          </div>
        </div>

        <!-- 4. Mobile Navigation Drawer -->
        <div
          *ngIf="isMobileMenuOpen"
          class="md:hidden border-t border-gray-200 p-4 space-y-3 bg-white shadow-xl"
        >
          <form (submit)="onSearch($event)" class="relative">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              name="mobileSearch"
              [placeholder]="brandConfig.searchPlaceholder()"
              class="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl"
            />
            <app-icon name="search" [size]="16" customClass="absolute left-3 top-2.5 text-[#64748B]"></app-icon>
          </form>

          <div class="space-y-1 text-sm font-medium">
            <ng-container *ngFor="let item of tenantConfigStore.menus()">
              <a
                [routerLink]="item.route"
                (click)="isMobileMenuOpen = false"
                class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-colors font-semibold"
              >
                <app-icon *ngIf="item.icon" [name]="item.icon" [size]="16"></app-icon>
                <span>{{ item.label }}</span>
              </a>
              <div *ngIf="item.children && item.children.length > 0" class="pl-6 space-y-1">
                <a
                  *ngFor="let child of item.children"
                  [routerLink]="child.route"
                  (click)="isMobileMenuOpen = false"
                  class="block px-3 py-1.5 text-xs text-gray-600 hover:text-[var(--tenant-primary,#2F6B4F)] font-medium"
                >
                  {{ child.label }}
                </a>
              </div>
            </ng-container>
          </div>
        </div>
      </nav>

      <!-- Main Page Content -->
      <main class="flex-1 py-6">
        <router-outlet></router-outlet>
      </main>

      <!-- Dynamic Footer -->
      <footer class="bg-white text-[#64748B] text-xs py-10 border-t border-gray-200 mt-auto">
        <div class="container px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-2.5 text-[var(--tenant-primary,#2F6B4F)] font-extrabold text-xl mb-3">
              <div class="w-7 h-7 rounded-lg bg-[var(--tenant-primary,#2F6B4F)] text-white flex items-center justify-center shadow-xs">
                <app-icon name="sparkles" [size]="16"></app-icon>
              </div>
              <span>{{ tenantConfigStore.tenantName() }}</span>
            </div>
            <p class="leading-relaxed text-[#64748B]">Generic Multi-Tenant E-Commerce Platform. Configured via backend database & Redis cache.</p>
          </div>

          <div>
            <h4 class="text-[var(--tenant-text,#1F2933)] font-extrabold text-sm mb-3">Navigation</h4>
            <ul class="space-y-2 text-[#64748B] font-medium">
              <li *ngFor="let m of tenantConfigStore.menus()">
                <a [routerLink]="m.route" class="hover:text-[var(--tenant-primary,#2F6B4F)]">{{ m.label }}</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-[var(--tenant-text,#1F2933)] font-extrabold text-sm mb-3">Active Tenant Info</h4>
            <div class="space-y-1.5 text-xs">
              <div><span class="font-bold">Code:</span> {{ tenantConfigStore.tenant()?.tenantCode }}</div>
              <div><span class="font-bold">Type:</span> {{ tenantConfigStore.tenant()?.businessType }}</div>
              <div><span class="font-bold">Currency:</span> {{ tenantConfigStore.tenant()?.currency }}</div>
              <div><span class="font-bold">Locale:</span> {{ tenantConfigStore.tenant()?.locale }}</div>
            </div>
          </div>

          <div>
            <h4 class="text-[var(--tenant-text,#1F2933)] font-extrabold text-sm mb-3">Tenant Switcher</h4>
            <p class="text-xs text-gray-500 mb-2">Switch tenants to demonstrate dynamic configuration without code changes:</p>
            <div class="flex flex-col gap-2">
              <button
                (click)="onSwitchTenant('AURA_AYURVEDA')"
                class="px-3 py-1.5 text-left text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                [class.bg-[var(--tenant-primary)]]="tenantConfigStore.tenant()?.tenantCode === 'AURA_AYURVEDA'"
                [class.text-white]="tenantConfigStore.tenant()?.tenantCode === 'AURA_AYURVEDA'"
              >
                🌿 Aura Ayurveda
              </button>
              <button
                (click)="onSwitchTenant('FASHION_STORE')"
                class="px-3 py-1.5 text-left text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                [class.bg-[var(--tenant-primary)]]="tenantConfigStore.tenant()?.tenantCode === 'FASHION_STORE'"
                [class.text-white]="tenantConfigStore.tenant()?.tenantCode === 'FASHION_STORE'"
              >
                👗 Demo Fashion Store
              </button>
            </div>
          </div>
        </div>

        <div class="container px-4 pt-6 mt-6 border-t border-gray-100 text-center text-[#64748B] font-medium">
          &copy; 2026 {{ tenantConfigStore.tenantName() }}. Multi-Tenant Architecture powered by Spring Boot & Angular 19.
        </div>
      </footer>

      <app-toast-container></app-toast-container>
    </div>
  `,
})
export class StorefrontLayoutComponent {
  searchQuery = '';
  isScrolled = false;
  isMobileMenuOpen = false;
  isAccountDropdownOpen = false;
  openDropdownId: string | null = null;

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    public wishlistService: WishlistService,
    public brandConfig: BrandConfigService,
    public tenantConfigStore: TenantConfigStore,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollOffset > 10;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isAccountDropdownOpen = false;
      this.openDropdownId = null;
    }
  }

  @HostListener('window:keydown.escape')
  onEscapePress(): void {
    this.isAccountDropdownOpen = false;
    this.openDropdownId = null;
    this.isMobileMenuOpen = false;
  }

  toggleAccountDropdown(event: Event): void {
    event.stopPropagation();
    this.isAccountDropdownOpen = !this.isAccountDropdownOpen;
    this.openDropdownId = null;
  }

  toggleMenuDropdown(menuId: string, event: Event): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === menuId ? null : menuId;
    this.isAccountDropdownOpen = false;
  }

  onSwitchTenant(tenantCode: string): void {
    if (tenantCode) {
      this.tenantConfigStore.switchTenant(tenantCode);
    }
  }

  switchRole(role: UserRole): void {
    this.authService.switchRole(role);
    this.isAccountDropdownOpen = false;
    if (role === 'SELLER') {
      this.router.navigate(['/seller/dashboard']);
    } else if (role === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  logout(): void {
    this.isAccountDropdownOpen = false;
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  onSearch(event: Event): void {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchQuery.trim() },
      });
      this.isMobileMenuOpen = false;
    }
  }
}
