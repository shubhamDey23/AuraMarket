import { Injectable, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StorefrontConfigResponse, MenuItem } from './tenant-config.model';
import { TenantConfigService } from './tenant-config.service';
import { TenantResolverService } from './tenant-resolver.service';
import { ThemeService } from './theme.service';
import { FeatureFlagService } from './feature-flag.service';
import { BrandConfigService } from '../services/brand-config.service';

@Injectable({
  providedIn: 'root',
})
export class TenantConfigStore {
  readonly config = signal<StorefrontConfigResponse | null>(null);
  readonly loading = signal<boolean>(false);
  readonly loaded = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly tenant = computed(() => this.config()?.tenant ?? null);
  readonly branding = computed(() => this.config()?.branding ?? null);
  readonly features = computed(() => this.config()?.features ?? {});
  readonly menus = computed(() => this.config()?.menus ?? []);
  readonly settings = computed(() => this.config()?.settings ?? {});

  readonly tenantName = computed(() => this.tenant()?.name ?? 'Aura Market');
  readonly logoUrl = computed(() => this.branding()?.logoUrl ?? '');
  readonly primaryColor = computed(() => this.branding()?.primaryColor ?? '#2F6B4F');

  constructor(
    private tenantConfigService: TenantConfigService,
    private tenantResolver: TenantResolverService,
    private themeService: ThemeService,
    private featureFlagService: FeatureFlagService,
    private brandConfigService: BrandConfigService
  ) {}

  async loadConfig(tenantCode?: string): Promise<StorefrontConfigResponse | null> {
    const code = tenantCode || this.tenantResolver.resolveTenantCode();
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await firstValueFrom(this.tenantConfigService.getStorefrontConfig(code));
      this.config.set(response);
      this.loaded.set(true);
      this.loading.set(false);

      if (response) {
        // Apply theme CSS variables & favicon
        this.themeService.applyTheme(response.branding);
        // Set feature flags
        this.featureFlagService.setFeatures(response.features);
        // Update BrandConfigService for compatibility with existing components
        this.brandConfigService.updateConfig({
          brandName: response.tenant.name,
          brandShortName: response.tenant.name.split(' ')[0],
          brandLogoText: response.tenant.name.split(' ')[0],
          brandLogoSubtitle: response.tenant.name.split(' ').slice(1).join(' '),
        });
      }
      return response;
    } catch (err: any) {
      console.error('Failed to load tenant configuration for code:', code, err);
      this.error.set(err?.message || 'Failed to load tenant configuration');
      this.loading.set(false);
      return null;
    }
  }

  async switchTenant(newTenantCode: string): Promise<void> {
    this.tenantResolver.setTenantCode(newTenantCode);
    await this.loadConfig(newTenantCode);
  }

  isFeatureEnabled(featureCode: string): boolean {
    return this.featureFlagService.isEnabled(featureCode);
  }
}
