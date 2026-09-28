export type ProductStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'OUT_OF_STOCK' | 'INACTIVE' | 'ARCHIVED';

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  attributes: Record<string, string>;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  imageUrl?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName?: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  categoryName?: string;
  subcategoryId?: string;
  subcategoryName?: string;
  department?: string;
  gender?: 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX';
  brandId: string;
  brandName?: string;
  price: number;
  priceInINR?: number;
  salePrice?: number;
  discountPriceInINR?: number;
  discountPercentage?: number;
  costPrice?: number;
  images: ProductImage[];
  featuredImage: string;
  rating: number;
  reviewCount: number;
  variants?: ProductVariant[];
  tags: string[];
  status: ProductStatus;
  isFeatured: boolean;
  isTrending: boolean;
  stockQuantity: number;
  reorderLevel: number;
  weightKg?: number;
  
  // Extended Ayurvedic Healthcare Attributes
  ingredients?: string[];
  usageInformation?: string;
  storageInstructions?: string;
  caution?: string;
  manufacturer?: string;
  licenseInformation?: string;
  batchNumber?: string;
  expiryDate?: string;
  productType?: string; // e.g. "Classical Preparations", "Proprietary Ayurvedic", "Herbal Formulations", "Personal Care", "Herbal Oils", "Wellness", "Nutrition", "Consultation"
  requiresPrescription?: boolean;
  netQuantity?: string; // e.g. "500 g", "200 ml", "60 Capsules"
  
  createdAt: string;
  updatedAt: string;
}
