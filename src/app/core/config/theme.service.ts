import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TenantBranding } from './tenant-config.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  applyTheme(branding: TenantBranding): void {
    if (!branding) return;

    const root = this.document.documentElement;

    const primary = branding.primaryColor || '#2F6B4F';
    const secondary = branding.secondaryColor || '#8BAF91';
    const accent = branding.accentColor || '#C69A45';
    const bg = branding.backgroundColor || '#F8FAF7';
    const surface = branding.surfaceColor || '#FFFFFF';
    const text = branding.textColor || '#1F2933';
    const fontFamily = branding.fontFamily || 'Inter, sans-serif';
    const borderRadius = branding.borderRadius || '8px';

    root.style.setProperty('--tenant-primary', primary);
    root.style.setProperty('--tenant-secondary', secondary);
    root.style.setProperty('--tenant-accent', accent);
    root.style.setProperty('--tenant-background', bg);
    root.style.setProperty('--tenant-surface', surface);
    root.style.setProperty('--tenant-text', text);
    root.style.setProperty('--tenant-font-family', fontFamily);
    root.style.setProperty('--tenant-border-radius', borderRadius);

    // Apply favicon if specified
    if (branding.faviconUrl) {
      this.updateFavicon(branding.faviconUrl);
    }
  }

  updateFavicon(faviconUrl: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel*='icon']");
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'shortcut icon';
      this.document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = faviconUrl;
  }
}
