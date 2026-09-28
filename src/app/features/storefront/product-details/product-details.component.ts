import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product } from '../../../core/models/product.model';
import { PriceDisplayComponent } from '../../../shared/components/price-display.component';
import { RatingComponent } from '../../../shared/components/rating.component';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { ProductGalleryComponent } from '../../../shared/ecommerce/product-gallery.component';
import { SellerTrustBadgeComponent } from '../../../shared/marketplace/seller-trust-badge.component';
import { ProductSkeletonComponent } from '../../../shared/ui/product-skeleton.component';
import { formatInr } from '../../../core/utils/currency.util';

export type ProductTab = 
  | 'overview' 
  | 'ingredients' 
  | 'usage' 
  | 'storage' 
  | 'manufacturer' 
  | 'batch' 
  | 'seller' 
  | 'safety' 
  | 'shipping' 
  | 'questions';

export interface CustomerQuestion {
  id: string;
  question: string;
  askedBy: string;
  askedDate: string;
  answer?: string;
  answeredBy?: string;
  answeredDate?: string;
}

export interface ProductReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  isVerified: boolean;
  helpfulCount: number;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PriceDisplayComponent,
    RatingComponent,
    AppIconComponent,
    ProductGalleryComponent,
    SellerTrustBadgeComponent,
    ProductSkeletonComponent,
  ],
  template: `
    <div class="container space-y-8 pb-16">
      <!-- Loading Skeleton -->
      <app-product-skeleton *ngIf="isLoading" type="detail"></app-product-skeleton>

      <div *ngIf="!isLoading && product" class="space-y-8">
        <!-- Breadcrumbs Navigation -->
        <nav class="flex items-center gap-2 text-xs text-[#64748B] flex-wrap">
          <a routerLink="/" class="hover:text-[#2F6B4F]">Home</a> /
          <a routerLink="/products" class="hover:text-[#2F6B4F]">Ayurveda Catalog</a> /
          <a [routerLink]="['/products']" [queryParams]="{ category: product.categoryId }" class="hover:text-[#2F6B4F]">{{ product.categoryName || 'Products' }}</a> /
          <span class="text-[#1F2933] font-medium truncate max-w-xs sm:max-w-md">{{ product.name }}</span>
        </nav>

        <!-- Main Product Summary Card -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 sm:p-8 rounded-3xl border border-[#DDE7DF] shadow-xs">
          <!-- Left Column: Product Gallery -->
          <div class="space-y-4">
            <app-product-gallery
              [images]="product.images"
              [featuredImage]="product.featuredImage"
              [altText]="product.name"
            ></app-product-gallery>

            <!-- Quick Key Highlights Bar -->
            <div class="grid grid-cols-3 gap-2 text-center text-[11px] font-medium text-[#64748B] pt-2">
              <div class="p-2.5 bg-[#F8FAF7] rounded-xl border border-[#DDE7DF]">
                <app-icon name="shield" [size]="16" customClass="mx-auto text-[#2F6B4F] mb-1"></app-icon>
                <span>AYUSH Compliant</span>
              </div>
              <div class="p-2.5 bg-[#F8FAF7] rounded-xl border border-[#DDE7DF]">
                <app-icon name="sparkles" [size]="16" customClass="mx-auto text-[#8BAF91] mb-1"></app-icon>
                <span>100% Herbal Active</span>
              </div>
              <div class="p-2.5 bg-[#F8FAF7] rounded-xl border border-[#DDE7DF]">
                <app-icon name="truck" [size]="16" customClass="mx-auto text-[#C69A45] mb-1"></app-icon>
                <span>Fast Doorstep Delivery</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Product Meta, Pricing, Rx Restriction & Actions -->
          <div class="flex flex-col justify-between space-y-6">
            <div class="space-y-4">
              <!-- Seller Trust Badge Component -->
              <app-seller-trust-badge
                [sellerId]="product.sellerId"
                [sellerName]="product.sellerName || 'Verified Ayurvedic Pharmacy'"
                [sellerRating]="4.8"
              ></app-seller-trust-badge>

              <!-- Prescription Restriction Notice & Upload Interface -->
              <div *ngIf="product.requiresPrescription" class="p-4 bg-[#FFF8F8] border border-[#C62828]/30 rounded-2xl space-y-3">
                <div class="flex items-start gap-3 text-xs text-[#C62828]">
                  <app-icon name="shield" [size]="20" customClass="text-[#C62828] shrink-0 mt-0.5"></app-icon>
                  <div>
                    <h4 class="font-extrabold text-[#C62828] text-sm">Ayurveda Doctor Prescription Required (Rx)</h4>
                    <p class="text-[#64748B] mt-1 leading-relaxed">
                      This classical formulation contains potent herbomineral ingredients requiring verification by a registered Ayurveda practitioner or licensed pharmacist.
                    </p>
                  </div>
                </div>

                <!-- Prescription File Upload UI -->
                <div class="p-3 bg-white border border-dashed border-[#C62828]/40 rounded-xl space-y-2">
                  <div *ngIf="!prescriptionAttached" class="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div class="text-xs text-[#1F2933]">
                      <span class="font-bold">Attach Prescription:</span>
                      <p class="text-[11px] text-[#64748B]">Upload doctor memo (.pdf, .jpg, .png max 5MB)</p>
                    </div>
                    <label class="cursor-pointer btn btn-xs bg-[#C62828] hover:bg-[#A82020] text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0">
                      <app-icon name="upload" [size]="14"></app-icon>
                      <span>Upload Rx Document</span>
                      <input type="file" (change)="onPrescriptionUpload($event)" accept=".pdf,.png,.jpg,.jpeg" class="hidden" />
                    </label>
                  </div>

                  <!-- Prescription Attached State -->
                  <div *ngIf="prescriptionAttached" class="flex items-center justify-between text-xs bg-[#EAF4EC] p-2.5 rounded-lg border border-[#2E7D32]/30">
                    <div class="flex items-center gap-2 text-[#2E7D32]">
                      <app-icon name="check-circle" [size]="18"></app-icon>
                      <div>
                        <span class="font-bold truncate max-w-[200px] inline-block">{{ prescriptionFileName }}</span>
                        <p class="text-[10px] text-[#64748B]">Pending Verification by Registered Pharmacist</p>
                      </div>
                    </div>
                    <button (click)="removePrescription()" class="text-[#C62828] hover:underline text-[11px] font-bold">Remove</button>
                  </div>
                </div>
              </div>

              <!-- Product Title & Net Quantity -->
              <div>
                <h1 class="text-2xl sm:text-3xl font-extrabold text-[#1F2933] tracking-tight leading-snug">
                  {{ product.name }}
                </h1>
                <p *ngIf="getNetQuantity()" class="text-xs font-semibold text-[#2F6B4F] mt-1 flex items-center gap-1">
                  <app-icon name="package" [size]="14"></app-icon>
                  <span>Net Quantity / Pack Size: <strong>{{ getNetQuantity() }}</strong></span>
                </p>
              </div>

              <!-- Badges, Brand, SKU & Ratings -->
              <div class="flex flex-wrap items-center gap-3 text-xs">
                <span *ngIf="product.productType" class="font-bold text-[#2F6B4F] bg-[#EAF4EC] px-2.5 py-1 rounded-full uppercase tracking-wider text-[11px]">
                  {{ product.productType }}
                </span>
                <span *ngIf="product.brandName" class="font-bold text-[#1F2933] bg-[#F8FAF7] border border-[#DDE7DF] px-2.5 py-1 rounded-full text-[11px]">
                  Brand: {{ product.brandName }}
                </span>
                <span class="text-[#64748B]">SKU: <strong class="text-[#1F2933] font-mono">{{ product.sku }}</strong></span>
                <app-rating [rating]="product.rating" [reviewCount]="product.reviewCount"></app-rating>
              </div>

              <!-- Customer-Safe Stock Badge -->
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  [ngClass]="{
                    'bg-[#EAF4EC] text-[#2E7D32] border border-[#2E7D32]/30': product.stockQuantity > 10,
                    'bg-[#FFFDF5] text-[#B7791F] border border-[#B7791F]/30': product.stockQuantity > 0 && product.stockQuantity <= 10,
                    'bg-[#FDF2F2] text-[#C62828] border border-[#C62828]/30': product.stockQuantity === 0
                  }"
                >
                  <span class="w-2 h-2 rounded-full" [ngClass]="product.stockQuantity > 10 ? 'bg-[#2E7D32]' : product.stockQuantity > 0 ? 'bg-[#B7791F]' : 'bg-[#C62828]'"></span>
                  <span>{{ getCustomerStockLabel() }}</span>
                </span>
              </div>

              <!-- Price Display with INR Formatting -->
              <div class="py-4 border-y border-[#DDE7DF] flex flex-wrap items-baseline gap-4">
                <app-price-display
                  [price]="product.priceInINR || product.price"
                  [salePrice]="product.discountPriceInINR || product.salePrice"
                  [discountPercentage]="product.discountPercentage"
                  priceClass="text-3xl font-extrabold text-[#1F2933]"
                ></app-price-display>
                <span class="text-xs text-[#64748B] font-medium">(Inclusive of all applicable taxes)</span>
              </div>

              <!-- Short Description -->
              <p class="text-[#64748B] text-sm leading-relaxed">
                {{ product.shortDescription || product.description }}
              </p>

              <!-- Quantity Selector & Action Buttons -->
              <div class="space-y-4 pt-2">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-[#1F2933]">Select Quantity:</span>
                  <div class="flex items-center border border-[#DDE7DF] rounded-xl overflow-hidden bg-[#F8FAF7]">
                    <button (click)="quantity = Math.max(1, quantity - 1)" class="px-3.5 py-1.5 text-[#1F2933] hover:bg-[#EAF4EC] font-bold">-</button>
                    <span class="px-4 py-1.5 text-xs font-extrabold text-[#1F2933]">{{ quantity }}</span>
                    <button (click)="quantity = quantity + 1" class="px-3.5 py-1.5 text-[#1F2933] hover:bg-[#EAF4EC] font-bold">+</button>
                  </div>
                </div>

                <!-- Add to Cart & Buy Now Buttons -->
                <div class="flex flex-wrap gap-3">
                  <button
                    (click)="addToCart()"
                    [disabled]="product.stockQuantity === 0"
                    class="btn btn-lg bg-[#2F6B4F] hover:bg-[#24543D] text-white flex-1 flex items-center justify-center gap-2 rounded-xl font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <app-icon name="shopping-cart" [size]="20"></app-icon>
                    <span>Add to Cart</span>
                  </button>

                  <button
                    (click)="buyNow()"
                    [disabled]="product.stockQuantity === 0"
                    class="btn btn-lg bg-[#C69A45] hover:bg-[#B7791F] text-white flex-1 flex items-center justify-center gap-2 rounded-xl font-bold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <app-icon name="check" [size]="20"></app-icon>
                    <span>Buy Now</span>
                  </button>

                  <!-- Wishlist Toggle Button -->
                  <button
                    (click)="toggleWishlist()"
                    class="btn btn-lg border border-[#DDE7DF] p-3 rounded-xl flex items-center justify-center hover:bg-[#EAF4EC]"
                    [ngClass]="isInWishlist() ? 'text-[#C62828] border-[#C62828] bg-[#FDF2F2]' : 'text-[#64748B]'"
                    [title]="isInWishlist() ? 'Remove from Wishlist' : 'Add to Wishlist'"
                  >
                    <app-icon name="heart" [size]="22" [customClass]="isInWishlist() ? 'fill-[#C62828]' : ''"></app-icon>
                  </button>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div class="pt-4 border-t border-[#DDE7DF] space-y-2 text-xs">
              <span class="font-bold text-[#1F2933]">Product Categories & Keywords:</span>
              <div class="flex flex-wrap gap-1.5">
                <span *ngFor="let tag of product.tags" class="bg-[#EAF4EC] text-[#2F6B4F] px-2.5 py-0.5 rounded-full text-[11px] font-semibold lowercase">#{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Prominent Visible Safety Advisory Panel -->
        <div class="bg-[#FFFDF5] border border-[#F5EFE2] p-5 sm:p-6 rounded-3xl space-y-3">
          <div class="flex items-center gap-3 text-[#B7791F]">
            <app-icon name="shield" [size]="24" customClass="text-[#B7791F] shrink-0"></app-icon>
            <h3 class="font-extrabold text-[#1F2933] text-base">Safety & Responsible Usage Guidance</h3>
          </div>
          <p class="text-xs text-[#1F2933] leading-relaxed font-semibold">
            "Please read the product label and usage instructions carefully. Consult a qualified healthcare practitioner when necessary."
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[11px] text-[#64748B] pt-2 border-t border-[#F5EFE2]">
            <div class="flex items-start gap-1.5">
              <span class="text-[#2F6B4F] font-bold">✓</span>
              <span>Individual Prakriti (body constitution) responses may vary.</span>
            </div>
            <div class="flex items-start gap-1.5">
              <span class="text-[#2F6B4F] font-bold">✓</span>
              <span>Not intended to replace emergency medical care.</span>
            </div>
            <div class="flex items-start gap-1.5">
              <span class="text-[#2F6B4F] font-bold">✓</span>
              <span>Consult doctor if pregnant, nursing, or on long-term medication.</span>
            </div>
            <div class="flex items-start gap-1.5">
              <span class="text-[#2F6B4F] font-bold">✓</span>
              <span>Do not exceed the recommended daily dosage.</span>
            </div>
          </div>
        </div>

        <!-- 10 Structured Product Tabs Navigation -->
        <div class="bg-white rounded-3xl border border-[#DDE7DF] shadow-xs overflow-hidden">
          <!-- Horizontal Scrollable Tab Bar -->
          <div class="flex items-center gap-1 overflow-x-auto border-b border-[#DDE7DF] bg-[#F8FAF7] p-2 no-scrollbar">
            <button
              *ngFor="let tab of tabs"
              (click)="activeTab = tab.id"
              class="px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 shrink-0"
              [ngClass]="{
                'bg-white text-[#2F6B4F] shadow-xs border border-[#DDE7DF]': activeTab === tab.id,
                'text-[#64748B] hover:text-[#1F2933] hover:bg-white/50': activeTab !== tab.id
              }"
            >
              <app-icon [name]="tab.icon" [size]="16" [customClass]="activeTab === tab.id ? 'text-[#2F6B4F]' : 'text-[#64748B]'"></app-icon>
              <span>{{ tab.label }}</span>
            </button>
          </div>

          <!-- Tab Content Body Container -->
          <div class="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-[#1F2933]">

            <!-- 1. Product Overview Tab -->
            <div *ngIf="activeTab === 'overview'" class="space-y-6">
              <div>
                <h3 class="font-extrabold text-base text-[#1F2933] mb-2">Product Description</h3>
                <p class="text-[#64748B] leading-relaxed">{{ product.description }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-[#DDE7DF]">
                <div class="p-4 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF] space-y-1">
                  <span class="text-xs text-[#64748B]">Category</span>
                  <p class="font-bold text-[#1F2933]">{{ product.categoryName || 'Ayurvedic Wellness' }}</p>
                </div>
                <div class="p-4 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF] space-y-1">
                  <span class="text-xs text-[#64748B]">Subcategory</span>
                  <p class="font-bold text-[#1F2933]">{{ product.subcategoryName || 'General Formulation' }}</p>
                </div>
                <div class="p-4 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF] space-y-1">
                  <span class="text-xs text-[#64748B]">Pack Size / Net Quantity</span>
                  <p class="font-bold text-[#2F6B4F]">{{ getNetQuantity() }}</p>
                </div>
                <div class="p-4 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF] space-y-1">
                  <span class="text-xs text-[#64748B]">Product Type</span>
                  <p class="font-bold text-[#1F2933]">{{ product.productType || 'Proprietary Ayurvedic' }}</p>
                </div>
                <div class="p-4 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF] space-y-1">
                  <span class="text-xs text-[#64748B]">Brand Name</span>
                  <p class="font-bold text-[#1F2933]">{{ product.brandName || 'Authentic Ayurveda' }}</p>
                </div>
                <div class="p-4 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF] space-y-1">
                  <span class="text-xs text-[#64748B]">Prescription Mandatory</span>
                  <p class="font-bold" [class]="product.requiresPrescription ? 'text-[#C62828]' : 'text-[#2E7D32]'">
                    {{ product.requiresPrescription ? 'Yes (Ayurvedic Doctor Rx)' : 'No (Over The Counter)' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 2. Ingredients Tab -->
            <div *ngIf="activeTab === 'ingredients'" class="space-y-6">
              <div>
                <h3 class="font-extrabold text-base text-[#1F2933] mb-2 flex items-center gap-2 text-[#2F6B4F]">
                  <app-icon name="sparkles" [size]="18"></app-icon> Active Botanical Herbs & Ingredients
                </h3>
                <p class="text-xs text-[#64748B] mb-4">
                  Formulated using authentic botanical extracts processed according to classical Ayurvedic text guidelines.
                </p>
              </div>

              <div *ngIf="product.ingredients && product.ingredients.length > 0; else noIngredients" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div *ngFor="let ing of product.ingredients" class="p-3.5 bg-[#EAF4EC]/50 border border-[#DDE7DF] rounded-2xl flex items-center gap-3">
                  <span class="w-8 h-8 rounded-xl bg-[#2F6B4F] text-white flex items-center justify-center font-bold text-xs shrink-0">🌿</span>
                  <div>
                    <span class="font-extrabold text-[#1F2933] block text-xs sm:text-sm">{{ ing }}</span>
                    <span class="text-[10px] text-[#2F6B4F]">Botanical Formulation</span>
                  </div>
                </div>
              </div>
              <ng-template #noIngredients>
                <p class="text-xs text-[#64748B] italic">Standard herbal composition. Please refer to package label for complete ingredient details.</p>
              </ng-template>
            </div>

            <!-- 3. Usage Information Tab -->
            <div *ngIf="activeTab === 'usage'" class="space-y-6">
              <div>
                <h3 class="font-extrabold text-base text-[#1F2933] mb-2 flex items-center gap-2 text-[#2F6B4F]">
                  <app-icon name="check" [size]="18"></app-icon> Recommended Dosage & Vehicle (Anupana)
                </h3>
                <p class="text-xs text-[#64748B] mb-4">
                  Proper administration vehicle (*Anupana*) enhances herbal bio-absorption.
                </p>
              </div>

              <div class="p-5 bg-[#F8FAF7] border border-[#DDE7DF] rounded-2xl space-y-3">
                <div class="flex items-start gap-3">
                  <app-icon name="clock" [size]="20" customClass="text-[#2F6B4F] shrink-0 mt-0.5"></app-icon>
                  <div>
                    <h4 class="font-bold text-[#1F2933] text-xs">Standard Directions:</h4>
                    <p class="text-xs text-[#64748B] leading-relaxed mt-1 font-medium">
                      {{ product.usageInformation || 'Take as recommended by your physician or 1-2 doses daily after meals with lukewarm water.' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. Storage Instructions Tab -->
            <div *ngIf="activeTab === 'storage'" class="space-y-6">
              <div>
                <h3 class="font-extrabold text-base text-[#1F2933] mb-2 flex items-center gap-2 text-[#B7791F]">
                  <app-icon name="shield" [size]="18"></app-icon> Preservative & Storage Guidelines
                </h3>
                <p class="text-xs text-[#64748B] mb-4">
                  Maintain potency and shelf-life stability by storing under recommended conditions.
                </p>
              </div>

              <div class="p-5 bg-[#FFFDF5] border border-[#F5EFE2] rounded-2xl space-y-3">
                <p class="text-xs text-[#1F2933] leading-relaxed font-medium">
                  {{ product.storageInstructions || 'Store in a cool, dry place away from direct sunlight, moisture, and heat. Keep container tightly closed when not in use.' }}
                </p>
              </div>
            </div>

            <!-- 5. Manufacturer Information Tab -->
            <div *ngIf="activeTab === 'manufacturer'" class="space-y-6">
              <div>
                <h3 class="font-extrabold text-base text-[#1F2933] mb-2 flex items-center gap-2 text-[#2F6B4F]">
                  <app-icon name="store" [size]="18"></app-icon> Manufacturing Pharmacy & AYUSH Regulatory Details
                </h3>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-5 bg-[#F8FAF7] border border-[#DDE7DF] rounded-2xl space-y-2">
                  <span class="text-xs text-[#64748B] font-bold">Licensed Manufacturer</span>
                  <p class="font-extrabold text-[#1F2933] text-sm">{{ product.manufacturer || 'Arya Vaidya Sala Pharmacy Unit' }}</p>
                </div>
                <div class="p-5 bg-[#F8FAF7] border border-[#DDE7DF] rounded-2xl space-y-2">
                  <span class="text-xs text-[#64748B] font-bold">AYUSH / FSSAI License Number</span>
                  <p class="font-mono font-bold text-[#2F6B4F] text-sm">{{ product.licenseInformation || 'AYUSH/MP/2021/4891' }}</p>
                </div>
              </div>
            </div>

            <!-- 6. Batch and Expiry Information Tab -->
            <div *ngIf="activeTab === 'batch'" class="space-y-6">
              <div>
                <h3 class="font-extrabold text-base text-[#1F2933] mb-2 flex items-center gap-2 text-[#2F6B4F]">
                  <app-icon name="package" [size]="18"></app-icon> Quality Batch Tracking & Expiry
                </h3>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="p-4 bg-[#F8FAF7] border border-[#DDE7DF] rounded-2xl space-y-1">
                  <span class="text-xs text-[#64748B]">Batch Code</span>
                  <p class="font-mono font-bold text-[#1F2933]">{{ product.batchNumber || 'AGV-2026-09A' }}</p>
                </div>
                <div class="p-4 bg-[#F8FAF7] border border-[#DDE7DF] rounded-2xl space-y-1">
                  <span class="text-xs text-[#64748B]">Expiry / Best Before</span>
                  <p class="font-bold text-[#C62828]">{{ product.expiryDate || '2029-08-31' }}</p>
                </div>
                <div class="p-4 bg-[#F8FAF7] border border-[#DDE7DF] rounded-2xl space-y-1">
                  <span class="text-xs text-[#64748B]">Shelf Life</span>
                  <p class="font-bold text-[#2F6B4F]">36 Months from MFG</p>
                </div>
              </div>
            </div>

            <!-- 7. Seller Information Tab -->
            <div *ngIf="activeTab === 'seller'" class="space-y-6">
              <div>
                <h3 class="font-extrabold text-base text-[#1F2933] mb-2 flex items-center gap-2 text-[#2F6B4F]">
                  <app-icon name="store" [size]="18"></app-icon> Marketplace Seller Verification
                </h3>
              </div>

              <div class="p-5 bg-[#F8FAF7] border border-[#DDE7DF] rounded-2xl space-y-4">
                <div class="flex items-center justify-between flex-wrap gap-4">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-[#2F6B4F] text-white flex items-center justify-center font-extrabold text-lg">
                      {{ (product.sellerName || 'S')[0] }}
                    </div>
                    <div>
                      <h4 class="font-extrabold text-[#1F2933] text-sm">{{ product.sellerName || 'Verified Ayurvedic Seller' }}</h4>
                      <p class="text-xs text-[#2E7D32] flex items-center gap-1 font-semibold">
                        <app-icon name="check-circle" [size]="14"></app-icon> Verified Marketplace Vendor
                      </p>
                    </div>
                  </div>
                  <a [routerLink]="['/products']" [queryParams]="{ seller: product.sellerId }" class="btn btn-xs bg-[#2F6B4F] text-white font-bold px-3 py-1.5 rounded-lg">
                    View Seller Store
                  </a>
                </div>
              </div>
            </div>

            <!-- 8. Safety and Caution Tab -->
            <div *ngIf="activeTab === 'safety'" class="space-y-6">
              <div>
                <h3 class="font-extrabold text-base text-[#C62828] mb-2 flex items-center gap-2">
                  <app-icon name="shield" [size]="18"></app-icon> Precautionary Advisories & Contraindications
                </h3>
              </div>

              <div class="p-5 bg-[#FDF2F2] border border-[#C62828]/20 rounded-2xl space-y-3">
                <p class="text-xs text-[#C62828] font-bold leading-relaxed">
                  {{ product.caution || 'Pregnant or lactating women, children under 12, and individuals under ongoing medical treatment should consult an Ayurveda physician before consumption.' }}
                </p>
              </div>
            </div>

            <!-- 9. Shipping and Returns Tab -->
            <div *ngIf="activeTab === 'shipping'" class="space-y-6">
              <div>
                <h3 class="font-extrabold text-base text-[#1F2933] mb-2 flex items-center gap-2 text-[#2F6B4F]">
                  <app-icon name="truck" [size]="18"></app-icon> Delivery Timelines & Return Policy
                </h3>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-4 bg-[#F8FAF7] border border-[#DDE7DF] rounded-2xl space-y-1">
                  <span class="font-bold text-[#1F2933]">Standard Shipping</span>
                  <p class="text-xs text-[#64748B]">Dispatched within 24-48 business hours via insured temperature-controlled parcel carriers.</p>
                </div>
                <div class="p-4 bg-[#F8FAF7] border border-[#DDE7DF] rounded-2xl space-y-1">
                  <span class="font-bold text-[#1F2933]">Hygienic Return Policy</span>
                  <p class="text-xs text-[#64748B]">Unopened sealed health products can be returned within 7 days of delivery.</p>
                </div>
              </div>
            </div>

            <!-- 10. Customer Questions & FAQs Tab -->
            <div *ngIf="activeTab === 'questions'" class="space-y-6">
              <div class="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 class="font-extrabold text-base text-[#1F2933]">Customer Questions & Answers</h3>
                  <p class="text-xs text-[#64748B]">Common queries answered by qualified Ayurveda specialists.</p>
                </div>
                <button (click)="showAskQuestionModal = true" class="btn btn-xs bg-[#2F6B4F] text-white font-bold px-3 py-1.5 rounded-lg">
                  Ask a Question
                </button>
              </div>

              <div class="space-y-3">
                <div *ngFor="let q of customerQuestions" class="p-4 bg-[#F8FAF7] border border-[#DDE7DF] rounded-2xl space-y-2 text-xs">
                  <div class="flex items-start gap-2">
                    <span class="font-extrabold text-[#2F6B4F]">Q:</span>
                    <span class="font-bold text-[#1F2933]">{{ q.question }}</span>
                  </div>
                  <div *ngIf="q.answer" class="flex items-start gap-2 pl-4 border-l-2 border-[#2F6B4F] pt-1">
                    <span class="font-extrabold text-[#C69A45]">A:</span>
                    <p class="text-[#64748B] leading-relaxed">{{ q.answer }}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Customer Reviews Section -->
        <div class="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDE7DF] space-y-6 shadow-xs">
          <div class="flex items-center justify-between flex-wrap gap-4 border-b border-[#DDE7DF] pb-4">
            <div>
              <h2 class="text-xl font-extrabold text-[#1F2933] flex items-center gap-2">
                <app-icon name="star" [size]="20" customClass="text-[#C69A45]"></app-icon>
                <span>Verified Customer Reviews ({{ product.reviewCount }})</span>
              </h2>
              <p class="text-xs text-[#64748B] mt-1">Real feedback from verified marketplace buyers.</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right">
                <span class="text-2xl font-extrabold text-[#1F2933]">{{ product.rating }}</span>
                <span class="text-xs text-[#64748B]"> / 5.0</span>
              </div>
              <app-rating [rating]="product.rating"></app-rating>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div *ngFor="let rev of customerReviews" class="p-4 bg-[#F8FAF7] border border-[#DDE7DF] rounded-2xl space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-bold text-[#1F2933]">{{ rev.author }}</span>
                <span class="text-[11px] text-[#64748B]">{{ rev.date }}</span>
              </div>
              <div class="flex items-center gap-2">
                <app-rating [rating]="rev.rating"></app-rating>
                <span *ngIf="rev.isVerified" class="text-[10px] bg-[#EAF4EC] text-[#2E7D32] px-2 py-0.5 rounded-full font-bold">Verified Buyer</span>
              </div>
              <h4 class="font-bold text-[#1F2933] pt-1">{{ rev.title }}</h4>
              <p class="text-[#64748B] leading-relaxed">{{ rev.comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  quantity = 1;
  isLoading = true;
  Math = Math;

  // Prescription Upload Simulation State
  prescriptionAttached = false;
  prescriptionFileName = '';

  // Tab State Management
  activeTab: ProductTab = 'overview';
  tabs: { id: ProductTab; label: string; icon: string }[] = [
    { id: 'overview', label: '1. Product Overview', icon: 'info' },
    { id: 'ingredients', label: '2. Ingredients', icon: 'sparkles' },
    { id: 'usage', label: '3. Usage Information', icon: 'check' },
    { id: 'storage', label: '4. Storage Instructions', icon: 'shield' },
    { id: 'manufacturer', label: '5. Manufacturer Info', icon: 'store' },
    { id: 'batch', label: '6. Batch & Expiry', icon: 'package' },
    { id: 'seller', label: '7. Seller Info', icon: 'store' },
    { id: 'safety', label: '8. Safety & Caution', icon: 'alert-triangle' },
    { id: 'shipping', label: '9. Shipping & Returns', icon: 'truck' },
    { id: 'questions', label: '10. Customer Questions', icon: 'help-circle' },
  ];

  showAskQuestionModal = false;

  customerQuestions: CustomerQuestion[] = [
    {
      id: 'q-1',
      question: 'Is this product safe for daily consumption over extended periods?',
      askedBy: 'Rajesh K.',
      askedDate: '2026-08-10',
      answer: 'Yes, this organic formulation is prepared for daily wellness support. However, we recommend consulting an Ayurveda practitioner for customized long-term regimens.',
      answeredBy: 'Aura Ayurveda Health Desk',
      answeredDate: '2026-08-11',
    },
    {
      id: 'q-2',
      question: 'Can I consume this alongside my regular diabetes allopathic medicines?',
      askedBy: 'Sunita M.',
      askedDate: '2026-08-20',
      answer: 'We recommend maintaining a minimum 45-minute gap between Ayurvedic formulations and allopathic medicines, and monitoring blood glucose levels with your practitioner.',
      answeredBy: 'Dr. Ananya Sharma (Ayurveda Consultant)',
      answeredDate: '2026-08-21',
    },
  ];

  customerReviews: ProductReviewItem[] = [
    {
      id: 'rev-1',
      author: 'Aarav Patel',
      rating: 5,
      date: '2026-09-02',
      title: 'Authentic formulation, excellent results',
      comment: 'Very pleased with the purity of this product. Shipped promptly with sealed tamper-proof packaging.',
      isVerified: true,
      helpfulCount: 14,
    },
    {
      id: 'rev-2',
      author: 'Meera Deshmukh',
      rating: 5,
      date: '2026-08-28',
      title: 'Genuine Ayurvedic product from Kottakkal',
      comment: 'Full ingredient transparency on label and batch code matches AYUSH verification. Highly recommended!',
      isVerified: true,
      helpfulCount: 9,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isLoading = true;
        this.productService.getProductById(id).subscribe((res) => {
          this.product = res;
          this.isLoading = false;
        });
      }
    });
  }

  getNetQuantity(): string {
    if (!this.product) return '';
    if (this.product.netQuantity) return this.product.netQuantity;
    // Fallback based on name/sku
    if (this.product.name.includes('60')) return '60 Tablets / Capsules';
    if (this.product.name.includes('200g')) return '200 g';
    if (this.product.name.includes('500g')) return '500 g';
    if (this.product.name.includes('450ml')) return '450 ml';
    if (this.product.name.includes('100ml')) return '100 ml';
    if (this.product.name.includes('12ml')) return '12 ml';
    if (this.product.name.includes('25')) return '25 Tea Bags';
    return '1 Unit';
  }

  getCustomerStockLabel(): string {
    if (!this.product) return '';
    if (this.product.stockQuantity === 0) return 'Currently Out of Stock';
    if (this.product.stockQuantity <= 5) return `Only ${this.product.stockQuantity} Left in Stock`;
    if (this.product.stockQuantity <= 10) return 'Low Stock';
    return 'In Stock';
  }

  onPrescriptionUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.prescriptionFileName = file.name;
      this.prescriptionAttached = true;
      this.toastService.success(`Prescription "${file.name}" attached successfully!`, 'Rx Attached');
    }
  }

  removePrescription(): void {
    this.prescriptionAttached = false;
    this.prescriptionFileName = '';
    this.toastService.info('Prescription removed.');
  }

  addToCart(): void {
    if (!this.product) return;
    if (this.product.requiresPrescription && !this.prescriptionAttached) {
      this.toastService.warning(
        'Please attach a valid doctor prescription before adding this classical formulation to cart.',
        'Prescription Required'
      );
      return;
    }
    this.cartService.addItem(this.product, this.quantity);
  }

  buyNow(): void {
    if (!this.product) return;
    if (this.product.requiresPrescription && !this.prescriptionAttached) {
      this.toastService.warning(
        'Please attach a valid doctor prescription to proceed with purchase.',
        'Prescription Required'
      );
      return;
    }
    this.cartService.addItem(this.product, this.quantity);
    this.router.navigate(['/checkout']);
  }

  toggleWishlist(): void {
    if (this.product) {
      this.wishlistService.toggleWishlist(this.product);
    }
  }

  isInWishlist(): boolean {
    return this.product ? this.wishlistService.isInWishlist(this.product.id) : false;
  }
}
