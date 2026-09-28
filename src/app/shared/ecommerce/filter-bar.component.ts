import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../core/models/category.model';
import { Brand } from '../../core/models/brand.model';
import { Seller } from '../../core/models/user.model';
import { AppIconComponent } from '../components/app-icon.component';
import { ProductFilterParams } from '../../core/services/product.service';

export interface PriceRangeBand {
  label: string;
  min?: number;
  max?: number;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, AppIconComponent],
  template: `
    <div class="space-y-6 text-xs">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-[#DDE7DF]">
        <h3 class="font-extrabold text-[#1F2933] text-sm flex items-center gap-2">
          <app-icon name="filter" [size]="16" customClass="text-[#2F6B4F]"></app-icon> Filter Products
        </h3>
        <button (click)="resetFilters()" class="text-xs font-bold text-[#2F6B4F] hover:underline">Reset All</button>
      </div>

      <!-- Categories -->
      <div>
        <label class="form-label text-[11px] uppercase font-extrabold text-[#2F6B4F] tracking-wider">Category</label>
        <div class="space-y-1.5 mt-2 max-h-48 overflow-y-auto pr-1">
          <label class="flex items-center gap-2 text-xs text-[#1F2933] cursor-pointer hover:text-[#2F6B4F]">
            <input type="radio" name="catFilter" [value]="undefined" [(ngModel)]="filters.categoryId" (change)="onFilterChange()" />
            <span>All Categories</span>
          </label>
          <label *ngFor="let cat of categories" class="flex items-center gap-2 text-xs text-[#1F2933] cursor-pointer hover:text-[#2F6B4F]">
            <input type="radio" name="catFilter" [value]="cat.id" [(ngModel)]="filters.categoryId" (change)="onFilterChange()" />
            <span class="truncate">{{ cat.name }}</span>
          </label>
        </div>
      </div>

      <!-- Product Type -->
      <div>
        <label class="form-label text-[11px] uppercase font-extrabold text-[#2F6B4F] tracking-wider">Product Type</label>
        <div class="space-y-1.5 mt-2 max-h-40 overflow-y-auto pr-1">
          <label class="flex items-center gap-2 text-xs text-[#1F2933] cursor-pointer hover:text-[#2F6B4F]">
            <input type="radio" name="typeFilter" [value]="undefined" [(ngModel)]="filters.productType" (change)="onFilterChange()" />
            <span>All Types</span>
          </label>
          <label *ngFor="let type of productTypes" class="flex items-center gap-2 text-xs text-[#1F2933] cursor-pointer hover:text-[#2F6B4F]">
            <input type="radio" name="typeFilter" [value]="type" [(ngModel)]="filters.productType" (change)="onFilterChange()" />
            <span class="truncate">{{ type }}</span>
          </label>
        </div>
      </div>

      <!-- Price Range Bands -->
      <div>
        <label class="form-label text-[11px] uppercase font-extrabold text-[#2F6B4F] tracking-wider">Price Range</label>
        <div class="space-y-1.5 mt-2">
          <label class="flex items-center gap-2 text-xs text-[#1F2933] cursor-pointer hover:text-[#2F6B4F]">
            <input type="radio" name="priceFilter" [value]="'all'" [(ngModel)]="selectedPriceBand" (change)="selectPriceBand('all')" />
            <span>All Prices</span>
          </label>
          <label *ngFor="let band of priceBands" class="flex items-center gap-2 text-xs text-[#1F2933] cursor-pointer hover:text-[#2F6B4F]">
            <input type="radio" name="priceFilter" [value]="band.label" [(ngModel)]="selectedPriceBand" (change)="selectPriceBand(band.label)" />
            <span>{{ band.label }}</span>
          </label>
        </div>
      </div>

      <!-- Sellers -->
      <div>
        <label class="form-label text-[11px] uppercase font-extrabold text-[#2F6B4F] tracking-wider">Seller Pharmacy</label>
        <div class="space-y-1.5 mt-2 max-h-40 overflow-y-auto pr-1">
          <label class="flex items-center gap-2 text-xs text-[#1F2933] cursor-pointer hover:text-[#2F6B4F]">
            <input type="radio" name="sellerFilter" [value]="undefined" [(ngModel)]="filters.sellerId" (change)="onFilterChange()" />
            <span>All Pharmacies</span>
          </label>
          <label *ngFor="let seller of sellers" class="flex items-center gap-2 text-xs text-[#1F2933] cursor-pointer hover:text-[#2F6B4F]">
            <input type="radio" name="sellerFilter" [value]="seller.id" [(ngModel)]="filters.sellerId" (change)="onFilterChange()" />
            <span class="truncate">{{ seller.storeName }}</span>
          </label>
        </div>
      </div>

      <!-- Brands -->
      <div>
        <label class="form-label text-[11px] uppercase font-extrabold text-[#2F6B4F] tracking-wider">Brand</label>
        <div class="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-1">
          <label class="flex items-center gap-2 text-xs text-[#1F2933] cursor-pointer hover:text-[#2F6B4F]">
            <input type="radio" name="brandFilter" [value]="undefined" [(ngModel)]="filters.brandId" (change)="onFilterChange()" />
            <span>All Brands</span>
          </label>
          <label *ngFor="let brand of brands" class="flex items-center gap-2 text-xs text-[#1F2933] cursor-pointer hover:text-[#2F6B4F]">
            <input type="radio" name="brandFilter" [value]="brand.id" [(ngModel)]="filters.brandId" (change)="onFilterChange()" />
            <span class="truncate">{{ brand.name }}</span>
          </label>
        </div>
      </div>

      <!-- Prescription & Availability Checkboxes -->
      <div class="pt-4 border-t border-[#DDE7DF] space-y-2 text-xs">
        <label class="flex items-center gap-2 text-[#1F2933] cursor-pointer">
          <input type="checkbox" [(ngModel)]="filters.inStockOnly" (change)="onFilterChange()" class="rounded border-[#DDE7DF] text-[#2F6B4F]" />
          <span>In Stock Only</span>
        </label>
        <label class="flex items-center gap-2 text-[#1F2933] cursor-pointer">
          <input type="checkbox" [(ngModel)]="filters.hasDiscount" (change)="onFilterChange()" class="rounded border-[#DDE7DF] text-[#2F6B4F]" />
          <span>On Sale / Discounted</span>
        </label>
        <label class="flex items-center gap-2 text-[#C62828] font-semibold cursor-pointer pt-1">
          <input type="checkbox" [(ngModel)]="filters.requiresPrescription" (change)="onFilterChange()" class="rounded border-[#DDE7DF] text-[#C62828]" />
          <span>Requires Doctor Prescription</span>
        </label>
      </div>
    </div>
  `,
})
export class FilterBarComponent {
  @Input() categories: Category[] = [];
  @Input() brands: Brand[] = [];
  @Input() sellers: Seller[] = [];
  @Input() filters: ProductFilterParams = {};
  @Output() filterChange = new EventEmitter<ProductFilterParams>();

