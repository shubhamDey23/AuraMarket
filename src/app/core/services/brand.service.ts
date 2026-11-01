import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Brand } from '../models/brand.model';
import { environment } from '../../../environments/environment';
import { TenantConfigStore } from '../config/tenant-config.store';

interface Envelope<T> { success?: boolean; data?: T; }
interface BrandDto { id: string; name: string; slug: string; description?: string; logoUrl?: string; isActive?: boolean; isFeatured?: boolean; }
@Injectable({ providedIn: 'root' })
export class BrandService {
  private brands$?: Observable<Brand[]>;
  constructor(private http: HttpClient, private tenantConfig: TenantConfigStore) {}
  private load(): Observable<Brand[]> {
    if (!this.brands$) {
      const tenantId = this.tenantConfig.tenant()?.id;
      if (!tenantId) throw new Error('Storefront tenant configuration is not loaded. Cannot request tenant-scoped brands.');
      const params = new HttpParams().set('tenantId', tenantId);
      this.brands$ = this.http.get<Envelope<BrandDto[]>>(`${environment.apiGatewayUrl}/api/v1/catalog/brands`, { params })
        .pipe(map(r => (r.data || []).map(b => ({ id: b.id, name: b.name, slug: b.slug, logoUrl: b.logoUrl || '', logo: b.logoUrl || '',
          description: b.description || '', productCount: 0, isFeatured: !!b.isFeatured,
          status: b.isActive === false ? 'INACTIVE' as const : 'ACTIVE' as const }))), shareReplay(1));
    }
    return this.brands$;
  }
  getBrands(): Observable<Brand[]> { return this.load(); }
  getFeaturedBrands(): Observable<Brand[]> { return this.load().pipe(map(list => list.filter(b => b.isFeatured))); }
  getBrandById(id: string): Observable<Brand | undefined> { return this.load().pipe(map(list => list.find(b => b.id === id))); }
}
