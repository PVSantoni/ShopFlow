import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../api';
import { Product, ProductPage, ProductQuery } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  list(query: ProductQuery = {}) {
    const params = Object.fromEntries(Object.entries(query).filter(([, v]) => v !== undefined)) as Record<
      string,
      string | number | boolean
    >;
    return this.http.get<ProductPage>(`${API_URL}/products`, { params });
  }

  bySlug(slug: string) {
    return this.http.get<Product>(`${API_URL}/products/${encodeURIComponent(slug)}`);
  }
}
