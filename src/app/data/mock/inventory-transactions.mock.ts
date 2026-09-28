import { InventoryTransaction, StockTransactionType } from '../../core/models/inventory.model';
import { MOCK_PRODUCTS } from './products.mock';

const TRANSACTION_TYPES: StockTransactionType[] = [
  'STOCK_RECEIVED',
  'ORDER_RESERVED',
  'ORDER_FULFILLED',
  'ORDER_CANCELLED',
  'MANUAL_ADJUSTMENT',
  'RETURN_RECEIVED',
  'DAMAGED',
  'STOCK_TRANSFER',
];

export const MOCK_INVENTORY_TRANSACTIONS: InventoryTransaction[] = Array.from({ length: 50 }).map((_, i) => {
  const product = MOCK_PRODUCTS[i % MOCK_PRODUCTS.length];
  const type = TRANSACTION_TYPES[i % TRANSACTION_TYPES.length];
  let qtyChange = 10;
  if (type === 'ORDER_RESERVED' || type === 'ORDER_FULFILLED' || type === 'DAMAGED') {
    qtyChange = -Math.floor(Math.random() * 5 + 1);
  } else if (type === 'STOCK_RECEIVED' || type === 'RETURN_RECEIVED' || type === 'ORDER_CANCELLED') {
    qtyChange = Math.floor(Math.random() * 15 + 2);
  } else {
    qtyChange = Math.random() > 0.5 ? 5 : -2;
  }

  const prev = 30 + (i * 2);
  const next = prev + qtyChange;

  return {
    id: `tx-${i + 101}`,
    inventoryItemId: `inv-${(i % 30) + 1}a`,
    sellerId: product.sellerId,
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    type: type,
    quantityChange: qtyChange,
    previousQuantity: prev,
    newQuantity: next,
    reference:
      type === 'ORDER_RESERVED' || type === 'ORDER_FULFILLED'
        ? `ORD-${1000 + (i % 20)}`
        : type === 'STOCK_RECEIVED'
        ? `PO-${8800 + i}`
        : type === 'RETURN_RECEIVED'
        ? `RET-${500 + (i % 8)}`
        : `AUDIT-2024-${i + 1}`,
    notes: `Transaction log recorded automatically during ${type.toLowerCase().replace('_', ' ')}.`,
    createdAt: `2024-03-${(i % 15) + 1 < 10 ? '0' : ''}${(i % 15) + 1} 14:${(i * 3) % 60 < 10 ? '0' : ''}${(i * 3) % 60}`,
    performedBy: i % 2 === 0 ? product.sellerName || 'Seller System' : 'Automated Marketplace Engine',
  };
});
