export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  logo?: string;
  description: string;
  websiteUrl?: string;
  productCount: number;
  isFeatured: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
}
