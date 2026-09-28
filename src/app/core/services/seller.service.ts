import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Seller } from '../models/user.model';
import { MOCK_SELLERS } from '../../data/mock/sellers.mock';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  private sellers = [...MOCK_SELLERS];

  getSellers(): Observable<Seller[]> {
    return of(this.sellers).pipe(delay(120));
  }

  getSellerById(id: string): Observable<Seller | undefined> {
    const seller = this.sellers.find((s) => s.id === id || s.slug === id);
    return of(seller).pipe(delay(80));
  }

  updateSellerStatus(
    sellerId: string,
    status: 'APPROVED' | 'ACTIVE' | 'PENDING' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'REJECTED' | 'INACTIVE'
  ): Observable<Seller | undefined> {
    const index = this.sellers.findIndex((s) => s.id === sellerId);
    if (index === -1) return of(undefined);

    const updated = { ...this.sellers[index], status };
    this.sellers[index] = updated;
    return of(updated).pipe(delay(100));
  }
}
