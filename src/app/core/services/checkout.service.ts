import { Injectable, signal, computed } from '@angular/core';
import { Address } from '../models/address.model';
import { DeliveryOption, DELIVERY_OPTIONS } from './delivery.service';
import { PaymentMethod } from '../models/payment.model';
import { MOCK_ADDRESSES } from '../../data/mock/addresses.mock';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  readonly currentStep = signal<number>(1);
  readonly selectedAddress = signal<Address | null>(MOCK_ADDRESSES[0]);
  readonly selectedDeliveryOption = signal<DeliveryOption>(DELIVERY_OPTIONS[0]);
  readonly selectedPaymentMethod = signal<PaymentMethod>('CREDIT_CARD');

  readonly canProceedToDelivery = computed(() => !!this.selectedAddress());
  readonly canProceedToReview = computed(() => !!this.selectedAddress() && !!this.selectedDeliveryOption());
  readonly canProceedToPayment = computed(() => this.canProceedToReview());

  setStep(step: number): void {
    if (step >= 1 && step <= 4) {
      this.currentStep.set(step);
    }
  }

  setAddress(address: Address): void {
    this.selectedAddress.set(address);
  }

  setDeliveryOption(option: DeliveryOption): void {
    this.selectedDeliveryOption.set(option);
  }

  setPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod.set(method);
  }

  resetCheckoutState(): void {
    this.currentStep.set(1);
    this.selectedAddress.set(MOCK_ADDRESSES[0]);
    this.selectedDeliveryOption.set(DELIVERY_OPTIONS[0]);
    this.selectedPaymentMethod.set('CREDIT_CARD');
  }
}
