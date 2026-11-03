import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideDynamicIcon,
} from '@lucide/angular';
import { RouterLink } from '@angular/router';
import { toCardItem } from '../../core/mappers/product-card.mapper';
import { ProductService } from '../../core/services/product.service';
import { Button } from '../../ui/button/button';
import { ProductCard } from '../../ui/product-card/product-card';
import { CATEGORIES, SLIDES } from './home.data';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    Button,
    ProductCard,
    LucideChevronLeft,
    LucideChevronRight,
    LucideDynamicIcon,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly slides = SLIDES;
  protected readonly categories = CATEGORIES;

  private readonly products = toSignal(
    inject(ProductService)
      .list({ pageSize: 50 })
      .pipe(
        map((page) => page.items),
        catchError(() => of([])),
      ),
    { initialValue: [] },
  );
  /** Produits en promo. */
  protected readonly deals = computed(() => this.products().filter((p) => p.compareAtPriceCents).slice(0, 5).map(toCardItem));
  /** Pas encore de ventes côté API : on affiche les produits sans promo. */
  protected readonly bestSellers = computed(() => this.products().filter((p) => !p.compareAtPriceCents).slice(0, 6).map(toCardItem));

  protected readonly slideIndex = signal(0);

  protected go(step: number): void {
    const n = this.slides.length;
    this.slideIndex.update((i) => (i + step + n) % n);
  }
}
