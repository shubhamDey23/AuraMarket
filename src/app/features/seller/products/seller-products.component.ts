import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product } from '../../../core/models/product.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PriceDisplayComponent } from '../../../shared/components/price-display.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';

@Component({
  selector: 'app-seller-products',
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
          <h1 class="text-2xl font-bold text-slate-900">Manage Store Products</h1>
          <p class="text-xs text-slate-500 mt-1">
            Product catalog registered under <strong>{{ authService.currentSeller().storeName }}</strong> ({{ products.length }} items)
          </p>
        </div>
        <a routerLink="/seller/products/new" class="btn btn-primary flex items-center gap-1">
          <app-icon name="plus" [size]="16"></app-icon> Add New Product
        </a>
      </div>

      <!-- Filters & Search -->
      <div class="card bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterProducts()"
            placeholder="Search by product name, SKU, or tags..."
            class="form-input text-xs pl-9"
          />
          <app-icon name="search" [size]="16" customClass="absolute left-3 top-2.5 text-slate-400"></app-icon>
        </div>

        <div class="flex items-center gap-2 text-xs">
          <label class="text-slate-500">Filter Status:</label>
          <select [(ngModel)]="statusFilter" (ngModelChange)="filterProducts()" class="form-select text-xs py-1.5">
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="DRAFT">DRAFT</option>
            <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
          </select>
        </div>
      </div>

      <!-- Products Table -->
      <div class="card bg-white p-6 space-y-4 border border-slate-200">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let prod of paginatedProducts">
                <td>
                  <div class="flex items-center gap-3">
                    <img [src]="prod.featuredImage" class="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0" />
                    <div>
                      <div class="font-bold text-slate-900 text-xs line-clamp-1">
                        <a [routerLink]="['/products', prod.id]" target="_blank" class="hover:text-indigo-600">
                          {{ prod.name }}
                        </a>
                      </div>
                      <div class="text-[11px] text-slate-400">Rating: ★ {{ prod.rating }} ({{ prod.reviewCount }} reviews)</div>
                    </div>
                  </div>
                </td>
                <td class="font-mono text-xs text-slate-700 font-semibold">{{ prod.sku }}</td>
                <td class="text-xs text-slate-600">{{ prod.categoryName || 'Category' }}</td>
                <td>
                  <app-price-display [price]="prod.price" [salePrice]="prod.salePrice" priceClass="text-sm font-bold text-slate-900"></app-price-display>
                </td>
                <td>
                  <span class="font-bold text-xs" [ngClass]="prod.stockQuantity <= 5 ? 'text-amber-600' : 'text-slate-900'">
                    {{ prod.stockQuantity }} units
                  </span>
                </td>
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
                <td class="text-xs text-slate-500">{{ prod.createdAt }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <a [routerLink]="['/seller/products', prod.id]" class="btn btn-xs btn-outline flex items-center gap-1">
                      <app-icon name="edit" [size]="12"></app-icon> Edit
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
                  No products found for <strong>{{ authService.currentSeller().storeName }}</strong> matching your filters.
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
export class SellerProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  searchQuery = '';
  statusFilter = 'ALL';
  currentPage = 1;
  pageSize = 10;

  constructor(
    public authService: AuthService,
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    const sellerId = this.authService.currentSellerId();
    this.productService.getSellerProducts(sellerId).subscribe((res) => {
      this.products = res;
      this.filterProducts();
    });
  }

  filterProducts(): void {
    let result = [...this.products];
    if (this.statusFilter !== 'ALL') {
      result = result.filter((p) => p.status === this.statusFilter);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q))
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
        this.loadProducts();
      }
    });
  }
}
