import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DeliveryService, DeliveryOption } from '../../../../core/services/delivery.service';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { CartService } from '../../../../core/services/cart.service';
import { AppIconComponent } from '../../../../shared/components/app-icon.component';
import { formatInr } from '../../../../core/utils/currency.util';

@Component({
  selector: 'app-checkout-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule, AppIconComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Select Delivery Option</h2>
        <p class="text-xs text-slate-500 mt-0.5">Choose your preferred shipping speed for marketplace dispatch</p>
      </div>

      <div class="space-y-4">
        <div
          *ngFor="let opt of deliveryOptions"
          (click)="selectOption(opt)"
          class="card p-5 cursor-pointer border-2 transition-all flex items-center justify-between gap-4"
          [ngClass]="isSelected(opt) ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-300 bg-white'"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <app-icon name="truck" [size]="20"></app-icon>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>{{ opt.name }}</span>
                <span *ngIf="isFreeEligible(opt)" class="badge badge-success text-[10px]">Free Shipping Applied</span>
              </h4>
              <p class="text-xs text-slate-500 mt-0.5">{{ opt.description }}</p>
              <span class="text-xs font-semibold text-emerald-600 mt-1 block">Expected Delivery: {{ opt.estimatedDays }}</span>
            </div>
          </div>

          <div class="text-right">
            <div class="text-base font-extrabold text-slate-900 font-mono">
              {{ isFreeEligible(opt) ? 'FREE' : formatInr(opt.fee) }}
            </div>
            <span *ngIf="isSelected(opt)" class="text-xs font-bold text-indigo-600 flex items-center justify-end gap-1 mt-1">
              <app-icon name="check" [size]="14"></app-icon> Selected
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex items-center justify-between pt-4 border-t border-slate-200">
        <button (click)="backToAddress()" class="btn btn-outline flex items-center gap-2">
          <app-icon name="arrow-left" [size]="18"></app-icon>
          <span>Back to Address</span>
        </button>

        <button (click)="proceedToReview()" class="btn btn-lg btn-primary flex items-center gap-2">
          <span>Continue to Review</span>
          <app-icon name="arrow-right" [size]="18"></app-icon>
        </button>
      </div>
    </div>
  `,
})
export class CheckoutDeliveryComponent implements OnInit {
  formatInr = formatInr;
  deliveryOptions: DeliveryOption[] = [];

  constructor(
    private deliveryService: DeliveryService,
    public checkoutService: CheckoutService,
    public cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.deliveryService.getDeliveryOptions().subscribe((res) => {
      this.deliveryOptions = res;
    });
  }

  isSelected(opt: DeliveryOption): boolean {
    return this.checkoutService.selectedDeliveryOption().id === opt.id;
  }

  isFreeEligible(opt: DeliveryOption): boolean {
    return opt.isFreeThresholdEligible && this.cartService.subtotal() >= 999;
  }

  selectOption(opt: DeliveryOption): void {
    this.checkoutService.setDeliveryOption(opt);
  }

  backToAddress(): void {
    this.checkoutService.setStep(1);
    this.router.navigate(['/checkout/address']);
  }

  proceedToReview(): void {
    this.checkoutService.setStep(3);
    this.router.navigate(['/checkout/review']);
  }
}
