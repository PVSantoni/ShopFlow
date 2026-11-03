import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideChevronDown,
  LucideDynamicIcon,
  LucideMenu,
  LucideShoppingCart,
} from '@lucide/angular';
import { CATALOG_CATEGORIES } from '../../core/data/categories';
import { CartService } from '../../core/services/cart.service';
import { Button } from '../../ui/button/button';
import { Dropdown } from '../../ui/dropdown/dropdown';
import { SearchBar } from '../search-bar/search-bar';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    Button,
    Dropdown,
    SearchBar,
    LucideChevronDown,
    LucideDynamicIcon,
    LucideMenu,
    LucideShoppingCart,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly cartService = inject(CartService);

  protected readonly cartCount = this.cartService.count;
  protected readonly cartItems = computed(() => this.cartService.cart()?.items ?? []);
  protected readonly cartTotal = computed(() => this.cartService.cart()?.totalCents ?? 0);

  protected euro(cents: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100);
  }

  protected readonly catalog = CATALOG_CATEGORIES;

  protected readonly quickLinks: { label: string; path: string; params?: Record<string, string> }[] = [
    { label: 'Offres du jour', path: '/catalogue' },
    { label: 'Nouveautés', path: '/catalogue', params: { tri: 'newest' } },
    { label: 'Meilleures ventes', path: '/catalogue' },
    { label: 'Kits débutants', path: '/catalogue' },
    { label: 'Aide', path: '/faq' },
  ];

  protected readonly accountLinks = [
    { label: 'Mon compte', path: '/compte' },
    { label: 'Mes commandes', path: '/commandes' },
    { label: 'Suivi de livraison', path: '/commandes' },
  ];
}
