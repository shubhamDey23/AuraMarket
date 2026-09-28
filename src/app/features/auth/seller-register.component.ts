import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AppIconComponent } from '../../shared/components/app-icon.component';

@Component({
  selector: 'app-seller-register',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Hero Header -->
        <div class="text-center space-y-4">
          <a routerLink="/" class="inline-flex items-center gap-2">
            <div class="w-10 h-10 rounded-2xl bg-[#635BFF] text-white flex items-center justify-center font-black text-xl shadow-md">
              A
            </div>
            <span class="text-2xl font-black text-slate-900 tracking-tight">Aura<span class="text-[#635BFF]">Market</span></span>
          </a>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900">Grow Your Business on AuraMarket</h1>
          <p class="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm">
            Reach millions of online shoppers across India. List products, manage inventory, and receive payouts with 0% hidden commission.
          </p>
        </div>

        <!-- Key Seller Benefits Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card p-6 bg-white space-y-3 border border-slate-200 shadow-sm">
            <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <app-icon name="store" [size]="24"></app-icon>
            </div>
            <h3 class="font-bold text-slate-900 text-sm">Pan-India Reach</h3>
            <p class="text-xs text-slate-500 leading-relaxed">Sell to customers across 28 states with integrated multi-carrier logistics support.</p>
          </div>

          <div class="card p-6 bg-white space-y-3 border border-slate-200 shadow-sm">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <app-icon name="indian-rupee" [size]="24"></app-icon>
            </div>
            <h3 class="font-bold text-slate-900 text-sm">Transparent Payouts</h3>
            <p class="text-xs text-slate-500 leading-relaxed">Receive weekly direct GST-compliant settlements directly into your verified bank account.</p>
          </div>

          <div class="card p-6 bg-white space-y-3 border border-slate-200 shadow-sm">
            <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <app-icon name="package" [size]="24"></app-icon>
            </div>
            <h3 class="font-bold text-slate-900 text-sm">Seller Control Portal</h3>
            <p class="text-xs text-slate-500 leading-relaxed">Dedicated dashboard for catalog management, stock adjustments, and order fulfillment.</p>
          </div>
        </div>

        <!-- Call to Action Banner -->
        <div class="card p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center space-y-4 shadow-xl rounded-3xl">
          <h2 class="text-2xl font-extrabold">Ready to register your store?</h2>
          <p class="text-xs text-indigo-100 max-w-md mx-auto">Complete our quick 5-step seller onboarding form with your GSTIN and store details.</p>
          <div class="pt-2">
            <a routerLink="/seller/onboarding" class="btn btn-lg bg-white hover:bg-slate-100 text-indigo-700 font-extrabold px-8 py-3.5 shadow-md">
              Start Seller Onboarding Stepper →
            </a>
          </div>
        </div>

        <div class="text-center text-xs text-slate-500">
          Already registered as a seller?
          <a [routerLink]="['/login']" [queryParams]="{ role: 'seller' }" class="font-bold text-indigo-600 hover:underline">Sign In to Seller Portal</a>
        </div>
      </div>
    </div>
  `,
})
export class SellerRegisterComponent {}
