import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Customer } from '../models/user.model';
import { MOCK_CUSTOMERS } from '../../data/mock/customers.mock';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customers = [...MOCK_CUSTOMERS];

  getCustomers(): Observable<Customer[]> {
    return of(this.customers).pipe(delay(120));
  }

  getCustomerById(id: string): Observable<Customer | undefined> {
    const cust = this.customers.find((c) => c.id === id);
    return of(cust).pipe(delay(80));
  }

  updateCustomerStatus(
    id: string,
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLOCKED'
  ): Observable<Customer | undefined> {
    const index = this.customers.findIndex((c) => c.id === id);
    if (index === -1) return of(undefined);

    const updated = { ...this.customers[index], status };
    this.customers[index] = updated;
    return of(updated).pipe(delay(100));
  }
}
