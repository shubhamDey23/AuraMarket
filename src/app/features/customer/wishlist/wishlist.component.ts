import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { ProductCardComponent } from '../../../shared/components/product-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, EmptyStateComponent],
  template: `
    <div class="container space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900">Saved Wishlist</h1>
        <span class="text-xs text-slate-500 font-medium">{{ wishlistService.itemCount() }} item(s)</span>
      </div>

      <div *ngIf="wishlistService.items().length > 0; else emptyWishlist" class="grid-products">
        <app-product-card *ngFor="let prod of wishlistService.items()" [product]="prod"></app-product-card>
      </div>

      <ng-template #emptyWishlist>
        <app-empty-state
          icon="heart"
          title="Your wishlist is empty"
          description="Save your favorite products while browsing and view them here anytime."
          actionLabel="Explore Products"
          (action)="navigateToProducts()"
        ></app-empty-state>
      </ng-template>
    </div>
  `,
})
export class WishlistComponent {
  constructor(
    public wishlistService: WishlistService,
    public cartService: CartService,
    private router: Router
  ) {}

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
}
