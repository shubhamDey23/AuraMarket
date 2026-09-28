import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, ProductSortOption } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { ProductCardComponent } from '../../../shared/components/product-card.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';

@Component({
  selector: 'app-category-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ProductCardComponent,
    PaginationComponent,
    AppIconComponent,
    EmptyStateComponent,
  ],
  template: `
    <div class="min-h-screen bg-slate-50 py-8">
      <div class="container space-y-8">
        <!-- Hero Header -->
        <div class="relative bg-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden shadow-lg border border-slate-800">
          <div class="relative z-10 max-w-2xl space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider">
              <app-icon [name]="iconName" [size]="14"></app-icon>
              <span>{{ departmentType === 'gender' ? 'Gender Collection' : 'Marketplace Department' }}</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">{{ title }}</h1>
            <p class="text-slate-300 text-sm sm:text-base leading-relaxed">{{ description }}</p>
          </div>

          <!-- Abstract background shape -->
          <div class="absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <!-- Subcategories Bar -->
        <div *ngIf="categories.length > 0" class="card bg-white p-4 space-y-2 border border-slate-200">
          <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Explore Sub-Departments</div>
          <div class="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              (click)="selectCategory('')"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
              [ngClass]="!selectedCategoryId ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
            >
              All {{ title }}
            </button>
            <button
              *ngFor="let cat of categories"
              (click)="selectCategory(cat.id)"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5"
              [ngClass]="selectedCategoryId === cat.id ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
            >
              <span>{{ cat.name }}</span>
              <span class="text-[10px] opacity-70">({{ cat.productCount || 0 }})</span>
            </button>
          </div>
        </div>

        <!-- Toolbar: Search & Sort -->
        <div class="card bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200">
          <div class="relative flex-1 max-w-md">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange()"
              placeholder="Search products in {{ title }}..."
              class="form-input text-xs pl-9"
            />
            <app-icon name="search" [size]="16" customClass="absolute left-3 top-2.5 text-slate-400"></app-icon>
          </div>

          <div class="flex items-center gap-3 justify-between sm:justify-end text-xs">
            <span class="text-slate-500 font-medium whitespace-nowrap">{{ totalProducts }} Products</span>
            <div class="flex items-center gap-2">
              <span class="text-slate-500">Sort:</span>
              <select
                [(ngModel)]="sortBy"
                (ngModelChange)="onSortChange()"
                class="form-select text-xs py-1.5 pr-8"
              >
                <option value="recommended">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Product Grid -->
        <div *ngIf="products.length > 0" class="grid-products">
          <app-product-card *ngFor="let product of products" [product]="product"></app-product-card>
        </div>

        <!-- Empty State -->
        <app-empty-state
          *ngIf="products.length === 0 && !loading"
          icon="shopping-bag"
          title="No products found"
          message="No items match your selected category or search terms in this department."
          actionText="Clear Filters"
          (action)="resetFilters()"
        ></app-empty-state>

        <!-- Pagination -->
        <app-pagination
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="totalProducts"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
})
export class CategoryLandingComponent implements OnInit {
  title = '';
  description = '';
  iconName = 'shopping-bag';
  departmentType: 'department' | 'gender' = 'department';
  deptValue = '';
  genderValue?: 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX';

  categories: Category[] = [];
  products: Product[] = [];
  selectedCategoryId = '';
  searchQuery = '';
  sortBy: ProductSortOption = 'recommended';

  currentPage = 1;
  pageSize = 12;
  totalProducts = 0;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.title = data['title'] || 'Category';
      this.description = data['description'] || 'Discover curated products in this department.';
      this.iconName = data['icon'] || 'shopping-bag';
      this.departmentType = data['departmentType'] || 'department';
      this.deptValue = data['department'] || '';
      this.genderValue = data['gender'];

      this.loadCategories();
      this.loadProducts();
    });
  }

  loadCategories(): void {
    if (this.genderValue) {
      this.categoryService.getCategoriesByGender(this.genderValue).subscribe((cats) => {
        this.categories = cats;
      });
    } else if (this.deptValue) {
      this.categoryService.getCategoriesByDepartment(this.deptValue).subscribe((cats) => {
        this.categories = cats;
      });
    }
  }

  loadProducts(): void {
    this.loading = true;
    this.productService
      .getProductsPaginated({
        department: this.genderValue ? undefined : this.deptValue,
        gender: this.genderValue,
        categoryId: this.selectedCategoryId || undefined,
        search: this.searchQuery || undefined,
        sortBy: this.sortBy,
        page: this.currentPage,
        pageSize: this.pageSize,
        status: 'ACTIVE',
      })
      .subscribe((res) => {
        this.products = res.products;
        this.totalProducts = res.totalCount;
        this.loading = false;
      });
  }

  selectCategory(catId: string): void {
    this.selectedCategoryId = catId;
    this.currentPage = 1; // Auto reset page to 1
    this.loadProducts();
  }

  onSearchChange(): void {
    this.currentPage = 1; // Auto reset page to 1
    this.loadProducts();
  }

  onSortChange(): void {
    this.currentPage = 1; // Auto reset page to 1
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadProducts();
  }

  resetFilters(): void {
    this.selectedCategoryId = '';
    this.searchQuery = '';
    this.sortBy = 'recommended';
    this.currentPage = 1;
    this.loadProducts();
  }
}
