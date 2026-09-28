import { ReturnRequest, ReturnStatus } from '../../core/models/return.model';
import { MOCK_CUSTOMERS } from './customers.mock';
import { MOCK_PRODUCTS } from './products.mock';

const REASONS = [
  'Item defective or non-functional',
  'Wrong size delivered',
  'Item not as described on website',
  'Changed mind before opening package',
  'Slight cosmetic damage during transit',
];

const RETURN_STATUSES: ReturnStatus[] = [
  'REQUESTED',
  'APPROVED',
  'ITEM_RECEIVED',
  'INSPECTED',
  'REFUND_ISSUED',
  'REJECTED',
];

export const MOCK_RETURNS: ReturnRequest[] = Array.from({ length: 10 }).map((_, i) => {
  const customer = MOCK_CUSTOMERS[i % MOCK_CUSTOMERS.length];
  const product = MOCK_PRODUCTS[i % MOCK_PRODUCTS.length];
  const status = RETURN_STATUSES[i % RETURN_STATUSES.length];
  const reason = REASONS[i % REASONS.length];

  return {
    id: `ret-${i + 501}`,
    orderId: `ord-id-${i + 1}`,
    orderNumber: `ORD-${1001 + i}`,
    sellerId: product.sellerId,
    sellerName: product.sellerName || 'Apex Digital Store',
    customerId: customer.id,
    customerName: customer.name,
    productId: product.id,
    productName: product.name,
    productImage: product.featuredImage,
    quantity: 1,
    reason: reason,
    explanation: `Customer reported: "${reason}. Requesting return and refund."`,
    refundAmount: product.salePrice || product.price,
    status: status,
    requestedAt: `2024-03-0${(i % 5) + 1}`,
    processedAt: status !== 'REQUESTED' ? `2024-03-0${(i % 5) + 2}` : undefined,
    resolutionNotes:
      status === 'REFUND_ISSUED'
        ? 'Item verified at warehouse. Full refund processed back to original payment method.'
        : status === 'REJECTED'
        ? 'Return window exceeded 30-day limit.'
        : undefined,
  };
});
