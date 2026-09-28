import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { InventoryItem, InventoryTransaction, StockTransactionType, InventoryStatus } from '../models/inventory.model';
import { MOCK_INVENTORY } from '../../data/mock/inventory.mock';
import { MOCK_INVENTORY_TRANSACTIONS } from '../../data/mock/inventory-transactions.mock';

export interface InventoryFilterParams {
  sellerId?: string;
  status?: InventoryStatus;
  search?: string;
  locationId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private items: InventoryItem[] = [...MOCK_INVENTORY];
  private transactions: InventoryTransaction[] = [...MOCK_INVENTORY_TRANSACTIONS];

  getInventory(params?: InventoryFilterParams): Observable<InventoryItem[]> {
    let result = [...this.items];

    if (params) {
      if (params.sellerId) {
        result = result.filter((i) => i.sellerId === params.sellerId);
      }
      if (params.status) {
        result = result.filter((i) => i.status === params.status);
      }
      if (params.locationId) {
        result = result.filter((i) => i.locationId === params.locationId);
      }
      if (params.search && params.search.trim()) {
        const q = params.search.toLowerCase().trim();
        result = result.filter(
          (i) =>
            (i.productName && i.productName.toLowerCase().includes(q)) ||
            i.sku.toLowerCase().includes(q) ||
            i.locationName.toLowerCase().includes(q)
        );
      }
    }

    return of(result).pipe(delay(150));
  }

  getTransactions(sellerId?: string): Observable<InventoryTransaction[]> {
    let result = [...this.transactions];
    if (sellerId) {
      result = result.filter((t) => t.sellerId === sellerId);
    }
    // Newest first
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return of(result).pipe(delay(120));
  }

  updateStock(
    inventoryItemId: string,
    quantityChange: number,
    type: StockTransactionType,
    reference: string,
    performedBy: string,
    notes?: string
  ): Observable<InventoryItem | undefined> {
    const index = this.items.findIndex((i) => i.id === inventoryItemId);
    if (index === -1) return of(undefined);

    const item = this.items[index];
    const prevQty = item.availableQuantity;
    const newQty = Math.max(0, prevQty + quantityChange);

    const updatedItem: InventoryItem = {
      ...item,
      availableQuantity: newQty,
      status: newQty === 0 ? 'OUT_OF_STOCK' : newQty <= item.reorderLevel ? 'LOW_STOCK' : 'IN_STOCK',
      updatedAt: new Date().toISOString(),
    };

    this.items[index] = updatedItem;

    // Log transaction
    const tx: InventoryTransaction = {
      id: `tx-${Date.now()}`,
      inventoryItemId: item.id,
      sellerId: item.sellerId,
      productId: item.productId,
      productName: item.productName || 'Product',
      sku: item.sku,
      type,
      quantityChange,
      previousQuantity: prevQty,
      newQuantity: newQty,
      reference,
      notes,
      createdAt: new Date().toISOString(),
      performedBy,
    };

    this.transactions.unshift(tx);

    return of(updatedItem).pipe(delay(100));
  }
}
