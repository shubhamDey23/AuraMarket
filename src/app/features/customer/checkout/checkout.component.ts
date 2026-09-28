import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CheckoutService } from '../../../core/services/checkout.service';
import { CartService } from '../../../core/services/cart.service';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container space-y-8">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-extrabold text-slate-900">Checkout Process</h1>
      </div>

      <!-- Multi-Step Navigation Stepper -->
      <div class="card p-4 bg-white border border-slate-200">
        <div class="flex items-center justify-between max-w-2xl mx-auto">
          <!-- Step 1: Address -->
          <div (click)="navigateToStep(1)" class="flex items-center gap-2 cursor-pointer">
            <div
              class="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all"
              [ngClass]="checkoutService.currentStep() >= 1 ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'"
            >
              1
            </div>
            <span class="text-xs font-bold hidden sm:inline" [ngClass]="checkoutService.currentStep() >= 1 ? 'text-slate-900' : 'text-slate-400'">Address</span>
          </div>

          <div class="h-0.5 flex-1 bg-slate-200 mx-2" [ngClass]="{ 'bg-indigo-600': checkoutService.currentStep() > 1 }"></div>

          <!-- Step 2: Delivery -->
          <div (click)="navigateToStep(2)" class="flex items-center gap-2 cursor-pointer">
            <div
              class="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all"
              [ngClass]="checkoutService.currentStep() >= 2 ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'"
            >
              2
            </div>
            <span class="text-xs font-bold hidden sm:inline" [ngClass]="checkoutService.currentStep() >= 2 ? 'text-slate-900' : 'text-slate-400'">Delivery</span>
          </div>

          <div class="h-0.5 flex-1 bg-slate-200 mx-2" [ngClass]="{ 'bg-indigo-600': checkoutService.currentStep() > 2 }"></div>

          <!-- Step 3: Review -->
          <div (click)="navigateToStep(3)" class="flex items-center gap-2 cursor-pointer">
            <div
              class="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all"
              [ngClass]="checkoutService.currentStep() >= 3 ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'"
            >
              3
            </div>
            <span class="text-xs font-bold hidden sm:inline" [ngClass]="checkoutService.currentStep() >= 3 ? 'text-slate-900' : 'text-slate-400'">Review</span>
          </div>

          <div class="h-0.5 flex-1 bg-slate-200 mx-2" [ngClass]="{ 'bg-indigo-600': checkoutService.currentStep() > 3 }"></div>

          <!-- Step 4: Payment -->
          <div (click)="navigateToStep(4)" class="flex items-center gap-2 cursor-pointer">
            <div
              class="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all"
              [ngClass]="checkoutService.currentStep() >= 4 ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'"
            >
              4
            </div>
            <span class="text-xs font-bold hidden sm:inline" [ngClass]="checkoutService.currentStep() >= 4 ? 'text-slate-900' : 'text-slate-400'">Payment</span>
          </div>
        </div>
      </div>

      <!-- Child Checkout Step Viewport -->
      <router-outlet></router-outlet>
    </div>
  `,
})
export class CheckoutComponent implements OnInit {
  constructor(
    public checkoutService: CheckoutService,
    public cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.cartService.items().length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  navigateToStep(step: number): void {
    if (step === 1) {
      this.checkoutService.setStep(1);
      this.router.navigate(['/checkout/address']);
    } else if (step === 2 && this.checkoutService.canProceedToDelivery()) {
      this.checkoutService.setStep(2);
      this.router.navigate(['/checkout/delivery']);
    } else if (step === 3 && this.checkoutService.canProceedToReview()) {
      this.checkoutService.setStep(3);
      this.router.navigate(['/checkout/review']);
    } else if (step === 4 && this.checkoutService.canProceedToPayment()) {
      this.checkoutService.setStep(4);
      this.router.navigate(['/checkout/payment']);
    }
  }
}
