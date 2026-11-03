import { Injectable, effect, signal } from '@angular/core';
import { CartItem, Cents, Id } from '../models';

/** Un article « mis de côté » : instantané de la ligne au moment où on l'a sorti du panier. */
export interface SavedItem {
  productId: Id;
  name: string;
  slug: string;
  quantity: number;
  /** Prix au moment de la mise de côté : indicatif, le panier reprendra le prix courant. */
  unitPriceCents: Cents;
}

const KEY = 'savedForLater';

/**
 * « Mettre de côté pour plus tard ». L'API n'a pas cette notion : la liste vit côté navigateur
 * (localStorage), comme le token du panier.
 */
@Injectable({ providedIn: 'root' })
export class SavedItemsService {
  readonly items = signal<SavedItem[]>(this.load());

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(this.items()));
      } catch {}
    });
  }

  save(item: CartItem): void {
    const saved: SavedItem = {
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
    };
    this.items.update((list) => [...list.filter((i) => i.productId !== saved.productId), saved]);
  }

  remove(productId: Id): void {
    this.items.update((list) => list.filter((i) => i.productId !== productId));
  }

  private load(): SavedItem[] {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]');
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  }
}
