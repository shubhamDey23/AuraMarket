import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TenantResolverService {
  private static readonly STORAGE_KEY = 'auramarket_tenant_code';

  resolveTenantCode(): string {
    // 1. Check URL search param
    if (typeof window !== 'undefined' && window.location) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTenant = urlParams.get('tenantCode') || urlParams.get('tenant');
      if (urlTenant) {
        this.setTenantCode(urlTenant);
        return urlTenant;
      }
    }

    // 2. Check LocalStorage
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(TenantResolverService.STORAGE_KEY);
      if (stored && stored.trim().length > 0) {
        return stored.trim();
      }
    }

    // 3. Environment default
    return environment.defaultTenantCode || 'AURA_AYURVEDA';
  }

  setTenantCode(tenantCode: string): void {
    if (typeof localStorage !== 'undefined' && tenantCode) {
      localStorage.setItem(TenantResolverService.STORAGE_KEY, tenantCode);
    }
  }

  clearTenantCode(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TenantResolverService.STORAGE_KEY);
    }
  }
}
