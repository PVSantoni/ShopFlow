import {
  LucideBatteryCharging,
  LucideBot,
  LucideCircuitBoard,
  LucideCog,
  LucideCpu,
  LucideFlame,
  LucideGauge,
  LucideIcon,
  LucideMicrochip,
  LucideRadar,
  LucideWifi,
  LucideZap,
} from '@lucide/angular';
import { ProductCardItem } from '../../ui/product-card/product-card';

export const SLIDES = [
  { title: 'Lancez-vous en robotique', text: 'Kits complets avec guide pas à pas, dès 39 €', cta: 'Voir les kits', hue: 215 },
  { title: 'Microcontrôleurs', text: 'Arduino, ESP32, Raspberry Pi Pico en stock', cta: 'Découvrir', hue: 160 },
  { title: 'Capteurs et modules', text: 'Distance, température, mouvement : tout pour vos projets', cta: 'Explorer', hue: 25 },
];

export const CATEGORIES: { title: string; icon: LucideIcon; hue: number }[] = [
  { title: 'Microcontrôleurs', icon: LucideCpu, hue: 215 },
  { title: 'Capteurs', icon: LucideRadar, hue: 160 },
  { title: 'Kits robotiques', icon: LucideBot, hue: 275 },
  { title: 'Moteurs et servos', icon: LucideCog, hue: 25 },
];

export const DEALS: ProductCardItem[] = [
  { id: 1, title: 'Carte Arduino Uno R4 WiFi', price: 24.9, originalPrice: 29.9, rating: 4.5, reviews: 1284, icon: LucideCpu, hue: 215, badge: 'Promo' },
  { id: 2, title: 'Kit robot 4 roues à monter, châssis et moteurs', price: 39.9, originalPrice: 59.9, rating: 4.5, reviews: 764, icon: LucideBot, hue: 275, badge: 'Stock limité' },
  { id: 3, title: 'Lot de 10 capteurs ultrason HC-SR04', price: 12.5, originalPrice: 18.0, rating: 4, reviews: 932, icon: LucideRadar, hue: 160 },
  { id: 4, title: 'Alimentation de laboratoire réglable 30 V', price: 49.9, originalPrice: 69.9, rating: 4.5, reviews: 412, icon: LucideBatteryCharging, hue: 45 },
  { id: 5, title: 'Fer à souder à température réglable', price: 27.9, originalPrice: 36.9, rating: 4, reviews: 1503, icon: LucideFlame, hue: 10 },
];

export const BEST_SELLERS: ProductCardItem[] = [
  { id: 6, title: 'ESP32 DevKit WiFi et Bluetooth', price: 9.9, rating: 4.5, reviews: 5120, icon: LucideWifi, hue: 200, badge: 'Meilleure vente' },
  { id: 7, title: 'Raspberry Pi Pico H', price: 6.5, rating: 5, reviews: 3310, icon: LucideMicrochip, hue: 330 },
  { id: 8, title: 'Kit de démarrage électronique, 300 composants', price: 29.9, rating: 4.5, reviews: 2210, icon: LucideCircuitBoard, hue: 150, badge: 'Meilleure vente' },
  { id: 9, title: 'Lot de 5 micro-servos SG90', price: 11.9, rating: 4, reviews: 4780, icon: LucideCog, hue: 25 },
  { id: 10, title: 'Multimètre numérique auto-range', price: 19.9, rating: 4.5, reviews: 1890, icon: LucideGauge, hue: 260 },
  { id: 11, title: 'Assortiment de résistances et condensateurs', price: 14.9, rating: 4, reviews: 980, icon: LucideZap, hue: 45 },
];
