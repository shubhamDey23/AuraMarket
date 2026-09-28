import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product, ProductStatus } from '../models/product.model';
import { MOCK_PRODUCTS } from '../../data/mock/products.mock';

export type ProductSortOption =
  | 'recommended'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'reviews'
  | 'newest'
  | 'discount';

export interface ProductFilterParams {
  department?: string;
  gender?: 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX';
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  sellerId?: string;
  status?: ProductStatus;
  productType?: string;
  requiresPrescription?: boolean;
  search?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  hasDiscount?: boolean;
  sortBy?: ProductSortOption;
  page?: number;
  pageSize?: number;
}

export interface PaginatedProducts {
  products: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [...MOCK_PRODUCTS];

  getProductsPaginated(params?: ProductFilterParams): Observable<PaginatedProducts> {
    let result = [...this.products];

    if (params) {
      // Department
      if (params.department) {
        const deptLower = params.department.toLowerCase();
        result = result.filter(
          (p) => (p.department && p.department.toLowerCase() === deptLower) || (p.categoryName && p.categoryName.toLowerCase().includes(deptLower))
        );
      }
      // Gender
      if (params.gender) {
        result = result.filter((p) => p.gender === params.gender || p.gender === 'UNISEX');
      }
      // Category
      if (params.categoryId) {
        result = result.filter((p) => p.categoryId === params.categoryId || p.categoryName?.toLowerCase().includes(params.categoryId!.toLowerCase()));
      }
      // Subcategory
      if (params.subcategoryId) {
        result = result.filter((p) => p.subcategoryId === params.subcategoryId || p.subcategoryName?.toLowerCase().includes(params.subcategoryId!.toLowerCase()));
      }
      // Product Type
      if (params.productType) {
        result = result.filter((p) => p.productType === params.productType);
      }
      // Requires Prescription
      if (params.requiresPrescription !== undefined) {
        result = result.filter((p) => !!p.requiresPrescription === params.requiresPrescription);
      }
      // Brand
      if (params.brandId) {
        result = result.filter((p) => p.brandId === params.brandId);
      }
      // Seller
      if (params.sellerId) {
        result = result.filter((p) => p.sellerId === params.sellerId);
      }
      // Status
      if (params.status) {
        result = result.filter((p) => p.status === params.status);
      } else if (!params.sellerId) {
        // Storefront Default: Only list ACTIVE or APPROVED products
        result = result.filter((p) => p.status === 'ACTIVE' || p.status === 'APPROVED');
      }
      // Featured / Trending
      if (params.isFeatured !== undefined) {
        result = result.filter((p) => p.isFeatured === params.isFeatured);
      }
      if (params.isTrending !== undefined) {
        result = result.filter((p) => p.isTrending === params.isTrending);
      }
      // Price range
      if (params.minPrice !== undefined) {
        result = result.filter((p) => (p.salePrice !== undefined ? p.salePrice : p.price) >= params.minPrice!);
      }
      if (params.maxPrice !== undefined) {
        result = result.filter((p) => (p.salePrice !== undefined ? p.salePrice : p.price) <= params.maxPrice!);
      }
      // Min Rating
      if (params.minRating !== undefined) {
        result = result.filter((p) => p.rating >= params.minRating!);
      }
      // Stock availability
      if (params.inStockOnly) {
        result = result.filter((p) => p.stockQuantity > 0);
      }
      // Has Discount
      if (params.hasDiscount) {
        result = result.filter((p) => (p.discountPercentage || 0) > 0);
      }
      // Search
      if (params.search && params.search.trim()) {
        const q = params.search.toLowerCase().trim();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            (p.brandName && p.brandName.toLowerCase().includes(q)) ||
            (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
            (p.manufacturer && p.manufacturer.toLowerCase().includes(q)) ||
            (p.productType && p.productType.toLowerCase().includes(q)) ||
            (p.ingredients && p.ingredients.some((ing) => ing.toLowerCase().includes(q))) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }

      // Sorting
      if (params.sortBy) {
        switch (params.sortBy) {
          case 'price-asc':
            result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
            break;
          case 'price-desc':
            result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
            break;
          case 'rating':
            result.sort((a, b) => b.rating - a.rating);
            break;
          case 'reviews':
            result.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
          case 'newest':
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'discount':
            result.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
            break;
          case 'recommended':
          default:
            result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        }
      }
    }

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 12;
    const totalCount = result.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    const startIndex = (page - 1) * pageSize;
    const paginatedItems = result.slice(startIndex, startIndex + pageSize);

    return of({
      products: paginatedItems,
      totalCount,
      page,
      pageSize,
      totalPages,
    }).pipe(delay(120));
  }

  getProducts(params?: ProductFilterParams): Observable<Product[]> {
    let result = [...this.products];
    if (params?.isFeatured) {
      result = result.filter((p) => p.isFeatured);
    }
    if (params?.isTrending) {
      result = result.filter((p) => p.isTrending);
    }
    if (params?.sellerId) {
      result = result.filter((p) => p.sellerId === params.sellerId);
    }
    return of(result).pipe(delay(100));
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = this.products.find((p) => p.id === id);
    return of(product).pipe(delay(80));
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    const product = this.products.find((p) => p.slug === slug);
    return of(product).pipe(delay(80));
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.getProducts({ isFeatured: true });
  }

  getTrendingProducts(): Observable<Product[]> {
    return this.getProducts({ isTrending: true });
  }

  getBestSellerProducts(): Observable<Product[]> {
    const sorted = [...this.products].sort((a, b) => b.reviewCount - a.reviewCount);
    return of(sorted.slice(0, 8)).pipe(delay(100));
  }

  getNewArrivalProducts(): Observable<Product[]> {
    const sorted = [...this.products].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return of(sorted.slice(0, 8)).pipe(delay(100));
  }

  getSellerProducts(sellerId: string): Observable<Product[]> {
    return this.getProducts({ sellerId });
  }

  isSkuUnique(sku: string, currentProductId?: string): boolean {
    const existing = this.products.find(
      (p) => p.sku.toLowerCase() === sku.toLowerCase() && p.id !== currentProductId
    );
    return !existing;
  }

  createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    const now = new Date().toISOString().split('T')[0];
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      rating: 5.0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.products.unshift(newProduct);
    return of(newProduct).pipe(delay(100));
  }

  updateProduct(id: string, updatedData: Partial<Product>): Observable<Product | undefined> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return of(undefined);

    const updated: Product = {
      ...this.products[index],
      ...updatedData,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    this.products[index] = updated;
    return of(updated).pipe(delay(100));
  }

  toggleProductStatus(id: string): Observable<Product | undefined> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return of(undefined);

    const prod = this.products[index];
    const newStatus: ProductStatus = prod.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    prod.status = newStatus;
    prod.updatedAt = new Date().toISOString().split('T')[0];
    return of(prod).pipe(delay(80));
  }
}
