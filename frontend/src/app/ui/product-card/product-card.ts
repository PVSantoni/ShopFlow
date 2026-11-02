import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideDynamicIcon, LucideIcon } from '@lucide/angular';
import { Button } from '../button/button';
import { Badge } from '../badge/badge';
import { Price } from '../price/price';
import { Rating } from '../rating/rating';

/** Données d'affichage d'une carte. Un mapper Product -> ProductCardItem viendra avec l'API. */
export interface ProductCardItem {
  id: number;
  title: string;
  /** Prix en euros (affichage). */
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  icon: LucideIcon;
  hue: number;
  badge?: string;
}

@Component({
  selector: 'app-product-card',
  imports: [LucideDynamicIcon, Button, Badge, Price, Rating],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<ProductCardItem>();

  protected readonly discount = computed(() => {
    const { price, originalPrice } = this.product();
    return originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
  });
}
