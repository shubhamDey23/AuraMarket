import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [class]="customClass"
    >
      <ng-container [ngSwitch]="name">
        <!-- Shopping Cart -->
        <g *ngSwitchCase="'shopping-cart'">
          <circle cx="8" cy="21" r="1"></circle>
          <circle cx="19" cy="21" r="1"></circle>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
        </g>
        <!-- Heart / Wishlist -->
        <g *ngSwitchCase="'heart'">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
        </g>
        <!-- Search -->
        <g *ngSwitchCase="'search'">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
        <!-- User -->
        <g *ngSwitchCase="'user'">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </g>
        <!-- Dashboard -->
        <g *ngSwitchCase="'dashboard'">
          <rect width="7" height="9" x="3" y="3" rx="1"></rect>
          <rect width="7" height="5" x="14" y="3" rx="1"></rect>
          <rect width="7" height="9" x="14" y="12" rx="1"></rect>
          <rect width="7" height="5" x="3" y="16" rx="1"></rect>
        </g>
        <!-- Package / Products -->
        <g *ngSwitchCase="'package'">
          <path d="m7.5 4.27 9 5.15"></path>
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
          <path d="m3.3 7 8.7 5 8.7-5"></path>
          <path d="M12 22V12"></path>
        </g>
        <!-- Store / Sellers -->
        <g *ngSwitchCase="'store'">
          <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
          <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
          <path d="M2 7h20"></path>
        </g>
        <!-- Users / Customers -->
        <g *ngSwitchCase="'users'">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </g>
        <!-- Layers / Categories -->
        <g *ngSwitchCase="'layers'">
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"></path>
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"></path>
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"></path>
        </g>
        <!-- Tag / Brands / Coupons -->
        <g *ngSwitchCase="'tag'">
          <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
          <path d="M7 7h.01"></path>
        </g>
        <!-- Truck / Fulfillment / Orders -->
        <g *ngSwitchCase="'truck'">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
          <path d="M15 18H9"></path>
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.36-4.04a1 1 0 0 0-.76-.34H14"></path>
          <circle cx="7" cy="18" r="2"></circle>
          <circle cx="17" cy="18" r="2"></circle>
        </g>
        <!-- Dollar Sign / Earnings -->
        <g *ngSwitchCase="'dollar-sign'">
          <line x1="12" x2="12" y1="2" y2="22"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </g>
        <!-- Indian Rupee / Earnings -->
        <g *ngSwitchCase="'indian-rupee'">
          <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4 4 0 0 0 0-8H6"></path>
        </g>
        <g *ngSwitchCase="'rupee'">
          <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4 4 0 0 0 0-8H6"></path>
        </g>
        <!-- Trending Up -->
        <g *ngSwitchCase="'trending-up'">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
          <polyline points="16 7 22 7 22 13"></polyline>
        </g>
        <!-- Star -->
        <g *ngSwitchCase="'star'">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </g>
        <!-- Filter -->
        <g *ngSwitchCase="'filter'">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </g>
        <!-- Chevron Down -->
        <g *ngSwitchCase="'chevron-down'">
          <path d="m6 9 6 6 6-6"></path>
        </g>
        <!-- Chevron Right -->
        <g *ngSwitchCase="'chevron-right'">
          <path d="m9 18 6-6-6-6"></path>
        </g>
        <!-- Plus -->
        <g *ngSwitchCase="'plus'">
          <path d="M5 12h14"></path>
          <path d="M12 5v14"></path>
        </g>
        <!-- Trash -->
        <g *ngSwitchCase="'trash'">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </g>
        <!-- Edit / Pen -->
        <g *ngSwitchCase="'edit'">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
        </g>
        <!-- Eye -->
        <g *ngSwitchCase="'eye'">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </g>
        <!-- Check -->
        <g *ngSwitchCase="'check'">
          <polyline points="20 6 9 17 4 12"></polyline>
        </g>
        <!-- X / Close -->
        <g *ngSwitchCase="'x'">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </g>
        <!-- Menu -->
        <g *ngSwitchCase="'menu'">
          <line x1="4" x2="20" y1="12" y2="12"></line>
          <line x1="4" x2="20" y1="6" y2="6"></line>
          <line x1="4" x2="20" y1="18" y2="18"></line>
        </g>
        <!-- Settings -->
        <g *ngSwitchCase="'settings'">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </g>
        <!-- Arrow Left -->
        <g *ngSwitchCase="'arrow-left'">
          <path d="m12 19-7-7 7-7"></path>
          <path d="M19 12H5"></path>
        </g>
        <!-- Arrow Right -->
        <g *ngSwitchCase="'arrow-right'">
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </g>
        <!-- Shirt / Apparel -->
        <g *ngSwitchCase="'shirt'">
          <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
        </g>
        <!-- Headphones / Tech -->
        <g *ngSwitchCase="'headphones'">
          <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>
        </g>
        <!-- Home / Living -->
        <g *ngSwitchCase="'home'">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </g>
        <!-- Sparkles / Beauty -->
        <g *ngSwitchCase="'sparkles'">
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"></path>
          <path d="M5 3v4"></path>
          <path d="M19 17v4"></path>
          <path d="M3 5h4"></path>
          <path d="M17 19h4"></path>
        </g>
        <!-- Dog / Pets -->
        <g *ngSwitchCase="'dog'">
          <path d="M10 5.172C10 3.782 8.432 2.5 6.5 2.5S3 3.782 3 5.172c0 1.2.98 2.22 2.3 2.661.35.12.7.28 1.02.48.55.35 1.15.82 1.68 1.4.37.4.74.85 1.08 1.34A12.02 12.02 0 0 1 10 5.172z"></path>
          <path d="M14 5.172c0-1.39 1.568-2.672 3.5-2.672S21 3.782 21 5.172c0 1.2-.98 2.22-2.3 2.661-.35.12-.7.28-1.02.48-.55.35-1.15.82-1.68 1.4-.37.4-.74.85-1.08 1.34A12.02 12.02 0 0 0 14 5.172z"></path>
          <path d="M12 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
          <path d="M12 18c-3.31 0-6 1.79-6 4h12c0-2.21-2.69-4-6-4z"></path>
        </g>
        <!-- Activity / Sports -->
        <g *ngSwitchCase="'activity'">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </g>
        <!-- Percent / Deals -->
        <g *ngSwitchCase="'percent'">
          <line x1="19" x2="5" y1="5" y2="19"></line>
          <circle cx="6.5" cy="6.5" r="2.5"></circle>
          <circle cx="17.5" cy="17.5" r="2.5"></circle>
        </g>
        <!-- Gift / Toys & Baby -->
        <g *ngSwitchCase="'gift'">
          <polyline points="20 12 20 22 4 22 4 12"></polyline>
          <rect width="20" height="5" x="2" y="7" rx="1"></rect>
          <line x1="12" x2="12" y1="7" y2="22"></line>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
        </g>
        <!-- Compass / Travel & Luggage -->
        <g *ngSwitchCase="'compass'">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
        </g>
        <!-- Car / Automotive -->
        <g *ngSwitchCase="'car'">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
          <circle cx="7" cy="17" r="2"></circle>
          <path d="M9 17h6"></path>
          <circle cx="17" cy="17" r="2"></circle>
        </g>
        <!-- Book Open / Books & Stationery -->
        <g *ngSwitchCase="'book-open'">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </g>
        <!-- Shield Check / Admin -->
        <g *ngSwitchCase="'shield'">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </g>
        <!-- Map Pin -->
        <g *ngSwitchCase="'map-pin'">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </g>
        <!-- Log Out -->
        <g *ngSwitchCase="'log-out'">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" x2="9" y1="12" y2="12"></line>
        </g>
        <!-- Bell / Notifications -->
        <g *ngSwitchCase="'bell'">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
        </g>
        <!-- Default Circle -->
        <g *ngSwitchDefault>
          <circle cx="12" cy="12" r="9"></circle>
        </g>
      </ng-container>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
    }
  `],
})
export class AppIconComponent {
  @Input() name = 'circle';
  @Input() size = 20;
  @Input() customClass = '';
}
