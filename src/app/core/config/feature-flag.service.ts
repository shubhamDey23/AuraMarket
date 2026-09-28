import { Injectable, signal } from '@angular/core';
import { FeatureFlagMap } from './tenant-config.model';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  private flags = signal<FeatureFlagMap>({});

  readonly featureFlags = this.flags.asReadonly();

  setFeatures(features: FeatureFlagMap): void {
    this.flags.set(features || {});
  }

  isEnabled(featureCode: string): boolean {
    if (!featureCode) return true;
    return !!this.flags()[featureCode];
  }
}
