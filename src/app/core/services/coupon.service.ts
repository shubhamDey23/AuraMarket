import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ToastService } from './toast.service';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'DISABLED';
}

export const MOCK_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'WELCOME15',
    description: '15% discount for new customer first checkout',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minOrderValue: 50,
    maxDiscount: 100,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 5000,
    usedCount: 1420,
    status: 'ACTIVE',
  },
  {
    id: 'coup-2',
    code: 'FREESHIP',
    description: 'Free shipping on orders above $75',
    discountType: 'FIXED',
    discountValue: 9.99,
    minOrderValue: 75,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 10000,
    usedCount: 3820,
    status: 'ACTIVE',
  },
  {
    id: 'coup-3',
    code: 'SUPERVIP',
    description: '25% discount for loyalty club members',
    discountType: 'PERCENTAGE',
    discountValue: 25,
    minOrderValue: 150,
    maxDiscount: 200,
    startDate: '2026-06-01',
    endDate: '2026-12-31',
    usageLimit: 1000,
    usedCount: 210,
    status: 'ACTIVE',
  },
  {
    id: 'coup-4',
    code: 'FESTIVE50',
    description: '$50 fixed discount on orders over $300',
    discountType: 'FIXED',
    discountValue: 50,
    minOrderValue: 300,
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    usageLimit: 500,
    usedCount: 0,
    status: 'SCHEDULED',
  },
];

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private coupons: Coupon[] = [...MOCK_COUPONS];

  constructor(private toastService: ToastService) {}

  getCoupons(): Observable<Coupon[]> {
    return of(this.coupons).pipe(delay(100));
  }

  createCoupon(couponData: Omit<Coupon, 'id' | 'usedCount'>): Observable<Coupon> {
    const newCoupon: Coupon = {
      ...couponData,
      id: `coup-${Date.now()}`,
      usedCount: 0,
    };
    this.coupons.unshift(newCoupon);
    this.toastService.success(`Coupon "${newCoupon.code}" created successfully!`);
    return of(newCoupon).pipe(delay(100));
  }

  toggleCouponStatus(id: string): Observable<Coupon | undefined> {
    const index = this.coupons.findIndex((c) => c.id === id);
    if (index === -1) return of(undefined);

    const c = this.coupons[index];
    const newStatus = c.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    c.status = newStatus;
    this.toastService.info(`Coupon "${c.code}" status changed to ${newStatus}.`);
    return of(c).pipe(delay(80));
  }
}
