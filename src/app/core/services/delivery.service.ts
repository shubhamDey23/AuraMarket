import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
  fee: number;
  isFreeThresholdEligible: boolean;
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'del-standard',
    name: 'Standard Marketplace Delivery',
    description: 'Delivered directly by seller carrier partners (BlueDart / Delhivery / DTDC).',
    estimatedDays: '3 to 5 business days',
    fee: 49,
    isFreeThresholdEligible: true,
  },
  {
    id: 'del-express',
    name: 'Express Expedited Shipping',
    description: 'Priority courier dispatch with live SMS and WhatsApp tracking.',
    estimatedDays: '1 to 2 business days',
    fee: 99,
    isFreeThresholdEligible: false,
  },
];

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  getDeliveryOptions(): Observable<DeliveryOption[]> {
    return of(DELIVERY_OPTIONS).pipe(delay(80));
  }

  calculateShippingFee(subtotal: number, optionId: string): number {
    const option = DELIVERY_OPTIONS.find((o) => o.id === optionId) || DELIVERY_OPTIONS[0];
    if (option.isFreeThresholdEligible && subtotal >= 999) {
      return 0;
    }
    return option.fee;
  }
}
