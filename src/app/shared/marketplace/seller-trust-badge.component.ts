import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppIconComponent } from '../components/app-icon.component';

@Component({
  selector: 'app-seller-trust-badge',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  template: `
    <div class="card p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
          <app-icon name="store" [size]="20"></app-icon>
        </div>
        <div>
          <div class="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Sold & Fulfilled By</div>
          <h4 class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <span>{{ sellerName }}</span>
            <span class="inline-flex items-center gap-0.5 text-amber-500 text-xs font-semibold">
              ★ {{ sellerRating | number:'1.1-1' }}
            </span>
          </h4>
          <p class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <app-icon name="check" [size]="12"></app-icon> Verified Marketplace Partner
          </p>
        </div>
      </div>

      <a [routerLink]="['/products']" [queryParams]="{sellerId: sellerId}" class="btn btn-sm btn-outline text-xs font-semibold shrink-0">
        Visit Store
      </a>
    </div>
  `,
})
export class SellerTrustBadgeComponent {
  @Input() sellerId = 'seller-1';
  @Input() sellerName = 'Apex Digital Store';
  @Input() sellerRating = 4.8;
}
