import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { CartService } from '../../../../core/services/cart.service';
import { AuthService } from '../../../../core/services/auth.service';
import { OrderService } from '../../../../core/services/order.service';
import { PaymentService } from '../../../../core/services/payment.service';
import { PaymentMethod } from '../../../../core/models/payment.model';
import { AppIconComponent } from '../../../../shared/components/app-icon.component';
import { formatInr } from '../../../../core/utils/currency.util';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, AppIconComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Select Payment Method</h2>
        <p class="text-xs text-slate-500 mt-0.5">Demo payment simulation — no real UPI PIN or bank credentials requested</p>
      </div>

      <!-- Demo Security Alert Notice -->
      <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs">
        <app-icon name="check" [size]="20" customClass="text-emerald-600 shrink-0"></app-icon>
        <div>
          <strong class="font-bold">Indian Payment Demo Active:</strong>
          <span> Simulated UPI, RuPay Card, Net Banking, and Cash on Delivery. Click "Place Order" to complete mock purchase.</span>
        </div>
      </div>

      <!-- Payment Method Selection Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Instant UPI -->
        <label
          (click)="selectMethod('UPI')"
          class="card p-5 cursor-pointer border-2 transition-all flex flex-col items-center text-center gap-2"
          [ngClass]="isSelected('UPI') ? 'border-[#635BFF] bg-purple-50/50 ring-2 ring-purple-200' : 'border-slate-200 hover:border-slate-300 bg-white'"
        >
          <input type="radio" name="payMethod" value="UPI" [ngModel]="checkoutService.selectedPaymentMethod()" class="sr-only" />
          <div class="w-10 h-10 rounded-full bg-purple-100 text-[#635BFF] flex items-center justify-center font-bold">
            <app-icon name="sparkles" [size]="22"></app-icon>
          </div>
          <span class="font-bold text-slate-900 text-xs">Instant UPI</span>
          <span class="text-[11px] text-slate-500">GPay, PhonePe, Paytm</span>
        </label>

        <!-- Credit / Debit Card -->
        <label
          (click)="selectMethod('CREDIT_CARD')"
          class="card p-5 cursor-pointer border-2 transition-all flex flex-col items-center text-center gap-2"
          [ngClass]="isSelected('CREDIT_CARD') ? 'border-[#635BFF] bg-purple-50/50 ring-2 ring-purple-200' : 'border-slate-200 hover:border-slate-300 bg-white'"
        >
          <input type="radio" name="payMethod" value="CREDIT_CARD" [ngModel]="checkoutService.selectedPaymentMethod()" class="sr-only" />
          <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <app-icon name="indian-rupee" [size]="22"></app-icon>
          </div>
          <span class="font-bold text-slate-900 text-xs">Cards</span>
          <span class="text-[11px] text-slate-500">RuPay, Visa, MasterCard</span>
        </label>

        <!-- Cash on Delivery -->
        <label
          (click)="selectMethod('CASH_ON_DELIVERY')"
          class="card p-5 cursor-pointer border-2 transition-all flex flex-col items-center text-center gap-2"
          [ngClass]="isSelected('CASH_ON_DELIVERY') ? 'border-[#635BFF] bg-purple-50/50 ring-2 ring-purple-200' : 'border-slate-200 hover:border-slate-300 bg-white'"
        >
          <input type="radio" name="payMethod" value="CASH_ON_DELIVERY" [ngModel]="checkoutService.selectedPaymentMethod()" class="sr-only" />
          <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <app-icon name="truck" [size]="22"></app-icon>
          </div>
          <span class="font-bold text-slate-900 text-xs">Cash on Delivery</span>
          <span class="text-[11px] text-slate-500">Pay upon doorstep receipt</span>
        </label>
      </div>

      <!-- Demo Input Details View -->
      <div *ngIf="isSelected('UPI')" class="card p-6 bg-white space-y-3 max-w-md text-xs">
        <h3 class="font-bold uppercase text-slate-500">Simulated VPA / UPI ID</h3>
        <div class="form-group"><label class="form-label">Virtual Payment Address</label><input type="text" value="rahul.sharma@upi" class="form-input" readonly /></div>
      </div>

      <div *ngIf="isSelected('CREDIT_CARD')" class="card p-6 bg-white space-y-4 max-w-md">
        <h3 class="font-bold text-xs uppercase text-slate-500">Simulated Card Details</h3>
        <div class="space-y-3 text-xs">
          <div class="form-group"><label class="form-label">Cardholder Name</label><input type="text" value="Rahul Sharma" class="form-input" readonly /></div>
          <div class="form-group"><label class="form-label">Card Number</label><input type="text" value="•••• •••• •••• 6088" class="form-input" readonly /></div>
          <div class="grid grid-cols-2 gap-3">
            <div class="form-group"><label class="form-label">Expiry</label><input type="text" value="10 / 28" class="form-input" readonly /></div>
            <div class="form-group"><label class="form-label">CVV</label><input type="text" value="•••" class="form-input" readonly /></div>
          </div>
        </div>
      </div>

      <!-- Navigation & Action Buttons -->
      <div class="flex items-center justify-between pt-4 border-t border-slate-200">
        <button (click)="backToReview()" class="btn btn-outline flex items-center gap-2">
          <app-icon name="arrow-left" [size]="18"></app-icon>
          <span>Back to Review</span>
        </button>

        <button (click)="placeOrder()" [disabled]="isProcessing" class="btn btn-lg btn-primary flex items-center gap-2">
          <span *ngIf="!isProcessing">Pay {{ formattedGrandTotal }} & Place Order</span>
          <span *ngIf="isProcessing">Processing Order...</span>
          <app-icon *ngIf="!isProcessing" name="check" [size]="18"></app-icon>
        </button>
      </div>
    </div>
  `,
})
export class CheckoutPaymentComponent {
  isProcessing = false;

  get formattedGrandTotal(): string {
    return formatInr(this.cartService.grandTotal());
  }

  constructor(
    public checkoutService: CheckoutService,
    public cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  isSelected(method: PaymentMethod): boolean {
    return this.checkoutService.selectedPaymentMethod() === method;
  }

  selectMethod(method: PaymentMethod): void {
    this.checkoutService.setPaymentMethod(method);
  }

  backToReview(): void {
    this.checkoutService.setStep(3);
    this.router.navigate(['/checkout/review']);
  }

  placeOrder(): void {
    const address = this.checkoutService.selectedAddress();
    const delivery = this.checkoutService.selectedDeliveryOption();
    const method = this.checkoutService.selectedPaymentMethod();

    if (!address || !delivery) {
      return;
    }

    this.isProcessing = true;

    this.orderService.createOrderFromCheckout(
      this.authService.currentCustomer(),
      this.cartService.cart(),
      address,
      delivery,
      method
    ).subscribe((newOrder) => {
      this.cartService.clearCart();
      this.checkoutService.resetCheckoutState();
      this.isProcessing = false;
      this.router.navigate(['/order-success', newOrder.id]);
    });
  }
}
