import { Id, IsoDate } from './common.model';

export type UserRole = 'customer' | 'employee' | 'admin';

export interface User {
  id: Id;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  createdAt: IsoDate;
}

export interface Address {
  id: Id;
  label?: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  postalCode: string;
  city: string;
  /** Code pays ISO 3166-1 alpha-2, ex. "FR". */
  country: string;
  phone?: string;
  isDefault: boolean;
}

/** Une adresse à créer : même contenu, sans les champs gérés par l'API. */
export type AddressInput = Omit<Address, 'id' | 'isDefault'>;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  firstName: string;
  lastName: string;
  /** Consentement RGPD obligatoire. */
  acceptTerms: true;
}

export interface AuthResponse {
  token: string;
  user: User;
}
