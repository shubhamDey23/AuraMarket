import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Payment, PaymentMethod, PaymentTransaction } from '../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  processMockPayment(orderId: string, orderNumber: string, customerId: string, customerName: string, amount: number, method: PaymentMethod): Observable<Payment> {
    const txId = `TXN-${Math.floor(Math.random() * 900000000 + 100000000)}`;
    const now = new Date().toISOString();

    const transaction: PaymentTransaction = {
      id: `pay-tx-${Date.now()}`,
      paymentId: `pay-${Date.now()}`,
      orderId: orderId,
      gatewayTransactionId: txId,
      amount: amount,
      currency: 'INR',
      method: method,
      status: method === 'CASH_ON_DELIVERY' ? 'PENDING' : 'COMPLETED',
      createdAt: now,
    };

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      orderId: orderId,
      orderNumber: orderNumber,
      customerId: customerId,
      customerName: customerName,
      amount: amount,
      currency: 'INR',
      method: method,
      status: method === 'CASH_ON_DELIVERY' ? 'PENDING' : 'COMPLETED',
      transactions: [transaction],
      paidAt: method === 'CASH_ON_DELIVERY' ? undefined : now,
      createdAt: now,
    };

    return of(payment).pipe(delay(300));
  }
}
