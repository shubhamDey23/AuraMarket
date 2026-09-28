import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatInr } from '../../core/utils/currency.util';

@Component({
  selector: 'app-price-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inline-flex items-baseline gap-2 font-sans">
      <span [class]="priceClass || 'text-lg font-bold text-slate-900'">
        {{ formattedCurrentPrice }}
      </span>
      <span *ngIf="hasSale" class="text-xs line-through text-slate-400 font-normal">
        {{ formattedOriginalPrice }}
      </span>
      <span *ngIf="discountPercentage" class="text-xs font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
        {{ discountPercentage }}% OFF
      </span>
    </div>
  `,
})
export class PriceDisplayComponent {
  @Input() price!: number;
  @Input() salePrice?: number;
  @Input() discountPercentage?: number;
  @Input() priceClass = '';
  @Input() showDecimals = false;

  get currentPrice(): number {
    return this.salePrice !== undefined && this.salePrice !== null ? this.salePrice : this.price;
  }

  get hasSale(): boolean {
    return this.salePrice !== undefined && this.salePrice !== null && this.salePrice < this.price;
  }

  get formattedCurrentPrice(): string {
    return formatInr(this.currentPrice, this.showDecimals);
  }

  get formattedOriginalPrice(): string {
    return formatInr(this.price, this.showDecimals);
  }
}

