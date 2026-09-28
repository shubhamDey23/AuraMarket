import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="inline-flex items-center gap-1 text-xs">
      <div class="flex items-center text-amber-400">
        <app-icon name="star" [size]="size" customClass="fill-current"></app-icon>
      </div>
      <span class="font-semibold text-slate-800">{{ rating | number:'1.1-1' }}</span>
      <span *ngIf="reviewCount !== undefined" class="text-slate-400 font-normal">({{ reviewCount }})</span>
    </div>
  `,
})
export class RatingComponent {
  @Input() rating = 0;
  @Input() reviewCount?: number;
  @Input() size = 14;
}
