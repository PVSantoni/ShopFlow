import { Cents, Id, IsoDate } from './common.model';

export type PromoType = 'percent' | 'fixed';

export interface PromoCode {
  id: Id;
  code: string;
  type: PromoType;
  /** Pourcentage (0-100) si type = "percent", sinon montant en centimes. */
  value: number;
  minOrderCents?: Cents;
  expiresAt?: IsoDate;
  active: boolean;
}
