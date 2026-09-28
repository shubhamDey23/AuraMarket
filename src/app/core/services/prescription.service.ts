import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Prescription } from '../models/prescription.model';
import { MOCK_PRESCRIPTIONS } from '../../data/mock/prescriptions.mock';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionService {
  private prescriptions = signal<Prescription[]>(MOCK_PRESCRIPTIONS);

  /**
   * Role-controlled access: Only fetches prescriptions belonging strictly to the specified customer.
   */
  getPrescriptionsForCustomer(customerId = 'cust-1'): Observable<Prescription[]> {
    const customerRx = this.prescriptions().filter((rx) => rx.customerId === customerId);
    return of(customerRx);
  }

  /**
   * Secured lookup verifying customer ownership before returning prescription details.
   */
  getPrescriptionById(id: string, customerId = 'cust-1'): Observable<Prescription | undefined> {
    const rx = this.prescriptions().find((r) => r.id === id && r.customerId === customerId);
    return of(rx);
  }
}
