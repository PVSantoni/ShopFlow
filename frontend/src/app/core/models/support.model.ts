import { Id, IsoDate } from './common.model';

/** Corps de POST /contact (formulaire de la page Contact). */
export interface ContactMessageInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
  /** Référence de commande concernée, si le client la précise. */
  orderReference?: string;
}

export type SupportStatus = 'open' | 'in_progress' | 'closed';

export interface SupportRequest extends ContactMessageInput {
  id: Id;
  status: SupportStatus;
  createdAt: IsoDate;
}
