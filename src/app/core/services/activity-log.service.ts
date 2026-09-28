import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface AdminActivity {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  entityType: 'SELLER' | 'PRODUCT' | 'INVENTORY' | 'ORDER' | 'RETURN' | 'CUSTOMER' | 'COUPON' | 'SETTING' | 'DOCTOR' | 'USER' | 'PRESCRIPTION' | 'CONSULTATION';
  entityId: string;
  description: string;
  createdAt: string;
}

export const MOCK_ADMIN_ACTIVITIES: AdminActivity[] = [
  {
    id: 'act-101',
    adminId: 'admin-1',
    adminName: 'Eleanor Vance',
    action: 'SELLER_APPROVED',
    entityType: 'SELLER',
    entityId: 'seller-1',
    description: 'Approved seller account "Apex Digital Store" after verification check.',
    createdAt: '2026-09-05T10:14:00Z',
  },
  {
    id: 'act-102',
    adminId: 'admin-1',
    adminName: 'Eleanor Vance',
    action: 'INVENTORY_ADJUSTED',
    entityType: 'INVENTORY',
    entityId: 'inv-1',
    description: 'Adjusted stock quantity for Wireless Headphones (+20 units) due to warehouse audit correction.',
    createdAt: '2026-09-05T09:30:00Z',
  },
  {
    id: 'act-103',
    adminId: 'admin-1',
    adminName: 'Eleanor Vance',
    action: 'PRODUCT_MODERATED',
    entityType: 'PRODUCT',
    entityId: 'prod-4',
    description: 'Deactivated product listing "Unverified Fast Charger" pending safety specification review.',
    createdAt: '2026-09-04T16:45:00Z',
  },
  {
    id: 'act-104',
    adminId: 'admin-1',
    adminName: 'Eleanor Vance',
    action: 'RETURN_APPROVED',
    entityType: 'RETURN',
    entityId: 'ret-1',
    description: 'Approved customer return request RET-9021 for defect inspection.',
    createdAt: '2026-09-04T14:20:00Z',
  },
  {
    id: 'act-105',
    adminId: 'admin-1',
    adminName: 'Eleanor Vance',
    action: 'COUPON_CREATED',
    entityType: 'COUPON',
    entityId: 'coup-1',
    description: 'Created promotional discount coupon "WELCOME15" (15% off).',
    createdAt: '2026-09-03T11:00:00Z',
  },
];

@Injectable({
  providedIn: 'root',
})
export class ActivityLogService {
  private activities: AdminActivity[] = [...MOCK_ADMIN_ACTIVITIES];

  getActivities(): Observable<AdminActivity[]> {
    const sorted = [...this.activities].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return of(sorted).pipe(delay(100));
  }

  logActivity(
    action: string,
    entityType: AdminActivity['entityType'],
    entityId: string,
    description: string
  ): void {
    const newAct: AdminActivity = {
      id: `act-${Date.now()}`,
      adminId: 'admin-1',
      adminName: 'Eleanor Vance (Platform Admin)',
      action,
      entityType,
      entityId,
      description,
      createdAt: new Date().toISOString(),
    };
    this.activities.unshift(newAct);
  }
}
