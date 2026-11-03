import { Address, AddressInput } from './user.model';
import { Cents, Id, IsoDate } from './common.model';
import { Product } from './product.model';

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface DeliveryMethod {
  id: Id;
  name: string;
  carrier: string;
  priceCents: Cents;
  /** Délai estimé en jours ouvrés. */
  estimatedDays: number;
}

export interface OrderItem {
  productId: Id;
  name: Product['name'];
  imageUrl?: string;
  quantity: number;
  unitPriceCents: Cents;
  lineTotalCents: Cents;
}

export interface Shipment {
  carrier: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippedAt?: IsoDate;
  deliveredAt?: IsoDate;
}

export interface Order {
  id: Id;
  /** Numéro lisible affiché au client, ex. "FS-2026-000123". */
  reference: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  shippingAddress: Address;
  deliveryMethod: DeliveryMethod;
  shipment?: Shipment;
  promoCode?: string;
  subtotalCents: Cents;
  discountCents: Cents;
  shippingCents: Cents;
  totalCents: Cents;
  createdAt: IsoDate;
}

/** Corps de POST /orders : crée la commande à partir du panier courant. */
export interface CreateOrderPayload {
  deliveryMethodId: Id;
  shippingAddressId?: Id;
  /** Utilisé si l'adresse n'est pas encore enregistrée (ex. invité). */
  shippingAddress?: AddressInput;
}

/** Réponse de POST /orders : la commande et ce qu'il faut pour payer. */
export interface CheckoutSession {
  order: Order;
  /** URL de paiement ou client secret du prestataire (Stripe). */
  paymentUrl?: string;
  clientSecret?: string;
}

export type PlacedOrderStatus = 'en_attente_paiement' | 'payee' | 'paiement_refuse';

export interface PlacedOrderItem {
  productId: Id;
  name: string;
  quantity: number;
  unitPriceCents: Cents;
  lineTotalCents: Cents;
}

/** Réponse de POST /orders (X-Cart-Token) : 201 si payée, 402 avec { order } si paiement refusé. */
export interface PlacedOrder {
  id: string;
  status: PlacedOrderStatus;
  totalCents: Cents;
  paymentReference: string | null;
  createdAt: IsoDate;
  items: PlacedOrderItem[];
}
