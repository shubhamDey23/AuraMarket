import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { SellerService } from '../../../core/services/seller.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { Product } from '../../../core/models/product.model';
import { Seller } from '../../../core/models/user.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PriceDisplayComponent } from '../../../shared/components/price-display.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { MOCK_CATEGORIES } from '../../../data/mock/categories.mock';
import { MOCK_BRANDS } from '../../../data/mock/brands.mock';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AppIconComponent,
    PriceDisplayComponent,
    PaginationComponent,
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Global Marketplace Products</h1>
          <p class="text-xs text-slate-500 mt-1">Platform-wide product catalog moderation across all sellers ({{ products.length }} total)</p>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="card bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterProducts()"
            placeholder="Search product name, SKU, or seller..."
            class="form-input text-xs pl-9"
          />
          <app-icon name="search" [size]="16" customClass="absolute left-3 top-2.5 text-slate-400"></app-icon>
        </div>

        <div class="flex flex-wrap items-center gap-3 text-xs">
          <!-- Seller Filter -->
          <div>
            <select [(ngModel)]="sellerFilter" (ngModelChange)="filterProducts()" class="form-select text-xs py-1.5">
              <option value="ALL">All Sellers</option>
              <option *ngFor="let s of sellers" [value]="s.id">{{ s.storeName }}</option>
            </select>
          </div>

          <!-- Category Filter -->
          <div>
            <select [(ngModel)]="categoryFilter" (ngModelChange)="filterProducts()" class="form-select text-xs py-1.5">
              <option value="ALL">All Categories</option>
              <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <select [(ngModel)]="statusFilter" (ngModelChange)="filterProducts()" class="form-select text-xs py-1.5">
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="DRAFT">DRAFT</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="card bg-white p-6 space-y-4 border border-slate-200">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Seller Store</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let prod of paginatedProducts">
                <td>
                  <div class="flex items-center gap-3">
                    <img [src]="prod.featuredImage" class="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50" />
                    <div>
                      <div class="font-bold text-slate-900 text-xs line-clamp-1">
                        <a [routerLink]="['/admin/products', prod.id]" class="hover:text-indigo-600">
                          {{ prod.name }}
                        </a>
                      </div>
                      <div class="text-[10px] text-slate-400">Rating: ★ {{ prod.rating }}</div>
                    </div>
                  </div>
                </td>
                <td class="text-xs">
                  <div class="font-bold text-slate-900">{{ prod.sellerName || 'Marketplace Seller' }}</div>
                  <div class="text-[10px] text-slate-400">ID: {{ prod.sellerId }}</div>
                </td>
                <td class="font-mono text-xs text-slate-600">{{ prod.sku }}</td>
                <td class="text-xs text-slate-600">{{ prod.categoryName || 'Category' }}</td>
                <td>
                  <app-price-display [price]="prod.price" [salePrice]="prod.salePrice" priceClass="text-sm font-bold text-slate-900"></app-price-display>
                </td>
                <td class="font-bold text-xs text-slate-900">{{ prod.stockQuantity }} units</td>
                <td>
                  <span
                    class="badge text-[10px]"
                    [ngClass]="{
                      'badge-success': prod.status === 'ACTIVE',
                      'badge-neutral': prod.status === 'INACTIVE',
                      'badge-primary': prod.status === 'DRAFT',
                      'bg-red-50 text-red-700 border-red-200': prod.status === 'OUT_OF_STOCK'
                    }"
                  >
                    {{ prod.status }}
                  </span>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <a [routerLink]="['/admin/products', prod.id]" class="btn btn-xs btn-outline">
                      Inspect
                    </a>
                    <button
                      (click)="toggleStatus(prod)"
                      class="text-xs font-semibold px-2 py-1 rounded transition-colors"
                      [ngClass]="prod.status === 'ACTIVE' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'"
                    >
                      {{ prod.status === 'ACTIVE' ? 'Deactivate' : 'Activate' }}
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredProducts.length === 0">
                <td colspan="8" class="text-center py-8 text-slate-400 text-xs">
                  No marketplace products found matching your filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Universal Pagination -->
        <app-pagination
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="filteredProducts.length"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  sellers: Seller[] = [];

  categories = MOCK_CATEGORIES;
  brands = MOCK_BRANDS;

  searchQuery = '';
  sellerFilter = 'ALL';
  categoryFilter = 'ALL';
  statusFilter = 'ALL';

  currentPage = 1;
  pageSize = 10;

  constructor(
    private productService: ProductService,
    private sellerService: SellerService,
    private toastService: ToastService,
    private activityLogService: ActivityLogService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.productService.getProducts().subscribe((res) => {
      this.products = res;
      this.filterProducts();
    });

    this.sellerService.getSellers().subscribe((sel) => (this.sellers = sel));
  }

  filterProducts(): void {
    let result = [...this.products];
    if (this.sellerFilter !== 'ALL') {
      result = result.filter((p) => p.sellerId === this.sellerFilter);
    }
    if (this.categoryFilter !== 'ALL') {
      result = result.filter((p) => p.categoryId === this.categoryFilter);
    }
    if (this.statusFilter !== 'ALL') {
      result = result.filter((p) => p.status === this.statusFilter);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.sellerName && p.sellerName.toLowerCase().includes(q))
      );
    }
    this.filteredProducts = result;
    this.currentPage = 1; // Auto reset page to 1
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.paginate();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.paginate();
  }

  toggleStatus(prod: Product): void {
    this.productService.toggleProductStatus(prod.id).subscribe((updated) => {
      if (updated) {
        this.toastService.info(`Product "${prod.name}" status changed to ${updated.status}.`);
        this.activityLogService.logActivity(
          'PRODUCT_STATUS_CHANGED',
          'PRODUCT',
          prod.id,
          `Moderated product "${prod.name}" (Seller: ${prod.sellerName}) status to ${updated.status}.`
        );
        this.loadData();
      }
    });
  }
}
