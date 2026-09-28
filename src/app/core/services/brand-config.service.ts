import { Injectable, signal, computed } from '@angular/core';
import { BRAND_CONFIG, BrandConfig } from '../constants/brand.config';

@Injectable({
  providedIn: 'root',
})
export class BrandConfigService {
  private config = signal<BrandConfig>({ ...BRAND_CONFIG });

  readonly brandConfig = this.config.asReadonly();

  readonly brandName = computed(() => this.config().brandName);
  readonly brandShortName = computed(() => this.config().brandShortName);
  readonly brandTagline = computed(() => this.config().brandTagline);
  readonly heroHeadline = computed(() => this.config().heroHeadline);
  readonly heroSubtitle = computed(() => this.config().heroSubtitle);
  readonly searchPlaceholder = computed(() => this.config().searchPlaceholder);

  updateConfig(partial: Partial<BrandConfig>): void {
    this.config.update((current) => ({ ...current, ...partial }));
  }
}
