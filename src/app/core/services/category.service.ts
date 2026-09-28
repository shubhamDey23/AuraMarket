import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { MOCK_CATEGORIES } from '../../data/mock/categories.mock';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories: Category[] = [...MOCK_CATEGORIES];

  getCategories(): Observable<Category[]> {
    return of(this.categories).pipe(delay(50));
  }

  getTopLevelCategories(): Observable<Category[]> {
    const list = this.categories.filter((c) => !c.parentId && !c.parentCategoryId);
    return of(list).pipe(delay(50));
  }

  getCategoriesByDepartment(department: string): Observable<Category[]> {
    const deptLower = department.toLowerCase();
    const list = this.categories.filter(
      (c) => c.department?.toLowerCase() === deptLower || c.name.toLowerCase() === deptLower
    );
    return of(list).pipe(delay(50));
  }

  getSubcategories(parentCategoryId: string): Observable<Category[]> {
    const list = this.categories.filter(
      (c) => c.parentId === parentCategoryId || c.parentCategoryId === parentCategoryId
    );
    return of(list).pipe(delay(50));
  }

  getCategoriesByGender(gender: 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX'): Observable<Category[]> {
    const list = this.categories.filter((c) => c.gender === gender || c.gender === 'UNISEX');
    return of(list).pipe(delay(50));
  }

  getCategoryById(id: string): Observable<Category | undefined> {
    const cat = this.categories.find((c) => c.id === id);
    return of(cat).pipe(delay(50));
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    const cat = this.categories.find((c) => c.slug === slug);
    return of(cat).pipe(delay(50));
  }

  getFeaturedCategories(): Observable<Category[]> {
    const featured = this.categories.filter((c) => c.isFeatured);
    return of(featured).pipe(delay(50));
  }
}
