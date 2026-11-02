import { Cents, Id } from './common.model';
import { Product } from './product.model';

export interface CartItem {
  productId: Id;
  /** Données d'affichage, pour ne pas refaire un appel par ligne. */
  product: Pick<Product, 'id' | 'name' | 'slug' | 'imageUrls' | 'stock'>;
  quantity: number;
  /** Prix unitaire au moment de l'ajout. */
  unitPriceCents: Cents;
  lineTotalCents: Cents;
}

export interface Cart {
  id: Id;
  items: CartItem[];
  promoCode?: string;
  subtotalCents: Cents;
  discountCents: Cents;
  totalCents: Cents;
}

/** Corps de POST /cart/items et PATCH /cart/items/:productId (quantity: 0 = retirer). */
export interface CartItemInput {
  productId: Id;
  quantity: number;
}
