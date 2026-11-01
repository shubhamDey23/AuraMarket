import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap, of } from 'rxjs';
import { Product, ProductStatus } from '../models/product.model';
import { environment } from '../../../environments/environment';
import { TenantConfigStore } from '../config/tenant-config.store';

export type ProductSortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'reviews' | 'newest' | 'discount';
export interface ProductFilterParams {
  department?: string; gender?: 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX'; categoryId?: string; subcategoryId?: string;
  brandId?: string; sellerId?: string; status?: ProductStatus; productType?: string; requiresPrescription?: boolean;
  search?: string; isFeatured?: boolean; isTrending?: boolean; minPrice?: number; maxPrice?: number;
  minRating?: number; inStockOnly?: boolean; hasDiscount?: boolean; sortBy?: ProductSortOption; page?: number; pageSize?: number;
}
export interface PaginatedProducts { products: Product[]; totalCount: number; page: number; pageSize: number; totalPages: number; }
interface ApiEnvelope<T> { success?: boolean; data?: T; message?: string; }
interface PageDto<T> { content?: T[]; page?: number; size?: number; totalElements?: number; totalPages?: number; hasNext?: boolean; }
interface ProductDto {
  id: string; tenantId?: string; sellerId?: string; categoryId?: string; subcategoryId?: string; brandId?: string;
  name: string; slug: string; description?: string; shortDescription?: string; productType?: string; sku?: string;
  status?: ProductStatus; price?: number | string; discountPrice?: number | string; currency?: string;
  imagesJson?: string; attributesJson?: string; tagsJson?: string; isFeatured?: boolean; isTrending?: boolean;
  createdAt?: string; updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = `${environment.apiGatewayUrl}/api/v1`;
  constructor(private http: HttpClient, private tenantConfig: TenantConfigStore) {}

