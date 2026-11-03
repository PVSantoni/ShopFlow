import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { API_URL } from '../api';
import { Cart, Id } from '../models';

const TOKEN_KEY = 'cartToken';

/** Panier sans compte : l'API renvoie un token (cart.id) qu'on garde et renvoie dans X-Cart-Token. */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);

  readonly cart = signal<Cart | null>(null);
  readonly count = computed(() => this.cart()?.items.reduce((n, item) => n + item.quantity, 0) ?? 0);

  constructor() {
    this.http.get<Cart>(`${API_URL}/cart`, this.options()).subscribe({ next: (c) => this.set(c), error: () => {} });
  }

  add(productId: Id, quantity = 1) {
    return this.http
      .post<Cart>(`${API_URL}/cart/items`, { productId, quantity }, this.options())
      .pipe(tap((c) => this.set(c)));
  }

  /** quantity = 0 retire la ligne. */
  update(productId: Id, quantity: number) {
    return this.http
      .patch<Cart>(`${API_URL}/cart/items/${productId}`, { quantity }, this.options())
      .pipe(tap((c) => this.set(c)));
  }

  /** Après une commande réussie : le panier n'est pas vidé côté API, on oublie son token. */
  forget(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    this.cart.set(null);
  }

  /** En-tête X-Cart-Token pour les autres appels qui portent sur le panier courant. */
  headers(): Record<string, string> {
    return this.options().headers;
  }

  private set(cart: Cart): void {
    this.cart.set(cart);
    try {
      cart.id ? localStorage.setItem(TOKEN_KEY, cart.id) : localStorage.removeItem(TOKEN_KEY);
    } catch {}
  }

  private options(): { headers: Record<string, string> } {
    let token: string | null = null;
    try {
      token = localStorage.getItem(TOKEN_KEY);
    } catch {}
    return { headers: token ? { 'X-Cart-Token': token } : {} };
  }
}
