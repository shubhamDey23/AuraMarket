export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer extends User {
  phone?: string;
  defaultShippingAddressId?: string;
  totalOrdersCount: number;
  totalSpent: number;
  loyaltyPoints: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLOCKED';
}

export interface SellerLocation {
  id: string;
  name: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
}

export interface SellerMetrics {
  totalRevenue: number;
  totalOrders: number;
  unitsSold: number;
  averageRating: number;
  fulfillmentRate: number; // percentage e.g. 98.5
}

export interface Seller {
  id: string;
  storeName: string;
  slug: string;
  logoUrl: string;
  bannerUrl?: string;
  description: string;
  ownerName: string;
  email: string;
  phone: string;
  status: 'APPROVED' | 'ACTIVE' | 'PENDING' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'REJECTED' | 'INACTIVE';
  rating: number;
  reviewCount: number;
  joinedDate: string;
  locations: SellerLocation[];
  metrics: SellerMetrics;
  productCount?: number;
}

export interface AdminUser extends User {
  department: string;
  permissions: string[];
}
