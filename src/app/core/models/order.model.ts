import { Address } from './address.model';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY_TO_SHIP'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export type FulfillmentMethod = 'SELLER_FULFILLED' | 'PLATFORM_FULFILLED';
export type ShipmentStatus = 'LABEL_CREATED' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED_ATTEMPT';

export interface Shipment {
  id: string;
  trackingNumber: string;
  carrierName: string;
  carrierUrl?: string;
  status: ShipmentStatus;
  shippedAt?: string;
  estimatedDeliveryAt?: string;
  deliveredAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  sellerId: string;
  sellerName: string;
  productId: string;
  productName: string;
  productSku: string;
  productImage: string;
  variantId?: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
}

export interface SellerOrder {
  id: string;
  orderId: string;
  sellerId: string;
  sellerName: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  fulfillmentMethod: FulfillmentMethod;
  shipment?: Shipment;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  sellerOrders: SellerOrder[]; // Fulfillment groups split per seller
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED' | 'FAILED';
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
