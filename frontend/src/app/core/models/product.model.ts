import { Cents, Id, IsoDate, Page } from './common.model';

export interface Category {
  id: Id;
  name: string;
  slug: string;
}

/** Niveau indicatif, surtout pour les kits robotiques. */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Product {
  id: Id;
  /** Référence interne unique. */
  sku: string;
  slug: string;
  name: string;
  description: string;
  priceCents: Cents;
  /** Prix barré : renseigné uniquement si le produit est en promotion. */
  compareAtPriceCents?: Cents;
  category: Category;
  imageUrls: string[];
  /** Caractéristiques techniques, ex. { "Tension": "3,3 V", "Protocole": "I2C" }. */
  specs: Record<string, string>;
  datasheetUrl?: string;
  difficulty?: Difficulty;
  /** Quantité disponible. 0 = rupture : l'ajout au panier est refusé. */
  stock: number;
  /** Note moyenne sur 5, 0 s'il n'y a pas encore d'avis. */
  averageRating: number;
  reviewCount: number;
  /** Produit visible dans le catalogue. */
  active: boolean;
  createdAt: IsoDate;
}

export type ProductSort = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rating';

/** Paramètres de GET /products (tous optionnels). */
export interface ProductQuery {
  q?: string;
  category?: string;
  minPriceCents?: Cents;
  maxPriceCents?: Cents;
  inStockOnly?: boolean;
  difficulty?: Difficulty;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
}

export type ProductPage = Page<Product>;

/** Corps de POST/PUT /admin/products. */
export type ProductInput = Omit<
  Product,
  'id' | 'category' | 'averageRating' | 'reviewCount' | 'createdAt'
> & { categoryId: Id };
