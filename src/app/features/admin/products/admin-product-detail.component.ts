import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { Product } from '../../../core/models/product.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-admin-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  template: `
    <div class="container space-y-6 max-w-4xl">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/admin/dashboard" class="hover:text-indigo-600">Admin Console</a> /
        <a routerLink="/admin/products" class="hover:text-indigo-600">Global Products</a> /
        <span class="text-slate-800 font-medium">Product Moderation Inspection</span>
      </nav>

      <div *ngIf="product" class="space-y-6">
        <!-- Main Product Summary Card -->
        <div class="card p-6 bg-white space-y-6 border border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div class="flex items-center gap-4">
              <img [src]="product.featuredImage" class="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0 bg-slate-50" />
              <div>
                <div class="flex items-center gap-3">
                  <h1 class="text-xl font-bold text-slate-900">{{ product.name }}</h1>
                  <span class="badge badge-success text-xs">{{ product.status }}</span>
                </div>
                <p class="text-xs text-slate-500 mt-1">
                  SKU: <strong class="text-slate-700 font-mono">{{ product.sku }}</strong> • Category: {{ product.categoryName }}
                </p>
              </div>
            </div>

            <!-- Moderation Actions -->
            <div class="flex items-center gap-2">
              <button
                *ngIf="product.status === 'ACTIVE'"
                (click)="toggleStatus()"
                class="btn btn-sm btn-outline text-red-600 border-red-200 hover:bg-red-50 text-xs"
              >
                Suspend Listing
              </button>
              <button
                *ngIf="product.status === 'INACTIVE'"
                (click)="toggleStatus()"
                class="btn btn-sm btn-primary text-xs"
              >
                Approve & Activate
              </button>
            </div>
          </div>

          <!-- Seller Affiliation Banner -->
          <div class="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2">
              <app-icon name="store" [size]="16" class="text-indigo-600"></app-icon>
              <p class="text-slate-700">
                Registered Store: <strong>{{ product.sellerName || 'Marketplace Seller' }}</strong> (Seller ID: <span class="font-mono">{{ product.sellerId }}</span>)
              </p>
            </div>
            <a [routerLink]="['/admin/sellers', product.sellerId]" class="btn btn-xs btn-outline bg-white font-bold">
              Inspect Seller
            </a>
          </div>

          <!-- Product Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-2">
            <div class="space-y-3">
              <h3 class="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">Pricing & Financials</h3>
              <div class="p-3 bg-slate-50 rounded-xl space-y-2 text-slate-700">
                <div class="flex justify-between">
                  <span>Regular Listing Price:</span>
                  <span class="font-bold text-slate-900">{{ formatInr(product.priceInINR || product.price) }}</span>
                </div>
                <div *ngIf="product.discountPriceInINR || product.salePrice" class="flex justify-between text-emerald-600 font-bold">
                  <span>Promotional Sale Price:</span>
                  <span>{{ formatInr(product.discountPriceInINR || product.salePrice!) }} ({{ product.discountPercentage }}% off)</span>
                </div>
              </div>

              <h3 class="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1 pt-2">Inventory Stock Level</h3>
              <div class="p-3 bg-slate-50 rounded-xl space-y-2 text-slate-700">
                <div class="flex justify-between">
                  <span>Available Seller Quantity:</span>
                  <span class="font-extrabold text-slate-900 text-sm">{{ product.stockQuantity }} units</span>
                </div>
              </div>

              <h3 class="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1 pt-2">AYUSH Regulatory Compliance</h3>
              <div class="p-3 bg-emerald-50/50 rounded-xl space-y-2 text-slate-700 border border-emerald-100">
                <div class="flex justify-between">
                  <span>Product Classification:</span>
                  <span class="font-semibold text-emerald-900">{{ product.productType || 'Proprietary Ayurvedic' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>AYUSH License No:</span>
                  <span class="font-mono font-bold text-slate-800">{{ product.licenseInformation || 'AYUSH/MP/2021/4891' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Prescription Required:</span>
                  <span [class]="product.requiresPrescription ? 'font-bold text-amber-700' : 'text-slate-600'">
                    {{ product.requiresPrescription ? 'Yes (Ayurveda Doctor Rx)' : 'No (Over The Counter)' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">Description & Specifications</h3>
              <div class="p-3 bg-slate-50 rounded-xl space-y-2 text-slate-700 leading-relaxed">
                <p>{{ product.description }}</p>
              </div>

              <div *ngIf="product.ingredients?.length" class="space-y-1">
                <h3 class="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">Active Botanical Ingredients</h3>
                <div class="flex flex-wrap gap-1 pt-1">
                  <span *ngFor="let herb of product.ingredients" class="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] rounded-md border border-emerald-200">
                    🌿 {{ herb }}
                  </span>
                </div>
              </div>

              <h3 class="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1 pt-2">Tags</h3>
              <div class="flex flex-wrap gap-1">
                <span *ngFor="let tag of product.tags" class="badge badge-neutral text-[10px]">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminProductDetailComponent implements OnInit {
  formatInr = formatInr;
  productId: string | null = null;
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private toastService: ToastService,
    private activityLogService: ActivityLogService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe((p) => {
        if (p) this.product = p;
      });
    }
  }

  toggleStatus(): void {
    if (!this.product) return;
    this.productService.toggleProductStatus(this.product.id).subscribe((updated) => {
      if (updated) {
        this.product = updated;
        this.toastService.info(`Product status changed to ${updated.status}.`);
        this.activityLogService.logActivity(
          'PRODUCT_STATUS_CHANGED',
          'PRODUCT',
          this.product.id,
          `Moderated status for "${this.product.name}" to ${updated.status}.`
        );
      }
    });
  }
}