  selectedPriceBand = 'all';

  productTypes = [
    'Classical Preparations',
    'Proprietary Ayurvedic',
    'Herbal Formulations',
    'Personal Care',
    'Herbal Oils',
    'Wellness Essentials',
    'Wellness Drinks',
    'Ayurveda Books',
    'Online Consultation',
  ];

  priceBands: PriceRangeBand[] = [
    { label: 'Under ₹250', min: 0, max: 250 },
    { label: '₹250 to ₹500', min: 250, max: 500 },
    { label: '₹500 to ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 & Above', min: 1000, max: 1000000 },
  ];

  selectPriceBand(label: string): void {
    this.selectedPriceBand = label;
    if (label === 'all') {
      this.filters.minPrice = undefined;
      this.filters.maxPrice = undefined;
    } else {
      const band = this.priceBands.find((b) => b.label === label);
      if (band) {
        this.filters.minPrice = band.min;
        this.filters.maxPrice = band.max;
      }
    }
    this.onFilterChange();
  }

  onFilterChange(): void {
    this.filterChange.emit(this.filters);
  }

  resetFilters(): void {
    this.selectedPriceBand = 'all';
    this.filters.categoryId = undefined;
    this.filters.subcategoryId = undefined;
    this.filters.brandId = undefined;
    this.filters.sellerId = undefined;
    this.filters.productType = undefined;
    this.filters.requiresPrescription = undefined;
    this.filters.minPrice = undefined;
    this.filters.maxPrice = undefined;
    this.filters.inStockOnly = false;
    this.filters.hasDiscount = false;
    this.onFilterChange();
  }
}
