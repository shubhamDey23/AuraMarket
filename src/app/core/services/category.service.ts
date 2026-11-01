import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of, shareReplay } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../../environments/environment';
import { TenantConfigStore } from '../config/tenant-config.store';

interface Envelope<T> { success?: boolean; data?: T; }
interface CategoryDto { id: string; parentId?: string; name: string; slug: string; description?: string; icon?: string; displayOrder?: number; isActive?: boolean; isFeatured?: boolean; }
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private cache$?: Observable<Category[]>;
  constructor(private http: HttpClient, private tenantConfig: TenantConfigStore) {}
  private tenantId(): string {
    const id = this.tenantConfig.tenant()?.id;
    if (!id) throw new Error('Storefront tenant configuration is not loaded. Cannot request tenant-scoped categories.');
    return id;
  }
  private load(): Observable<Category[]> {
    if (!this.cache$) {
      const params = new HttpParams().set('tenantId', this.tenantId());
      this.cache$ = this.http.get<Envelope<CategoryDto[]>>(`${environment.apiGatewayUrl}/api/v1/catalog/categories`, { params })
        .pipe(map(r => (r.data || []).map(c => ({ id: c.id, name: c.name, slug: c.slug, description: c.description,
          icon: c.icon, image: c.icon, imageUrl: c.icon, parentId: c.parentId, parentCategoryId: c.parentId,
          isFeatured: !!c.isFeatured, order: c.displayOrder, status: c.isActive === false ? 'INACTIVE' as const : 'ACTIVE' as const }))),
          shareReplay(1));
    }
    return this.cache$;
  }
  getCategories(): Observable<Category[]> { return this.load(); }
  getTopLevelCategories(): Observable<Category[]> { return this.load().pipe(map(list => list.filter(c => !c.parentId && !c.parentCategoryId))); }
  getCategoriesByDepartment(department: string): Observable<Category[]> {
    return this.load().pipe(map(list => list.filter(c => c.name.toLowerCase() === department.toLowerCase())));
  }
  getSubcategories(parentCategoryId: string): Observable<Category[]> {
    return this.load().pipe(map(list => list.filter(c => c.parentId === parentCategoryId || c.parentCategoryId === parentCategoryId)));
  }
  getCategoriesByGender(_gender: 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX'): Observable<Category[]> { return this.getTopLevelCategories(); }
  getCategoryById(id: string): Observable<Category | undefined> { return this.load().pipe(map(list => list.find(c => c.id === id))); }
  getCategoryBySlug(slug: string): Observable<Category | undefined> { return this.load().pipe(map(list => list.find(c => c.slug === slug))); }
  getFeaturedCategories(): Observable<Category[]> { return this.load().pipe(map(list => list.filter(c => c.isFeatured))); }
}
