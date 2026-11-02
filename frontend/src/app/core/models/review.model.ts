import { Id, IsoDate } from './common.model';

export type ReviewStatus = 'pending' | 'published' | 'rejected';

export interface Review {
  id: Id;
  productId: Id;
  /** Prénom et initiale du nom, ex. "Marie D." */
  authorName: string;
  /** Entier de 1 à 5. */
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: IsoDate;
}

/** Corps de POST /products/:id/reviews. */
export interface ReviewInput {
  rating: number;
  comment: string;
}
