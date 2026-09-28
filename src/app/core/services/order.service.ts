import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Order, OrderItem, OrderStatus, SellerOrder } from '../models/order.model';
import { MOCK_ORDERS } from '../../data/mock/orders.mock';
import { Cart } from '../models/cart.model';
import { Customer } from '../models/user.model';
import { Address } from '../models/address.model';
import { DeliveryOption } from './delivery.service';
import { PaymentMethod } from '../models/payment.model';
import { ToastService } from './toast.service';

export interface OrderFilterParams {
  customerId?: string;
  sellerId?: string;
  status?: OrderStatus;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'highest-value' | 'lowest-value';
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders: Order[] = [...MOCK_ORDERS];

  constructor(private toastService: ToastService) {}

  getOrders(params?: OrderFilterParams): Observable<Order[]> {
    let result = [...this.orders];

    if (params) {
      if (params.customerId) {
        result = result.filter((o) => o.customerId === params.customerId);
      }
      if (params.status) {
        result = result.filter((o) => o.status === params.status);
      }
      if (params.sellerId) {
        result = result.filter((o) => o.sellerOrders.some((so) => so.sellerId === params.sellerId));
      }
      if (params.search && params.search.trim()) {
        const q = params.search.toLowerCase().trim();
        result = result.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.items.some((item) => item.productName.toLowerCase().includes(q))
        );
      }

      if (params.sortBy) {
        switch (params.sortBy) {
          case 'oldest':
            result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
          case 'highest-value':
            result.sort((a, b) => b.grandTotal - a.grandTotal);
            break;
          case 'lowest-value':
            result.sort((a, b) => a.grandTotal - b.grandTotal);
            break;
          case 'newest':
          default:
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
      }
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return of(result).pipe(delay(120));
  }

  getOrderById(id: string): Observable<Order | undefined> {
    const order = this.orders.find((o) => o.id === id || o.orderNumber === id);
    return of(order).pipe(delay(80));
  }

  getSellerOrders(sellerId: string, status?: OrderStatus): Observable<SellerOrder[]> {
    let sellerOrders: SellerOrder[] = [];
    this.orders.forEach((o) => {
      o.sellerOrders.forEach((so) => {
        if (so.sellerId === sellerId) {
          if (!status || so.status === status) {
            sellerOrders.push(so);
          }
        }
      });
    });
    sellerOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return of(sellerOrders).pipe(delay(100));
  }

  createOrderFromCheckout(
    customer: Customer,
    cart: Cart,
    address: Address,
    delivery: DeliveryOption,
    paymentMethod: PaymentMethod
  ): Observable<Order> {
    const now = new Date();
    const orderId = `ord-id-${Date.now()}`;
    const randNum = Math.floor(Math.random() * 9000 + 1000);
    const orderNumber = `ORD-20260905-${randNum}`;

    // Map cart items to OrderItems
    const orderItems: OrderItem[] = cart.items.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      orderId: orderId,
      sellerId: item.sellerId,
      sellerName: item.sellerName,
      productId: item.productId,
      productName: item.product.name,
      productSku: item.product.sku,
      productImage: item.product.featuredImage,
      variantId: item.selectedVariantId,
      variantName: item.selectedVariantName,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      status: 'CONFIRMED',
    }));

    // Group items into Seller Orders (Fulfillment Groups)
    const sellerMap = new Map<string, OrderItem[]>();
    orderItems.forEach((item) => {
      if (!sellerMap.has(item.sellerId)) {
        sellerMap.set(item.sellerId, []);
      }
      sellerMap.get(item.sellerId)!.push(item);
    });

    const sellerOrders: SellerOrder[] = Array.from(sellerMap.entries()).map(
      ([sellerId, sellerItems], sIdx) => {
        const sub = sellerItems.reduce((acc, it) => acc + it.totalPrice, 0);
        return {
          id: `sord-${Date.now()}-${sIdx + 1}`,
          orderId: orderId,
          sellerId: sellerId,
          sellerName: sellerItems[0].sellerName,
          items: sellerItems,
          subtotal: sub,
          shippingFee: delivery.fee,
          tax: parseFloat((sub * 0.08).toFixed(2)),
          total: parseFloat((sub + delivery.fee + sub * 0.08).toFixed(2)),
          status: 'CONFIRMED',
          fulfillmentMethod: 'SELLER_FULFILLED',
          shipment: {
            id: `ship-${Date.now()}-${sIdx}`,
            trackingNumber: `TRK-${Math.floor(Math.random() * 900000 + 100000)}`,
            carrierName: sIdx % 2 === 0 ? 'FedEx Express' : 'DHL Express',
            status: 'LABEL_CREATED',
            shippedAt: undefined,
            estimatedDeliveryAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          },
          createdAt: now.toISOString(),
        };
      }
    );

    const newOrder: Order = {
      id: orderId,
      orderNumber: orderNumber,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone || '+1 (555) 234-5678',
      shippingAddress: address,
      billingAddress: address,
      items: orderItems,
      sellerOrders: sellerOrders,
      subtotal: cart.subtotal,
      discountTotal: cart.discountTotal,
      shippingTotal: cart.shippingTotal,
      taxTotal: cart.taxTotal,
      grandTotal: cart.grandTotal,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
      status: 'CONFIRMED',
      createdAt: now.toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: now.toISOString().replace('T', ' ').substring(0, 16),
    };

    this.orders.unshift(newOrder);
    this.toastService.success(`Order ${orderNumber} created successfully!`, 'Order Confirmed');
    return of(newOrder).pipe(delay(200));
  }

  cancelOrder(orderId: string, reason: string): Observable<boolean> {
    const index = this.orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (index === -1) return of(false);

    const order = this.orders[index];
    if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
      this.toastService.error('Order cannot be cancelled at its current status.', 'Cancellation Error');
      return of(false);
    }

    const updatedOrder: Order = {
      ...order,
      status: 'CANCELLED',
      paymentStatus: order.paymentStatus === 'PAID' ? 'REFUNDED' : 'PENDING',
      notes: `Cancellation requested by customer. Reason: "${reason}".`,
      sellerOrders: order.sellerOrders.map((so) => ({ ...so, status: 'CANCELLED' })),
      updatedAt: new Date().toISOString(),
    };

    this.orders[index] = updatedOrder;
    this.toastService.info(`Order ${order.orderNumber} has been cancelled.`, 'Order Cancelled');
    return of(true).pipe(delay(100));
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<Order | undefined> {
    const index = this.orders.findIndex((o) => o.id === orderId);
    if (index === -1) return of(undefined);

    const order = this.orders[index];
    const updatedOrder: Order = {
      ...order,
      status,
      updatedAt: new Date().toISOString(),
      sellerOrders: order.sellerOrders.map((so) => ({ ...so, status })),
    };

    this.orders[index] = updatedOrder;
    return of(updatedOrder).pipe(delay(100));
  }

  getSellerOrderDetails(sellerOrderId: string): Observable<{ sellerOrder: SellerOrder; parentOrder: Order } | undefined> {
    for (const order of this.orders) {
      const sOrder = order.sellerOrders.find((so) => so.id === sellerOrderId);
      if (sOrder) {
        return of({ sellerOrder: sOrder, parentOrder: order }).pipe(delay(80));
      }
    }
    return of(undefined);
  }

  isValidStatusTransition(current: OrderStatus, target: OrderStatus): boolean {
    const sequence: OrderStatus[] = [
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'READY_TO_SHIP',
      'SHIPPED',
      'DELIVERED',
    ];
    if (current === 'CANCELLED' || current === 'RETURNED') return false;
    if (target === 'CANCELLED') return current === 'PENDING' || current === 'CONFIRMED';
    const curIdx = sequence.indexOf(current);
    const tarIdx = sequence.indexOf(target);
    if (curIdx === -1 || tarIdx === -1) return false;
    return tarIdx === curIdx + 1 || tarIdx === curIdx;
  }

  updateSellerOrderStatus(sellerOrderId: string, newStatus: OrderStatus): Observable<SellerOrder | undefined> {
    let targetSellerOrder: SellerOrder | undefined;

    for (const order of this.orders) {
      const sIdx = order.sellerOrders.findIndex((so) => so.id === sellerOrderId);
      if (sIdx !== -1) {
        const sOrder = order.sellerOrders[sIdx];
        if (!this.isValidStatusTransition(sOrder.status, newStatus)) {
          this.toastService.warning(
            `Invalid status transition from ${sOrder.status} to ${newStatus}. Transition must follow workflow steps.`,
            'Workflow Guard'
          );
          return of(undefined);
        }

        sOrder.status = newStatus;
        if (newStatus === 'SHIPPED') {
          if (!sOrder.shipment) {
            sOrder.shipment = {
              id: `ship-${Date.now()}`,
              trackingNumber: `TRK-${Math.floor(Math.random() * 899999 + 100000)}`,
              carrierName: 'AuraMarket Express Logistics',
              status: 'IN_TRANSIT',
              shippedAt: new Date().toISOString(),
              estimatedDeliveryAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            };
          } else {
            sOrder.shipment.status = 'IN_TRANSIT';
            sOrder.shipment.shippedAt = new Date().toISOString();
          }
        } else if (newStatus === 'DELIVERED' && sOrder.shipment) {
          sOrder.shipment.status = 'DELIVERED';
        }

        // Sync parent order status if appropriate
        const allStatuses = order.sellerOrders.map((so) => so.status);
        if (allStatuses.every((st) => st === 'DELIVERED')) {
          order.status = 'DELIVERED';
        } else if (allStatuses.some((st) => st === 'SHIPPED' || st === 'PROCESSING' || st === 'READY_TO_SHIP')) {
          order.status = 'PROCESSING';
        }

        order.updatedAt = new Date().toISOString();
        targetSellerOrder = sOrder;
        this.toastService.success(`Seller order status updated to ${newStatus}`, 'Fulfillment Updated');
        break;
      }
    }

    return of(targetSellerOrder).pipe(delay(100));
  }
}
