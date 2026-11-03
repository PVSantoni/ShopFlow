import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideBatteryCharging,
  LucideBot,
  LucideChevronDown,
  LucideCog,
  LucideCpu,
  LucideDynamicIcon,
  LucideMenu,
  LucideRadar,
  LucideShoppingCart,
  LucideWrench,
} from '@lucide/angular';
import { CartService } from '../../core/services/cart.service';
import { Button } from '../../ui/button/button';
import { Dropdown } from '../../ui/dropdown/dropdown';
import { SearchBar } from '../search-bar/search-bar';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    Button,
    Dropdown,
    SearchBar,
    LucideChevronDown,
    LucideDynamicIcon,
    LucideMenu,
    LucideShoppingCart,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  protected readonly cartCount = inject(CartService).count;

  protected readonly catalog = [
    { label: 'Microcontrôleurs', icon: LucideCpu, hint: 'Arduino, ESP32, Pico' },
    { label: 'Capteurs', icon: LucideRadar, hint: 'Distance, température, mouvement' },
    { label: 'Kits robotiques', icon: LucideBot, hint: 'Châssis, moteurs, guides' },
    { label: 'Moteurs et servos', icon: LucideCog, hint: 'DC, pas à pas, servos' },
    { label: 'Alimentation', icon: LucideBatteryCharging, hint: 'Piles, régulateurs, blocs' },
    { label: 'Outillage', icon: LucideWrench, hint: 'Soudure, mesure, câbles' },
  ];

  protected readonly quickLinks = [
    { label: 'Offres du jour', path: '/catalogue' },
    { label: 'Nouveautés', path: '/catalogue' },
    { label: 'Meilleures ventes', path: '/catalogue' },
    { label: 'Kits débutants', path: '/catalogue' },
    { label: 'Aide', path: '/faq' },
  ];

  protected readonly accountLinks = [
    { label: 'Mon compte', path: '/compte' },
    { label: 'Mes commandes', path: '/commandes' },
    { label: 'Suivi de livraison', path: '/commandes' },
  ];
}
