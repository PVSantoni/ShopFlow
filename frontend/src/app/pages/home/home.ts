import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideDynamicIcon,
} from '@lucide/angular';
import { RouterLink } from '@angular/router';
import { Button } from '../../ui/button/button';
import { ProductCard } from '../../ui/product-card/product-card';
import { BEST_SELLERS, CATEGORIES, DEALS, SLIDES } from './home.data';

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
  protected readonly deals = DEALS;
  protected readonly bestSellers = BEST_SELLERS;

  protected readonly slideIndex = signal(0);

  protected go(step: number): void {
    const n = this.slides.length;
    this.slideIndex.update((i) => (i + step + n) % n);
  }
}