  private tenantId(): string {
    const id = this.tenantConfig.tenant()?.id;
    if (!id) throw new Error('Storefront tenant configuration is not loaded. Cannot request tenant-scoped products.');
    return id;
  }
  private parseJson<T>(value: string | undefined, fallback: T): T {
    if (!value) return fallback;
    try { return JSON.parse(value) as T; } catch { return fallback; }
  }
  private mapProduct(dto: ProductDto): Product {
    const images = this.parseJson<any[]>(dto.imagesJson, []);
    const attributes = this.parseJson<Record<string, any>>(dto.attributesJson, {});
    const tags = this.parseJson<string[]>(dto.tagsJson, []);
    const price = Number(dto.price ?? 0);
    const salePrice = dto.discountPrice == null ? undefined : Number(dto.discountPrice);
    const featuredImage = images.length ? (typeof images[0] === 'string' ? images[0] : images[0]?.url || images[0]?.imageUrl || '') : '';
    return {
      id: dto.id, sellerId: dto.sellerId || '', name: dto.name, slug: dto.slug, sku: dto.sku || '',
      description: dto.description || '', shortDescription: dto.shortDescription || dto.description || '',
      categoryId: dto.categoryId || '', subcategoryId: dto.subcategoryId, brandId: dto.brandId || '',
      price, salePrice, discountPriceInINR: salePrice, priceInINR: price,
      discountPercentage: salePrice !== undefined && price > 0 ? Math.round((price - salePrice) / price * 100) : 0,
      images: images.map((img: any, i: number) => typeof img === 'string'
        ? { id: String(i), url: img, altText: dto.name, isPrimary: i === 0 }
        : { id: String(img.id || i), url: img.url || img.imageUrl || '', altText: img.altText || dto.name, isPrimary: !!img.isPrimary || i === 0 }),
      featuredImage, rating: Number(attributes.rating || 0), reviewCount: Number(attributes.reviewCount || 0),
      tags, status: dto.status || 'ACTIVE', isFeatured: !!dto.isFeatured, isTrending: !!dto.isTrending,
      stockQuantity: Number(attributes.stockQuantity || attributes.stock || 0), reorderLevel: Number(attributes.reorderLevel || 0),
      manufacturer: attributes.manufacturer, ingredients: Array.isArray(attributes.ingredients) ? attributes.ingredients : [],
      usageInformation: attributes.usageInformation, storageInstructions: attributes.storageInstructions,
      caution: attributes.caution, licenseInformation: attributes.licenseInformation, batchNumber: attributes.batchNumber,
      expiryDate: attributes.expiryDate, productType: dto.productType, requiresPrescription: !!attributes.requiresPrescription,
      netQuantity: attributes.netQuantity, weightKg: attributes.weightKg,
      createdAt: dto.createdAt || '', updatedAt: dto.updatedAt || '',
    };
  }
  private toDto(product: Partial<Product>): Record<string, unknown> {
    return {
      name: product.name, slug: product.slug || product.name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      description: product.description, shortDescription: product.shortDescription, sku: product.sku,
      categoryId: product.categoryId || undefined, subcategoryId: product.subcategoryId || undefined,
      brandId: product.brandId || undefined, sellerId: product.sellerId || undefined, price: product.price,
      discountPrice: product.salePrice ?? product.discountPriceInINR,
      productType: product.productType, status: product.status, isFeatured: product.isFeatured, isTrending: product.isTrending,
      tagsJson: JSON.stringify(product.tags || []),
      imagesJson: JSON.stringify(product.images?.length ? product.images : (product.featuredImage ? [{ url: product.featuredImage, isPrimary: true }] : [])),
      attributesJson: JSON.stringify({ manufacturer: product.manufacturer, ingredients: product.ingredients, usageInformation: product.usageInformation,
        storageInstructions: product.storageInstructions, caution: product.caution, licenseInformation: product.licenseInformation,
        batchNumber: product.batchNumber, expiryDate: product.expiryDate, requiresPrescription: product.requiresPrescription,
        netQuantity: product.netQuantity, weightKg: product.weightKg, stockQuantity: product.stockQuantity, reorderLevel: product.reorderLevel }),
    };
  }
  private query(params?: ProductFilterParams, includeStatus = false): HttpParams {
    let p = new HttpParams().set('tenantId', this.tenantId());
    if (params?.categoryId) p = p.set('categoryId', params.categoryId);
    if (params?.subcategoryId) p = p.set('subcategoryId', params.subcategoryId);
    if (params?.brandId) p = p.set('brandId', params.brandId);
    if (params?.sellerId) p = p.set('sellerId', params.sellerId);
    if (params?.search) p = p.set('search', params.search);
    if (params?.isFeatured !== undefined) p = p.set('isFeatured', params.isFeatured);
    if (params?.isTrending !== undefined) p = p.set('isTrending', params.isTrending);
    if (params?.hasDiscount !== undefined) p = p.set('hasDiscount', params.hasDiscount);
    if (params?.minPrice !== undefined) p = p.set('minPrice', params.minPrice);
    if (params?.maxPrice !== undefined) p = p.set('maxPrice', params.maxPrice);
    if (includeStatus && params?.status) p = p.set('status', params.status);
    p = p.set('page', Math.max(0, (params?.page || 1) - 1)).set('size', Math.min(100, Math.max(1, params?.pageSize || 12)));
    const sort = params?.sortBy;
    if (sort === 'price-asc') p = p.set('sortBy', 'price').set('sortDir', 'ASC');
    else if (sort === 'price-desc') p = p.set('sortBy', 'price').set('sortDir', 'DESC');
    else p = p.set('sortBy', 'createdAt').set('sortDir', 'DESC');
    return p;
  }
  private pageToResult(page: PageDto<ProductDto>): PaginatedProducts {
    const products = (page.content || []).map(p => this.mapProduct(p));
    return { products, totalCount: Number(page.totalElements || 0), page: Number(page.page || 0) + 1,
      pageSize: Number(page.size || products.length), totalPages: Number(page.totalPages || 0) };
  }
  getProductsPaginated(params?: ProductFilterParams): Observable<PaginatedProducts> {
    return this.http.get<ApiEnvelope<PageDto<ProductDto>>>(`${this.baseUrl}/catalog/products`, { params: this.query(params) })
      .pipe(map(r => this.pageToResult(r.data || {})));
  }
  getProducts(params?: ProductFilterParams): Observable<Product[]> {
    return this.getProductsPaginated({ ...params, page: 1, pageSize: params?.pageSize || 100 }).pipe(map(r => r.products));
  }
  getProductById(id: string): Observable<Product | undefined> {
    const params = new HttpParams().set('tenantId', this.tenantId());
    return this.http.get<ApiEnvelope<ProductDto>>(`${this.baseUrl}/catalog/products/${encodeURIComponent(id)}`, { params })
      .pipe(map(r => r.data ? this.mapProduct(r.data) : undefined));
  }
  getProductBySlug(slug: string): Observable<Product | undefined> {
    const params = new HttpParams().set('tenantId', this.tenantId());
    return this.http.get<ApiEnvelope<ProductDto>>(`${this.baseUrl}/catalog/products/slug/${encodeURIComponent(slug)}`, { params })
      .pipe(map(r => r.data ? this.mapProduct(r.data) : undefined));
  }
  getFeaturedProducts(): Observable<Product[]> { return this.getProducts({ isFeatured: true, pageSize: 8 }); }
  getTrendingProducts(): Observable<Product[]> { return this.getProducts({ isTrending: true, pageSize: 8 }); }
  getBestSellerProducts(): Observable<Product[]> { return this.getProducts({ pageSize: 8, sortBy: 'reviews' }); }
  getNewArrivalProducts(): Observable<Product[]> { return this.getProducts({ pageSize: 8, sortBy: 'newest' }); }
  getSellerProducts(sellerId: string): Observable<Product[]> {
    const params = new HttpParams().set('tenantId', this.tenantId()).set('sellerId', sellerId).set('page', 0).set('size', 100);
    return this.http.get<ApiEnvelope<PageDto<ProductDto>>>(`${this.baseUrl}/seller/products`, { params }).pipe(map(r => (r.data?.content || []).map(p => this.mapProduct(p))));
  }
  getAdminProducts(): Observable<Product[]> {
    const params = new HttpParams().set('tenantId', this.tenantId()).set('page', 0).set('size', 100);
    return this.http.get<ApiEnvelope<PageDto<ProductDto>>>(`${this.baseUrl}/admin/catalog/products`, { params }).pipe(map(r => (r.data?.content || []).map(p => this.mapProduct(p))));
  }
  isSkuUnique(sku: string, currentProductId?: string): boolean { return true; }
  createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    return this.http.post<ApiEnvelope<ProductDto>>(`${this.baseUrl}/seller/products`, { ...this.toDto(productData), tenantId: this.tenantId() })
      .pipe(map(r => this.mapProduct(r.data!)));
  }
  updateProduct(id: string, updatedData: Partial<Product>): Observable<Product | undefined> {
    const params = new HttpParams().set('tenantId', this.tenantId()).set('sellerId', updatedData.sellerId || '');
    return this.http.put<ApiEnvelope<ProductDto>>(`${this.baseUrl}/seller/products/${encodeURIComponent(id)}`, this.toDto(updatedData), { params })
      .pipe(map(r => r.data ? this.mapProduct(r.data) : undefined));
  }
  toggleProductStatus(id: string): Observable<Product | undefined> {
    return this.getProductById(id).pipe(map(product => product ? { ...product, status: product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : undefined),
      // Product status updates are sent through the seller update endpoint, which requires the owning seller ID.
      // If the current seller ID is unavailable, the backend rejects the operation rather than using a mock identity.
      switchMap(product => {
        if (!product) return of(undefined);
        const params = new HttpParams().set('tenantId', this.tenantId()).set('sellerId', product.sellerId);
        return this.http.put<ApiEnvelope<ProductDto>>(`${this.baseUrl}/seller/products/${encodeURIComponent(id)}`,
          this.toDto(product), { params }).pipe(map(r => r.data ? this.mapProduct(r.data) : undefined));
      }));
  }
}
