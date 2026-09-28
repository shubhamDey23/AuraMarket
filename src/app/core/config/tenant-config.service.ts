import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorefrontConfigResponse } from './tenant-config.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TenantConfigService {
  constructor(private http: HttpClient) {}

  getStorefrontConfig(tenantCode: string): Observable<StorefrontConfigResponse> {
    const url = `${environment.apiGatewayUrl}/api/v1/storefront/config?tenantCode=${encodeURIComponent(tenantCode)}`;
    return this.http.get<StorefrontConfigResponse>(url);
  }
}
