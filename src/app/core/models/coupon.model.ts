export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderValue: number;
  maxDiscountAmount?: number;
  usageCount: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableSellerId?: string; // If seller-specific coupon, else marketplace wide
}
