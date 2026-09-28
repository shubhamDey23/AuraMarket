import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, ProductFilterParams, ProductSortOption } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { BrandService } from '../../../core/services/brand.service';
import { SellerService } from '../../../core/services/seller.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { Brand } from '../../../core/models/brand.model';
import { Seller } from '../../../core/models/user.model';
import { ProductCardComponent } from '../../../shared/components/product-card.component';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { FilterBarComponent } from '../../../shared/ecommerce/filter-bar.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { ProductSkeletonComponent } from '../../../shared/ui/product-skeleton.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ProductCardComponent,
    AppIconComponent,
    EmptyStateComponent,
    FilterBarComponent,
    PaginationComponent,
    ProductSkeletonComponent,
  ],
  template: `
    <div class="container space-y-6">
      <!-- Top Title & Search Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900">
            {{ searchQuery ? 'Search Results for "' + searchQuery + '"' : 'Products Catalogue' }}
          </h1>
          <p class="text-xs text-slate-500 mt-1">Showing {{ totalCount }} products across marketplace stores</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Sort Dropdown -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500 font-semibold whitespace-nowrap">Sort By:</span>
            <select
              [ngModel]="filters.sortBy || 'recommended'"
              (ngModelChange)="onSortChange($event)"
              class="form-select text-xs py-1.5 px-3 bg-slate-50 border-slate-200 rounded-xl"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="newest">Newest Arrivals</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>

          <!-- Mobile Filter Toggle Button -->
          <button (click)="isMobileFilterOpen = !isMobileFilterOpen" class="md:hidden btn btn-sm btn-outline flex items-center gap-1 font-semibold">
            <app-icon name="filter" [size]="14"></app-icon> Filters
          </button>
        </div>
      </div>

      <!-- Main Layout: Filter Sidebar + Catalogue Grid -->
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <!-- Filter Desktop Sidebar -->
        <aside class="hidden md:block w-64 bg-white p-5 rounded-2xl border border-slate-200 shrink-0">
          <app-filter-bar
            [categories]="categories"
            [brands]="brands"
            [sellers]="sellers"
            [filters]="filters"
            (filterChange)="onFilterChanged($event)"
          ></app-filter-bar>
        </aside>

        <!-- Mobile Filter Drawer Overlay -->
        <div *ngIf="isMobileFilterOpen" class="md:hidden fixed inset-0 z-50 flex">
          <div (click)="isMobileFilterOpen = false" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"></div>
          <div class="relative flex-1 max-w-xs w-full bg-white p-6 overflow-y-auto z-50 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 class="font-bold text-slate-900 text-sm">Filter Products</h3>
                <button (click)="isMobileFilterOpen = false" class="text-slate-400"><app-icon name="x" [size]="20"></app-icon></button>
              </div>
              <app-filter-bar
                [categories]="categories"
                [brands]="brands"
                [sellers]="sellers"
                [filters]="filters"
                (filterChange)="onFilterChanged($event)"
              ></app-filter-bar>
            </div>
            <button (click)="isMobileFilterOpen = false" class="btn btn-primary w-full mt-6">Apply Filters</button>
          </div>
        </div>

        <!-- Catalogue Grid & Loading Skeletons -->
        <main class="flex-1 w-full">
          <app-product-skeleton *ngIf="isLoading" type="grid"></app-product-skeleton>

          <div *ngIf="!isLoading">
            <div *ngIf="products.length > 0; else noProducts" class="space-y-6">
              <div class="grid-products">
                <app-product-card *ngFor="let prod of products" [product]="prod"></app-product-card>
              </div>

              <!-- Pagination Component -->
              <app-pagination
                [currentPage]="page"
                [totalPages]="totalPages"
                [totalItems]="totalCount"
                (pageChange)="onPageChange($event)"
              ></app-pagination>
            </div>

            <ng-template #noProducts>
              <app-empty-state
                icon="search"
                title="No products match your criteria"
                description="Try clearing your filters or searching for a different product keyword."
                actionLabel="Clear Filters"
                (action)="resetFilters()"
              ></app-empty-state>
            </ng-template>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  sellers: Seller[] = [];

  filters: ProductFilterParams = {};
  searchQuery = '';
  isLoading = true;

  page = 1;
  pageSize = 12;
  totalCount = 0;
  totalPages = 1;

  isMobileFilterOpen = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private sellerService: SellerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((res) => (this.categories = res));
    this.brandService.getBrands().subscribe((res) => (this.brands = res));
    this.sellerService.getSellers().subscribe((res) => (this.sellers = res));

    this.route.queryParams.subscribe((qp) => {
      this.page = qp['page'] ? parseInt(qp['page'], 10) : 1;
      this.searchQuery = qp['q'] || qp['search'] || '';

      this.filters = {
        categoryId: qp['category'] || qp['categoryId'],
        brandId: qp['brand'] || qp['brandId'],
        sellerId: qp['seller'] || qp['sellerId'],
        minPrice: qp['minPrice'] ? parseFloat(qp['minPrice']) : undefined,
        maxPrice: qp['maxPrice'] ? parseFloat(qp['maxPrice']) : undefined,
        inStockOnly: qp['inStock'] === 'true',
        hasDiscount: qp['discount'] === 'true',
        sortBy: (qp['sort'] as ProductSortOption) || 'recommended',
        search: this.searchQuery,
        page: this.page,
        pageSize: this.pageSize,
      };

      this.fetchProducts();
    });
  }

  fetchProducts(): void {
    this.isLoading = true;
    this.productService.getProductsPaginated(this.filters).subscribe((res) => {
      this.products = res.products;
      this.totalCount = res.totalCount;
      this.page = res.page;
      this.totalPages = res.totalPages;
      this.isLoading = false;
    });
  }

  onFilterChanged(updatedFilters: ProductFilterParams): void {
    this.filters = { ...updatedFilters, page: 1 };
    this.updateUrlQueryParams();
  }

  onSortChange(sortBy: ProductSortOption): void {
    this.filters.sortBy = sortBy;
    this.filters.page = 1;
    this.updateUrlQueryParams();
  }

  onPageChange(newPage: number): void {
    this.filters.page = newPage;
    this.updateUrlQueryParams();
  }

  resetFilters(): void {
    this.filters = { page: 1, pageSize: this.pageSize, sortBy: 'recommended' };
    this.updateUrlQueryParams();
  }

  private updateUrlQueryParams(): void {
    const qp: Record<string, string | number | boolean | null> = {
      category: this.filters.categoryId || null,
      brand: this.filters.brandId || null,
      seller: this.filters.sellerId || null,
      minPrice: this.filters.minPrice || null,
      maxPrice: this.filters.maxPrice || null,
      inStock: this.filters.inStockOnly ? true : null,
      discount: this.filters.hasDiscount ? true : null,
      sort: this.filters.sortBy && this.filters.sortBy !== 'recommended' ? this.filters.sortBy : null,
      q: this.filters.search || null,
      page: this.filters.page && this.filters.page > 1 ? this.filters.page : null,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: qp,
      queryParamsHandling: 'merge',
    });
  }
}
