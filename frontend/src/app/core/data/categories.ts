import {
  LucideBot,
  LucideCog,
  LucideCpu,
  LucideIcon,
  LucideRadar,
  LucideWrench,
} from '@lucide/angular';

export interface CatalogCategory {
  /** Même slug que côté API : sert de filtre `category` et de paramètre d'URL `categorie`. */
  slug: string;
  name: string;
  icon: LucideIcon;
  hint: string;
  hue: number;
}

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  { slug: 'microcontroleurs', name: 'Microcontrôleurs', icon: LucideCpu, hint: 'Arduino, ESP32, Pico', hue: 215 },
  { slug: 'capteurs', name: 'Capteurs', icon: LucideRadar, hint: 'Distance, température, mouvement', hue: 160 },
  { slug: 'kits-robotiques', name: 'Kits robotiques', icon: LucideBot, hint: 'Châssis, moteurs, guides', hue: 275 },
  { slug: 'moteurs-servos', name: 'Moteurs et servos', icon: LucideCog, hint: 'DC, pas à pas, servos', hue: 25 },
  { slug: 'outillage-alimentation', name: 'Outillage et alimentation', icon: LucideWrench, hint: 'Soudure, mesure, alimentations', hue: 45 },
];
