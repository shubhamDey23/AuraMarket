export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'NET_BANKING' | 'WALLET' | 'CASH_ON_DELIVERY';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';

export interface PaymentTransaction {
  id: string;
  paymentId: string;
  orderId: string;
  gatewayTransactionId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactions: PaymentTransaction[];
  paidAt?: string;
  createdAt: string;
}
