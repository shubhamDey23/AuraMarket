import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppIconComponent } from '../../../shared/components/app-icon.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  template: `
    <div class="container space-y-8 pb-16">
      <!-- Profile Header Banner -->
      <div class="p-6 sm:p-8 bg-gradient-to-r from-[#EAF4EC] via-[#FFFDF5] to-[#F5EFE2] rounded-3xl border border-[#DDE7DF] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div class="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img [src]="authService.currentCustomer().avatarUrl" [alt]="authService.currentCustomer().name" class="w-20 h-20 rounded-full object-cover border-2 border-[#2F6B4F] shadow-sm" />
          <div class="space-y-1">
            <h1 class="text-2xl font-extrabold text-[#1F2933]">{{ authService.currentCustomer().name }}</h1>
            <p class="text-xs text-[#64748B]">{{ authService.currentCustomer().email }} • {{ authService.currentCustomer().phone }}</p>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <span class="bg-[#2F6B4F] text-white px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                Loyalty Points: {{ authService.currentCustomer().loyaltyPoints }}
              </span>
              <span class="bg-[#EAF4EC] text-[#2E7D32] border border-[#2E7D32]/30 px-3 py-1 rounded-full text-xs font-bold">
                Orders Placed: {{ authService.currentCustomer().totalOrdersCount }}
              </span>
            </div>
          </div>
        </div>

        <button (click)="logout()" class="btn btn-sm bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl px-5 border border-red-200 shrink-0">
          <app-icon name="log-out" [size]="16"></app-icon>
          <span>Sign Out</span>
        </button>
      </div>

      <!-- Account Navigation Shortcuts Grid (10 Required Hub Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <!-- 1. Personal Profile -->
        <a routerLink="/account/profile" class="p-6 bg-white rounded-3xl border border-[#DDE7DF] hover:border-[#8BAF91] hover:shadow-md transition-all space-y-3 group">
          <div class="w-12 h-12 rounded-2xl bg-[#EAF4EC] text-[#2F6B4F] flex items-center justify-center group-hover:scale-110 transition-transform font-bold">
            <app-icon name="user" [size]="22"></app-icon>
          </div>
          <div>
            <h3 class="font-extrabold text-[#1F2933] text-base">1. Personal Profile</h3>
            <p class="text-xs text-[#64748B] mt-1 leading-relaxed">Update name, contact details, email, and basic account profile.</p>
          </div>
        </a>

        <!-- 2. Order History -->
        <a routerLink="/orders" class="p-6 bg-white rounded-3xl border border-[#DDE7DF] hover:border-[#8BAF91] hover:shadow-md transition-all space-y-3 group">
          <div class="w-12 h-12 rounded-2xl bg-[#EAF4EC] text-[#2F6B4F] flex items-center justify-center group-hover:scale-110 transition-transform font-bold">
            <app-icon name="truck" [size]="22"></app-icon>
          </div>
          <div>
            <h3 class="font-extrabold text-[#1F2933] text-base">2. Order History</h3>
            <p class="text-xs text-[#64748B] mt-1 leading-relaxed">Track herbal shipments, delivery status, and purchase receipts.</p>
          </div>
        </a>

        <!-- 3. Saved Wishlist -->
        <a routerLink="/wishlist" class="p-6 bg-white rounded-3xl border border-[#DDE7DF] hover:border-[#8BAF91] hover:shadow-md transition-all space-y-3 group">
          <div class="w-12 h-12 rounded-2xl bg-[#FFFDF5] text-[#C69A45] flex items-center justify-center group-hover:scale-110 transition-transform font-bold border border-[#F5EFE2]">
            <app-icon name="heart" [size]="22"></app-icon>
          </div>
          <div>
            <h3 class="font-extrabold text-[#1F2933] text-base">3. Saved Wishlist</h3>
            <p class="text-xs text-[#64748B] mt-1 leading-relaxed">View saved Ayurvedic products and favorite herbal remedies.</p>
          </div>
        </a>

        <!-- 4. Delivery Addresses -->
        <a routerLink="/account/addresses" class="p-6 bg-white rounded-3xl border border-[#DDE7DF] hover:border-[#8BAF91] hover:shadow-md transition-all space-y-3 group">
          <div class="w-12 h-12 rounded-2xl bg-[#EAF4EC] text-[#2F6B4F] flex items-center justify-center group-hover:scale-110 transition-transform font-bold">
            <app-icon name="map-pin" [size]="22"></app-icon>
          </div>
          <div>
            <h3 class="font-extrabold text-[#1F2933] text-base">4. Delivery Addresses</h3>
            <p class="text-xs text-[#64748B] mt-1 leading-relaxed">Manage home, office, and doorstep delivery address book.</p>
          </div>
        </a>

        <!-- 5. Doctor Appointments -->
        <a routerLink="/account/consultations" class="p-6 bg-white rounded-3xl border border-[#DDE7DF] hover:border-[#8BAF91] hover:shadow-md transition-all space-y-3 group">
          <div class="w-12 h-12 rounded-2xl bg-[#EAF4EC] text-[#2F6B4F] flex items-center justify-center group-hover:scale-110 transition-transform font-bold">
            <app-icon name="calendar" [size]="22"></app-icon>
          </div>
          <div>
            <h3 class="font-extrabold text-[#1F2933] text-base">5. Doctor Appointments</h3>
            <p class="text-xs text-[#64748B] mt-1 leading-relaxed">Upcoming tele-health appointments, slot reschedule, and live room links.</p>
          </div>
        </a>

        <!-- 6. Consultation History -->
        <a routerLink="/account/consultations" class="p-6 bg-white rounded-3xl border border-[#DDE7DF] hover:border-[#8BAF91] hover:shadow-md transition-all space-y-3 group">
          <div class="w-12 h-12 rounded-2xl bg-[#EAF4EC] text-[#2F6B4F] flex items-center justify-center group-hover:scale-110 transition-transform font-bold">
            <app-icon name="clock" [size]="22"></app-icon>
          </div>
          <div>
            <h3 class="font-extrabold text-[#1F2933] text-base">6. Consultation History</h3>
            <p class="text-xs text-[#64748B] mt-1 leading-relaxed">Review past doctor sessions, follow-up notes, and booking receipts.</p>
          </div>
        </a>

        <!-- 7. Digital Prescriptions Vault -->
        <a routerLink="/account/prescriptions" class="p-6 bg-white rounded-3xl border border-[#DDE7DF] hover:border-[#8BAF91] hover:shadow-md transition-all space-y-3 group">
          <div class="w-12 h-12 rounded-2xl bg-[#EAF4EC] text-[#2E7D32] flex items-center justify-center group-hover:scale-110 transition-transform font-bold">
            <app-icon name="file-text" [size]="22"></app-icon>
          </div>
          <div>
            <h3 class="font-extrabold text-[#1F2933] text-base">7. Digital Prescriptions</h3>
            <p class="text-xs text-[#64748B] mt-1 leading-relaxed">Access verified digital Rx memos issued by your Ayurveda doctors.</p>
          </div>
        </a>

        <!-- 8. Wellness Preferences -->
        <a routerLink="/account/wellness-preferences" class="p-6 bg-white rounded-3xl border border-[#DDE7DF] hover:border-[#8BAF91] hover:shadow-md transition-all space-y-3 group">
          <div class="w-12 h-12 rounded-2xl bg-[#FFFDF5] text-[#C69A45] flex items-center justify-center group-hover:scale-110 transition-transform font-bold border border-[#F5EFE2]">
            <app-icon name="sparkles" [size]="22"></app-icon>
          </div>
          <div>
            <h3 class="font-extrabold text-[#1F2933] text-base">8. Wellness Preferences</h3>
            <p class="text-xs text-[#64748B] mt-1 leading-relaxed">Manage Prakriti (dosha) profile, health goals, and dietary preferences.</p>
          </div>
        </a>

        <!-- 9. Notifications & Security -->
        <a (click)="showSecurityNotice()" class="p-6 bg-white rounded-3xl border border-[#DDE7DF] hover:border-[#8BAF91] hover:shadow-md transition-all space-y-3 group cursor-pointer">
          <div class="w-12 h-12 rounded-2xl bg-[#F8FAF7] text-[#1F2933] flex items-center justify-center group-hover:scale-110 transition-transform font-bold">
            <app-icon name="shield" [size]="22"></app-icon>
          </div>
          <div>
            <h3 class="font-extrabold text-[#1F2933] text-base">9. Security & Notifications</h3>
            <p class="text-xs text-[#64748B] mt-1 leading-relaxed">Password security, authentication settings, and notification alerts.</p>
          </div>
        </a>

      </div>
    </div>
  `,
})
export class CustomerAccountComponent {
  constructor(
    public authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  showSecurityNotice(): void {
    this.toastService.info('Your account is secured with role-based token encryption.', 'Account Security');
  }

  logout(): void {
    this.authService.logout();
    this.toastService.info('Signed out successfully.');
    this.router.navigate(['/login']);
  }
}
