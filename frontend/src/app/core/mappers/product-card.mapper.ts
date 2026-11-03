import {
  LucideBatteryCharging,
  LucideBot,
  LucideCog,
  LucideCpu,
  LucideIcon,
  LucideRadar,
} from '@lucide/angular';
import { Product } from '../models';
import { ProductCardItem } from '../../ui/product-card/product-card';

/** Icône et teinte par catégorie : l'API ne les fournit pas. */
const VISUALS: Record<string, { icon: LucideIcon; hue: number }> = {
  microcontroleurs: { icon: LucideCpu, hue: 215 },
  capteurs: { icon: LucideRadar, hue: 160 },
  'kits-robotiques': { icon: LucideBot, hue: 275 },
  'moteurs-servos': { icon: LucideCog, hue: 25 },
  'outillage-alimentation': { icon: LucideBatteryCharging, hue: 45 },
};
const DEFAULT_VISUAL = { icon: LucideCpu, hue: 215 };

export function toCardItem(p: Product): ProductCardItem {
  const { icon, hue } = VISUALS[p.category.slug] ?? DEFAULT_VISUAL;
  return {
    id: p.id,
    title: p.name,
    price: p.priceCents / 100,
    originalPrice: p.compareAtPriceCents ? p.compareAtPriceCents / 100 : undefined,
    rating: p.averageRating,
    reviews: p.reviewCount,
    icon,
    hue,
    badge: p.stock === 0 ? 'Rupture' : p.stock <= 10 ? 'Stock limité' : undefined,
    outOfStock: p.stock === 0,
  };
}
