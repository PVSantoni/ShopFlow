import { LucideBot, LucideCog, LucideCpu, LucideIcon, LucideRadar } from '@lucide/angular';

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
