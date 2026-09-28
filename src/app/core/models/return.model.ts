export type ReturnStatus = 'REQUESTED' | 'APPROVED' | 'ITEM_RECEIVED' | 'INSPECTED' | 'REFUND_ISSUED' | 'REJECTED';

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  sellerId: string;
  sellerName: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  reason: string;
  explanation: string;
  refundAmount: number;
  status: ReturnStatus;
  requestedAt: string;
  processedAt?: string;
  resolutionNotes?: string;
}
