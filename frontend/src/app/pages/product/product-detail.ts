import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import {
  LucideCheck,
  LucideChevronRight,
  LucideDynamicIcon,
  LucideExternalLink,
  LucideMinus,
  LucidePlus,
} from '@lucide/angular';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { visualOf } from '../../core/mappers/product-card.mapper';
import { Product } from '../../core/models';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { Badge } from '../../ui/badge/badge';
import { Button } from '../../ui/button/button';
import { Price } from '../../ui/price/price';
import { Rating } from '../../ui/rating/rating';
import { NotFound } from '../not-found/not-found';

type State = { kind: 'loading' } | { kind: 'missing' } | { kind: 'ready'; product: Product };

@Component({
  selector: 'app-product-detail',
  imports: [
    RouterLink,
    Badge,
    Button,
    NotFound,
    Price,
    Rating,
    LucideCheck,
    LucideChevronRight,
    LucideDynamicIcon,
    LucideExternalLink,
    LucideMinus,
    LucidePlus,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private readonly products = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly title = inject(Title);

  /** Paramètre de route `:slug` (withComponentInputBinding). */
  readonly slug = input.required<string>();

  protected readonly state = toSignal(
    toObservable(this.slug).pipe(
      switchMap((slug) =>
        this.products.bySlug(slug).pipe(
          map((product): State => ({ kind: 'ready', product })),
          catchError(() => of<State>({ kind: 'missing' })),
          startWith<State>({ kind: 'loading' }),
        ),
      ),
    ),
    { initialValue: { kind: 'loading' } as State },
  );

  protected readonly product = computed(() => {
    const s = this.state();
    return s.kind === 'ready' ? s.product : null;
  });

  protected readonly visual = computed(() => {
    const p = this.product();
    return p ? visualOf(p) : null;
  });

  protected readonly discount = computed(() => {
    const p = this.product();
    return p?.compareAtPriceCents ? Math.round((1 - p.priceCents / p.compareAtPriceCents) * 100) : 0;
  });

  protected readonly specs = computed(() => Object.entries(this.product()?.specs ?? {}));

  protected readonly stockLabel = computed(() => {
    const stock = this.product()?.stock ?? 0;
    if (stock === 0) return 'Rupture de stock';
    return stock <= 10 ? `Plus que ${stock} en stock` : `En stock · ${stock} disponibles`;
  });

  protected readonly quantity = signal(1);
  protected readonly added = signal(false);
  protected readonly error = signal('');

  constructor() {
    effect(() => {
      const p = this.product();
      if (p) {
        this.title.setTitle(`${p.name} - FlowShop`);
        this.quantity.set(1);
        this.added.set(false);
        this.error.set('');
      }
    });
  }

  protected step(delta: number): void {
    const max = this.product()?.stock ?? 1;
    this.quantity.update((q) => Math.min(max, Math.max(1, q + delta)));
  }

  protected addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.error.set('');
    this.cart.add(p.id, this.quantity()).subscribe({
      next: () => this.added.set(true),
      error: (e) => this.error.set(e.error?.message ?? "Impossible d'ajouter au panier."),
    });
  }
}
