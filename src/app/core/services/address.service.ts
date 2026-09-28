import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Address } from '../models/address.model';
import { MOCK_ADDRESSES } from '../../data/mock/addresses.mock';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  readonly addresses = signal<Address[]>([...MOCK_ADDRESSES]);

  constructor(private toastService: ToastService) {}

  getAddresses(): Observable<Address[]> {
    return of(this.addresses()).pipe(delay(100));
  }

  getAddressById(id: string): Observable<Address | undefined> {
    const addr = this.addresses().find((a) => a.id === id);
    return of(addr).pipe(delay(80));
  }

  addAddress(address: Omit<Address, 'id'>): Observable<Address> {
    const newAddr: Address = {
      ...address,
      id: `addr-${Date.now()}`,
    };

    if (newAddr.isDefault) {
      this.addresses.update((current) =>
        current.map((a) => ({ ...a, isDefault: false }))
      );
    }

    this.addresses.update((current) => [...current, newAddr]);
    this.toastService.success('Address added to your address book!', 'Address Saved');
    return of(newAddr).pipe(delay(100));
  }

  updateAddress(id: string, updated: Partial<Address>): Observable<Address | undefined> {
    const index = this.addresses().findIndex((a) => a.id === id);
    if (index === -1) return of(undefined);

    if (updated.isDefault) {
      this.addresses.update((current) =>
        current.map((a) => ({ ...a, isDefault: false }))
      );
    }

    const currentList = [...this.addresses()];
    const addr = { ...currentList[index], ...updated };
    currentList[index] = addr;

    this.addresses.set(currentList);
    this.toastService.success('Address updated successfully!');
    return of(addr).pipe(delay(100));
  }

  deleteAddress(id: string): Observable<boolean> {
    this.addresses.update((current) => current.filter((a) => a.id !== id));
    this.toastService.info('Address removed.');
    return of(true).pipe(delay(80));
  }

  setDefaultAddress(id: string): void {
    this.addresses.update((current) =>
      current.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    this.toastService.success('Default address updated.');
  }
}
