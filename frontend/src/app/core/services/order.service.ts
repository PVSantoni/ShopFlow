import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { API_URL } from '../api';
import { PlacedOrder } from '../models';
import { CartService } from './cart.service';

const LAST_ORDER_KEY = 'lastOrder';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly cart = inject(CartService);

  /** Dernière commande passée : sert à la page de confirmation (gardée en sessionStorage). */
  readonly lastOrder = signal<PlacedOrder | null>(this.load());

  /**
   * Passe la commande du panier courant. 201 : commande payée, on oublie le panier.
   * 402 : paiement refusé, le panier est conservé et l'erreur porte { message, order }.
   */
  place() {
    return this.http
      .post<PlacedOrder>(`${API_URL}/orders`, null, { headers: this.cart.headers() })
      .pipe(
        tap((order) => {
          this.lastOrder.set(order);
          try {
            sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
          } catch {}
          this.cart.forget();
        }),
      );
  }

  private load(): PlacedOrder | null {
    try {
      return JSON.parse(sessionStorage.getItem(LAST_ORDER_KEY) ?? 'null');
    } catch {
      return null;
    }
  }
}
