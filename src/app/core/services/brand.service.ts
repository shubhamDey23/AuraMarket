import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Brand } from '../models/brand.model';
import { MOCK_BRANDS } from '../../data/mock/brands.mock';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private brands = [...MOCK_BRANDS];

  getBrands(): Observable<Brand[]> {
    return of(this.brands).pipe(delay(100));
  }

  getFeaturedBrands(): Observable<Brand[]> {
    return of(this.brands.filter((b) => b.isFeatured)).pipe(delay(100));
  }

  getBrandById(id: string): Observable<Brand | undefined> {
    const b = this.brands.find((brand) => brand.id === id);
    return of(b).pipe(delay(80));
  }
}
