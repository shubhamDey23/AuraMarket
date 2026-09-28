export type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'DISABLED';

export type StockTransactionType =
  | 'STOCK_RECEIVED'
  | 'ORDER_RESERVED'
  | 'ORDER_CANCELLED'
  | 'ORDER_FULFILLED'
  | 'MANUAL_ADJUSTMENT'
  | 'RETURN_RECEIVED'
  | 'DAMAGED'
  | 'STOCK_TRANSFER';

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
}

export interface InventoryItem {
  id: string;
  sellerId: string;
  sellerName?: string;
  productId: string;
  productName?: string;
  productImage?: string;
  sku: string;
  locationId: string;
  locationName: string;
  availableQuantity: number;
  reservedQuantity: number;
  damagedQuantity: number;
  reorderLevel: number;
  status: InventoryStatus;
  lastRestockedAt: string;
  updatedAt: string;
  // Extended Ayurvedic Batch & Storage Attributes
  batchNumber?: string;
  expiryDate?: string;
  storageRequirement?: string; // e.g. "Store in a cool dry place < 25°C"
}

export interface InventoryTransaction {
  id: string;
  inventoryItemId: string;
  sellerId: string;
  productId: string;
  productName: string;
  sku: string;
  type: StockTransactionType;
  quantityChange: number; // positive for addition, negative for reduction
  previousQuantity: number;
  newQuantity: number;
  reference: string; // e.g. "Order #ORD-1002" or "PO-9921" or "Manual Audit"
  notes?: string;
  createdAt: string;
  performedBy: string;
}
