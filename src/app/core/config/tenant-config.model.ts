export interface TenantInfo {
  id: string;
  tenantCode: string;
  name: string;
  slug: string;
  businessType: string;
  status: string;
  currency: string;
  locale: string;
  timezone: string;
}

export interface TenantBranding {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  fontFamily?: string;
  borderRadius?: string;
}

export interface MenuItem {
  id: string;
  parentId?: string;
  label: string;
  route: string;
  icon?: string;
  displayOrder?: number;
  isVisible?: boolean;
  requiredFeature?: string;
  openInNewTab?: boolean;
  children?: MenuItem[];
}

export type FeatureFlagMap = Record<string, boolean>;
export type TenantSettingMap = Record<string, string>;

export interface StorefrontConfigResponse {
  tenant: TenantInfo;
  branding: TenantBranding;
  features: FeatureFlagMap;
  menus: MenuItem[];
  settings: TenantSettingMap;
}
