import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ToastService } from './toast.service';

export type ReturnStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'PICKUP_PENDING'
  | 'RECEIVED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'CANCELLED';

export interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  sellerId: string;
  sellerName: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  reason: string;
  notes?: string;
  refundAmount: number;
  status: ReturnStatus;
  createdAt: string;
  updatedAt: string;
}

export const MOCK_RETURNS: ReturnRequest[] = [
  {
    id: 'ret-101',
    returnNumber: 'RET-9021',
    orderId: 'ord-id-1001',
    orderNumber: 'ORD-20260905-1024',
    customerId: 'cust-1',
    customerName: 'Emma Watson',
    customerEmail: 'emma.watson@example.com',
    sellerId: 'seller-1',
    sellerName: 'Apex Digital Store',
    productId: 'prod-1',
    productName: 'Apex Acoustic Pro Headphones',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    quantity: 1,
    reason: 'Defective audio channel in right ear cup.',
    refundAmount: 299.99,
    status: 'REQUESTED',
    createdAt: '2026-09-04T14:20:00Z',
    updatedAt: '2026-09-04T14:20:00Z',
  },
  {
    id: 'ret-102',
    returnNumber: 'RET-9022',
    orderId: 'ord-id-1002',
    orderNumber: 'ORD-20260905-1025',
    customerId: 'cust-2',
    customerName: 'James Chen',
    customerEmail: 'james.chen@example.com',
    sellerId: 'seller-2',
    sellerName: 'Urban Vogue Apparel',
    productId: 'prod-3',
    productName: 'Urban Minimalist Hoodie',
    productImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80',
    quantity: 1,
    reason: 'Size too large (ordered L, fits like XL).',
    refundAmount: 79.50,
    status: 'APPROVED',
    createdAt: '2026-09-03T11:15:00Z',
    updatedAt: '2026-09-03T16:00:00Z',
  },
  {
    id: 'ret-103',
    returnNumber: 'RET-9023',
    orderId: 'ord-id-1003',
    orderNumber: 'ORD-20260905-1026',
    customerId: 'cust-3',
    customerName: 'Olivia Smith',
    customerEmail: 'olivia.smith@example.com',
    sellerId: 'seller-3',
    sellerName: 'HomeCraft Essentials',
    productId: 'prod-5',
    productName: 'Ergonomic Desk Lamp',
    productImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=80',
    quantity: 1,
    reason: 'Item arrived with scratched base.',
    refundAmount: 64.00,
    status: 'REFUNDED',
    createdAt: '2026-09-01T09:10:00Z',
    updatedAt: '2026-09-02T15:30:00Z',
  },
];

@Injectable({
  providedIn: 'root',
})
export class ReturnService {
  private returns: ReturnRequest[] = [...MOCK_RETURNS];

  constructor(private toastService: ToastService) {}

  getReturns(sellerId?: string): Observable<ReturnRequest[]> {
    let result = [...this.returns];
    if (sellerId) {
      result = result.filter((r) => r.sellerId === sellerId);
    }
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return of(result).pipe(delay(100));
  }

  getReturnById(id: string): Observable<ReturnRequest | undefined> {
    const ret = this.returns.find((r) => r.id === id || r.returnNumber === id);
    return of(ret).pipe(delay(80));
  }

  updateReturnStatus(id: string, newStatus: ReturnStatus, notes?: string): Observable<ReturnRequest | undefined> {
    const index = this.returns.findIndex((r) => r.id === id || r.returnNumber === id);
    if (index === -1) return of(undefined);

    const updated: ReturnRequest = {
      ...this.returns[index],
      status: newStatus,
      notes: notes || this.returns[index].notes,
      updatedAt: new Date().toISOString(),
    };

    this.returns[index] = updated;
    this.toastService.success(`Return ${updated.returnNumber} status updated to ${newStatus}.`);
    return of(updated).pipe(delay(100));
  }
}
