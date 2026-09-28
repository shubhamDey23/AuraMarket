import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  template: `
    <div class="container space-y-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200">
        <h1 class="text-2xl font-bold text-slate-900">All Marketplace Categories</h1>
        <p class="text-xs text-slate-500 mt-1">Browse products organized by department</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <a
          *ngFor="let cat of categories"
          [routerLink]="['/products']"
          [queryParams]="{categoryId: cat.id}"
          class="card p-6 bg-white hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <app-icon [name]="cat.icon || 'layers'" [size]="24"></app-icon>
            </div>
            <h3 class="font-bold text-slate-900 text-base mb-1">{{ cat.name }}</h3>
            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{{ cat.description }}</p>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600">
            <span>{{ cat.productCount }}+ Products</span>
            <app-icon name="arrow-right" [size]="14"></app-icon>
          </div>
        </a>
      </div>
    </div>
  `,
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((res) => (this.categories = res));
  }
}
