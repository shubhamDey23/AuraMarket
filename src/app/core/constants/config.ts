export interface AppConfig {
  appName: string;
  appVersion: string;
  currency: {
    code: string;
    symbol: string;
    locale: string;
    position: 'before' | 'after';
  };
  localization: {
    country: string;
    taxLabel: string;
    postalCodeLabel: string;
  };
  delivery: {
    standardShippingFee: number;
    expressShippingFee: number;
    freeShippingThreshold: number;
  };
  pagination: {
    defaultPageSize: number;
    pageSizeOptions: number[];
  };
  api: {
    baseUrl: string;
    timeoutMs: number;
  };
  featureFlags: {
    enableMultiSellerCheckout: boolean;
    enableSellerFulfillment: boolean;
    enableReviews: boolean;
    enableCoupons: boolean;
    enableReturns: boolean;
  };
}

export const APP_CONFIG: AppConfig = {
  appName: 'Aura Ayurveda',
  appVersion: '1.0.0-foundation',
  currency: {
    code: 'INR',
    symbol: '₹',
    locale: 'en-IN',
    position: 'before',
  },
  localization: {
    country: 'India',
    taxLabel: 'GST',
    postalCodeLabel: 'PIN Code',
  },
  delivery: {
    standardShippingFee: 49,
    expressShippingFee: 99,
    freeShippingThreshold: 999,
  },
  pagination: {
    defaultPageSize: 12,
    pageSizeOptions: [6, 12, 24, 48],
  },
  api: {
    baseUrl: 'https://api.auramarket.internal/v1',
    timeoutMs: 15000,
  },
  featureFlags: {
    enableMultiSellerCheckout: true,
    enableSellerFulfillment: true,
    enableReviews: true,
    enableCoupons: true,
    enableReturns: true,
  },
};

