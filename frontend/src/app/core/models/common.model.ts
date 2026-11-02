/** Identifiant d'une ressource, tel que renvoyé par l'API. */
export type Id = number;

/** Date au format ISO 8601, ex. "2026-11-02T13:45:00Z". */
export type IsoDate = string;

/**
 * Tous les montants sont des entiers en centimes (1999 = 19,99 €),
 * pour éviter les erreurs d'arrondi sur les calculs de panier et de paiement.
 */
export type Cents = number;

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiError {
  status: number;
  message: string;
  /** Erreurs de validation par champ, ex. { email: "Adresse invalide" }. */
  fields?: Record<string, string>;
}
