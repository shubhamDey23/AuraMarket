import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { PriceDisplayComponent } from './price-display.component';
import { RatingComponent } from './rating.component';
import { AppIconComponent } from './app-icon.component';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PriceDisplayComponent,
    RatingComponent,
    AppIconComponent,
  ],
  template: `
    <div class="card group flex flex-col h-full overflow-hidden bg-white border border-[#DDE7DF] rounded-2xl hover:shadow-md transition-all duration-200">
      <!-- Thumbnail Header -->
      <div class="relative w-full aspect-square bg-[#F8FAF7] overflow-hidden">
        <a [routerLink]="['/products', product.id]" class="block w-full h-full">
          <img
            [src]="product.featuredImage"
            [alt]="product.name"
            class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </a>

        <!-- Badges -->
        <div class="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <span *ngIf="product.requiresPrescription" class="bg-[#C62828] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
            <app-icon name="shield" [size]="10"></app-icon> Rx Required
          </span>
          <span *ngIf="product.productType" class="bg-[#2F6B4F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            {{ product.productType }}
          </span>
          <span *ngIf="product.discountPercentage" class="bg-[#C69A45] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            {{ product.discountPercentage }}% OFF
          </span>
        </div>

        <!-- Wishlist Button -->
        <button
          (click)="toggleWishlist($event)"
          class="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-xs text-[#64748B] hover:text-[#C62828] transition-colors"
          [title]="isInWishlist() ? 'Remove from Wishlist' : 'Add to Wishlist'"
        >
          <app-icon name="heart" [size]="16" [customClass]="isInWishlist() ? 'fill-[#C62828] text-[#C62828]' : ''"></app-icon>
        </button>
      </div>

      <!-- Card Body -->
      <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <!-- Seller Store & Manufacturer Badge -->
          <div *ngIf="product.sellerName" class="text-[11px] font-semibold text-[#64748B] mb-1 flex items-center justify-between gap-1">
            <span class="truncate text-[#2F6B4F] flex items-center gap-1">
              <app-icon name="store" [size]="12"></app-icon> {{ product.sellerName }}
            </span>
          </div>

          <!-- Product Title -->
          <h3 class="font-bold text-[#1F2933] text-sm line-clamp-2 mb-1.5 group-hover:text-[#2F6B4F] transition-colors">
            <a [routerLink]="['/products', product.id]">
              {{ product.name }}
            </a>
          </h3>

          <!-- Key Ingredients Snippet if available -->
          <div *ngIf="product.ingredients && product.ingredients.length > 0" class="text-[11px] text-[#64748B] line-clamp-1 mb-2">
            <strong class="text-[#1F2933]">Herbs:</strong> {{ product.ingredients.join(', ') }}
          </div>

          <!-- Rating -->
          <div class="mb-2">
            <app-rating [rating]="product.rating" [reviewCount]="product.reviewCount"></app-rating>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="pt-3 border-t border-[#DDE7DF] flex items-center justify-between gap-2 mt-auto">
          <app-price-display
            [price]="product.price"
            [salePrice]="product.salePrice"
            [discountPercentage]="product.discountPercentage"
            priceClass="text-base font-extrabold text-[#1F2933]"
          ></app-price-display>

          <button
            (click)="addToCart($event)"
            class="btn btn-sm bg-[#2F6B4F] hover:bg-[#24543D] text-white py-1.5 px-3 rounded-xl flex items-center gap-1 text-xs font-bold shadow-xs"
          >
            <app-icon name="shopping-cart" [size]="14"></app-icon>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  addToCart(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.addItem(this.product, 1);
  }

  toggleWishlist(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.wishlistService.toggleWishlist(this.product);
  }

  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product.id);
  }
}
