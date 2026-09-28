import { Order, OrderItem, OrderStatus, SellerOrder } from '../../core/models/order.model';
import { MOCK_CUSTOMERS } from './customers.mock';
import { MOCK_PRODUCTS } from './products.mock';

const ORDER_STATUSES: OrderStatus[] = [
  'DELIVERED',
  'SHIPPED',
  'PROCESSING',
  'CONFIRMED',
  'PENDING',
  'CANCELLED',
];

export const MOCK_ORDERS: Order[] = Array.from({ length: 30 }).map((_, i) => {
  const customer = MOCK_CUSTOMERS[i % MOCK_CUSTOMERS.length];
  const orderNum = `ORD-${1001 + i}`;
  const status = ORDER_STATUSES[i % ORDER_STATUSES.length];

  // Pick 2-3 products from different sellers to demonstrate multi-seller order splitting
  const prod1 = MOCK_PRODUCTS[(i * 2) % MOCK_PRODUCTS.length];
  const prod2 = MOCK_PRODUCTS[(i * 2 + 3) % MOCK_PRODUCTS.length];

  const item1: OrderItem = {
    id: `item-${i}-1`,
    orderId: `ord-id-${i + 1}`,
    sellerId: prod1.sellerId,
    sellerName: prod1.sellerName || 'Apex Digital Store',
    productId: prod1.id,
    productName: prod1.name,
    productSku: prod1.sku,
    productImage: prod1.featuredImage,
    unitPrice: prod1.salePrice || prod1.price,
    quantity: 1 + (i % 2),
    totalPrice: (prod1.salePrice || prod1.price) * (1 + (i % 2)),
    status: status,
  };

  const item2: OrderItem = {
    id: `item-${i}-2`,
    orderId: `ord-id-${i + 1}`,
    sellerId: prod2.sellerId,
    sellerName: prod2.sellerName || 'Urban Vogue Apparel',
    productId: prod2.id,
    productName: prod2.name,
    productSku: prod2.sku,
    productImage: prod2.featuredImage,
    unitPrice: prod2.salePrice || prod2.price,
    quantity: 1,
    totalPrice: prod2.salePrice || prod2.price,
    status: status,
  };

  const items = [item1, item2];

  // Split into Seller Orders (Fulfillment Groups)
  const sellerOrderMap = new Map<string, OrderItem[]>();
  items.forEach((item) => {
    if (!sellerOrderMap.has(item.sellerId)) {
      sellerOrderMap.set(item.sellerId, []);
    }
    sellerOrderMap.get(item.sellerId)!.push(item);
  });

  const sellerOrders: SellerOrder[] = Array.from(sellerOrderMap.entries()).map(
    ([sellerId, sellerItems], sIndex) => {
      const sub = sellerItems.reduce((acc, it) => acc + it.totalPrice, 0);
      return {
        id: `sord-${i}-${sIndex + 1}`,
        orderId: `ord-id-${i + 1}`,
        sellerId: sellerId,
        sellerName: sellerItems[0].sellerName,
        items: sellerItems,
        subtotal: sub,
        shippingFee: 49,
        tax: Math.round(sub * 0.18),
        total: Math.round(sub + 49 + sub * 0.18),
        status: status,
        fulfillmentMethod: 'SELLER_FULFILLED',
        shipment:
          status === 'SHIPPED' || status === 'DELIVERED'
            ? {
                id: `ship-${i}-${sIndex}`,
                trackingNumber: `TRK-${990000 + i * 10 + sIndex}`,
                carrierName: sIndex === 0 ? 'BlueDart Express' : 'Delhivery',
                status: status === 'DELIVERED' ? 'DELIVERED' : 'IN_TRANSIT',
                shippedAt: `2024-03-0${(i % 5) + 1}`,
                estimatedDeliveryAt: `2024-03-0${(i % 5) + 4}`,
                deliveredAt: status === 'DELIVERED' ? `2024-03-0${(i % 5) + 3}` : undefined,
              }
            : undefined,
        createdAt: `2024-03-0${(i % 5) + 1} 10:30`,
      };
    }
  );

  const subtotal = items.reduce((acc, it) => acc + it.totalPrice, 0);
  const shippingTotal = sellerOrders.length * 49;
  const taxTotal = Math.round(subtotal * 0.18);
  const grandTotal = Math.round(subtotal + shippingTotal + taxTotal);

  return {
    id: `ord-id-${i + 1}`,
    orderNumber: orderNum,
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone || '+1 (555) 000-0000',
    shippingAddress: {
      id: `addr-${i + 1}`,
      fullName: customer.name,
      phone: customer.phone || '+1 (555) 000-0000',
      addressLine1: `${100 + i} Market Street, Suite ${i + 1}`,
      city: i % 2 === 0 ? 'Austin' : 'Seattle',
      state: i % 2 === 0 ? 'TX' : 'WA',
      postalCode: i % 2 === 0 ? '78701' : '98101',
      country: 'USA',
      isDefault: true,
      type: 'BOTH',
    },
    billingAddress: {
      id: `addr-b-${i + 1}`,
      fullName: customer.name,
      phone: customer.phone || '+1 (555) 000-0000',
      addressLine1: `${100 + i} Market Street, Suite ${i + 1}`,
      city: i % 2 === 0 ? 'Austin' : 'Seattle',
      state: i % 2 === 0 ? 'TX' : 'WA',
      postalCode: i % 2 === 0 ? '78701' : '98101',
      country: 'USA',
      isDefault: true,
      type: 'BOTH',
    },
    items: items,
    sellerOrders: sellerOrders,
    subtotal: subtotal,
    discountTotal: i % 4 === 0 ? 15.00 : 0.00,
    shippingTotal: shippingTotal,
    taxTotal: taxTotal,
    grandTotal: grandTotal - (i % 4 === 0 ? 15.00 : 0.00),
    paymentMethod: i % 3 === 0 ? 'CREDIT_CARD' : i % 3 === 1 ? 'UPI' : 'NET_BANKING',
    paymentStatus: status === 'CANCELLED' ? 'REFUNDED' : status === 'PENDING' ? 'PENDING' : 'PAID',
    status: status,
    notes: i % 5 === 0 ? 'Customer requested gift packaging.' : undefined,
    createdAt: `2024-03-0${(i % 5) + 1} 10:30`,
    updatedAt: `2024-03-0${(i % 5) + 2} 14:00`,
  };
});
