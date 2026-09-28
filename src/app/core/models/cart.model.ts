import { Product } from './product.model';

export interface CartItem {
  id: string;
  productId: string;
  sellerId: string;
  sellerName: string;
  product: Product;
  selectedVariantId?: string;
  selectedVariantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  grandTotal: number;
  appliedCouponCode?: string;
}
