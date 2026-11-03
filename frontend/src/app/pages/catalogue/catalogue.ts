import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { LucideChevronLeft, LucideChevronRight, LucideSearchX, LucideSlidersHorizontal } from '@lucide/angular';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { CATALOG_CATEGORIES } from '../../core/data/categories';
import { toCardItem } from '../../core/mappers/product-card.mapper';
import { ProductPage, ProductQuery, ProductSort } from '../../core/models';
import { ProductService } from '../../core/services/product.service';
import { Button } from '../../ui/button/button';
import { Input } from '../../ui/input/input';
import { ProductCard } from '../../ui/product-card/product-card';

const PAGE_SIZE = 12;

const SORTS: { value: ProductSort; label: string }[] = [
  { value: 'relevance', label: 'Pertinence' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'rating', label: 'Mieux notés' },
];

type State = { kind: 'loading' } | { kind: 'error' } | { kind: 'ready'; page: ProductPage };

const euros = (value: string | undefined): number | undefined => {
  const n = Number(value);
  return value && Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : undefined;
};

/** Catalogue : l'état des filtres vit dans l'URL (`?q=&categorie=&tri=&page=&stock=&min=&max=`). */
@Component({
  selector: 'app-catalogue',
  imports: [
    RouterLink,
    Button,
    Input,
    ProductCard,
    LucideChevronLeft,
    LucideChevronRight,
    LucideSearchX,
    LucideSlidersHorizontal,
  ],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Catalogue {
  private readonly products = inject(ProductService);
  private readonly router = inject(Router);

  // Paramètres d'URL (withComponentInputBinding)
  readonly q = input<string>();
  readonly categorie = input<string>();
  readonly tri = input<string>();
  readonly page = input<string>();
  readonly stock = input<string>();
  readonly min = input<string>();
  readonly max = input<string>();

  protected readonly categories = CATALOG_CATEGORIES;
  protected readonly sorts = SORTS;

  protected readonly sort = computed<ProductSort>(() => SORTS.find((s) => s.value === this.tri())?.value ?? 'relevance');
  protected readonly currentPage = computed(() => Math.max(1, Math.floor(Number(this.page())) || 1));

  private readonly query = computed<ProductQuery>(() => ({
    q: this.q()?.trim() || undefined,
    category: this.categorie() || undefined,
    sort: this.sort(),
    page: this.currentPage(),
    pageSize: PAGE_SIZE,
    inStockOnly: this.stock() === '1' ? true : undefined,
    minPriceCents: euros(this.min()),
    maxPriceCents: euros(this.max()),
  }));

  protected readonly state = toSignal(
    toObservable(this.query).pipe(
      switchMap((query) =>
        this.products.list(query).pipe(
          map((page): State => ({ kind: 'ready', page })),
          catchError(() => of<State>({ kind: 'error' })),
          startWith<State>({ kind: 'loading' }),
        ),
      ),
    ),
    { initialValue: { kind: 'loading' } as State },
  );

  protected readonly items = computed(() => {
    const s = this.state();
    return s.kind === 'ready' ? s.page.items.map(toCardItem) : [];
  });
  protected readonly total = computed(() => {
    const s = this.state();
    return s.kind === 'ready' ? s.page.total : 0;
  });
  protected readonly pageCount = computed(() => Math.max(1, Math.ceil(this.total() / PAGE_SIZE)));
  protected readonly pages = computed(() => Array.from({ length: this.pageCount() }, (_, i) => i + 1));

  protected readonly title = computed(() => {
    const category = this.categories.find((c) => c.slug === this.categorie());
    if (this.q()?.trim()) return `Résultats pour « ${this.q()!.trim()} »`;
    return category?.name ?? 'Tout le catalogue';
  });

  protected readonly hasFilters = computed(
    () => !!(this.q() || this.categorie() || this.stock() || this.min() || this.max()),
  );

  // Champs de prix : saisie locale, appliquée au clic.
  protected readonly minInput = signal('');
  protected readonly maxInput = signal('');
  protected readonly filtersOpen = signal(false);

  constructor() {
    effect(() => {
      this.minInput.set(this.min() ?? '');
      this.maxInput.set(this.max() ?? '');
    });
  }

  protected setParams(params: Record<string, string | null>): void {
    // Tout changement de filtre ramène à la page 1, sauf le changement de page lui-même.
    this.router.navigate([], {
      queryParams: { page: null, ...params },
      queryParamsHandling: 'merge',
    });
  }

  protected applyPrice(): void {
    this.setParams({ min: this.minInput() || null, max: this.maxInput() || null });
  }

  protected toggleStock(checked: boolean): void {
    this.setParams({ stock: checked ? '1' : null });
  }

  protected goTo(page: number): void {
    this.setParams({ page: page > 1 ? String(page) : null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
