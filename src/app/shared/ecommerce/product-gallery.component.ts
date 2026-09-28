import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductImage } from '../../core/models/product.model';
import { AppIconComponent } from '../components/app-icon.component';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="space-y-4">
      <!-- Main Display Image -->
      <div class="relative w-full aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group">
        <img
          [src]="activeImageUrl || placeholderUrl"
          (error)="onImageError()"
          [alt]="altText"
          class="w-full h-full object-cover object-center transition-opacity duration-300"
        />

        <!-- Next / Prev Overlay Controls -->
        <div *ngIf="imagesList.length > 1" class="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            (click)="prevImage()"
            class="p-2 rounded-full bg-white/90 shadow-md text-slate-800 hover:bg-white hover:scale-105 transition-all"
            title="Previous Image"
          >
            <app-icon name="arrow-left" [size]="18"></app-icon>
          </button>
          <button
            (click)="nextImage()"
            class="p-2 rounded-full bg-white/90 shadow-md text-slate-800 hover:bg-white hover:scale-105 transition-all"
            title="Next Image"
          >
            <app-icon name="arrow-right" [size]="18"></app-icon>
          </button>
        </div>
      </div>

      <!-- Thumbnails Carousel -->
      <div *ngIf="imagesList.length > 1" class="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        <button
          *ngFor="let img of imagesList; let idx = index"
          (click)="selectImage(img.url, idx)"
          class="w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-slate-100"
          [ngClass]="activeImageUrl === img.url ? 'border-indigo-600 ring-2 ring-indigo-200 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'"
        >
          <img [src]="img.url" (error)="onThumbError($event)" [alt]="img.altText || altText" class="w-full h-full object-cover" />
        </button>
      </div>
    </div>
  `,
})
export class ProductGalleryComponent implements OnChanges {
  @Input() images: ProductImage[] = [];
  @Input() featuredImage = '';
  @Input() altText = 'Product Image';

  activeImageUrl = '';
  currentIndex = 0;
  placeholderUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';

  ngOnChanges(): void {
    if (this.images && this.images.length > 0) {
      this.activeImageUrl = this.images[0].url;
      this.currentIndex = 0;
    } else if (this.featuredImage) {
      this.activeImageUrl = this.featuredImage;
    }
  }

  get imagesList(): ProductImage[] {
    if (this.images && this.images.length > 0) {
      return this.images;
    }
    if (this.featuredImage) {
      return [{ id: 'feat-1', url: this.featuredImage, altText: this.altText, isPrimary: true }];
    }
    return [{ id: 'place-1', url: this.placeholderUrl, altText: this.altText, isPrimary: true }];
  }

  selectImage(url: string, index: number): void {
    this.activeImageUrl = url;
    this.currentIndex = index;
  }

  prevImage(): void {
    const total = this.imagesList.length;
    this.currentIndex = (this.currentIndex - 1 + total) % total;
    this.activeImageUrl = this.imagesList[this.currentIndex].url;
  }

  nextImage(): void {
    const total = this.imagesList.length;
    this.currentIndex = (this.currentIndex + 1) % total;
    this.activeImageUrl = this.imagesList[this.currentIndex].url;
  }

  onImageError(): void {
    this.activeImageUrl = this.placeholderUrl;
  }

  onThumbError(event: Event): void {
    (event.target as HTMLImageElement).src = this.placeholderUrl;
  }
}
