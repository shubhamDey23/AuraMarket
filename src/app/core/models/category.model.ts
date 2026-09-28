export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  image?: string;
  icon?: string;
  parentId?: string;
  parentCategoryId?: string;
  department?: string;
  gender?: 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX';
  productCount?: number;
  isFeatured?: boolean;
  order?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  subcategories?: Subcategory[];
}
