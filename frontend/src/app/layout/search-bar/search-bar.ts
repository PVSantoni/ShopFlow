import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LucideChevronDown, LucideSearch } from '@lucide/angular';
import { CATALOG_CATEGORIES } from '../../core/data/categories';
import { Dropdown } from '../../ui/dropdown/dropdown';

const ALL = { slug: '', name: 'Toutes' };
const CATEGORIES = [ALL, ...CATALOG_CATEGORIES];

const SUGGESTIONS = [
  'Arduino Uno R4 WiFi',
  'ESP32 DevKit',
  'Raspberry Pi Pico',
  'Capteur ultrason HC-SR04',
  'Capteur de température DHT22',
  'Kit robot 4 roues',
  'Kit de démarrage électronique',
  'Servomoteur SG90',
  'Moteur pas à pas NEMA 17',
  'Module relais 5V',
  'Breadboard 830 points',
  'Alimentation de laboratoire',
  'Fer à souder',
  'Multimètre numérique',
  'Résistances assorties',
];

@Component({
  selector: 'app-search-bar',
  imports: [Dropdown, LucideChevronDown, LucideSearch],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBar {
  private readonly router = inject(Router);

  protected readonly categories = CATEGORIES;
  protected readonly category = signal<{ slug: string; name: string }>(ALL);
  protected readonly query = signal('');
  protected readonly focused = signal(false);
  protected readonly active = signal(-1);

  protected readonly suggestions = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q.length < 2 ? [] : SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)).slice(0, 6);
  });

  protected readonly panelOpen = computed(() => this.focused() && this.suggestions().length > 0);

  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.active.set(-1);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.suggestions().length;
    if (!count) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.active.update((i) => (i + 1) % count);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.active.update((i) => (i <= 0 ? count - 1 : i - 1));
    } else if (event.key === 'Escape') {
      this.focused.set(false);
    }
  }

  protected pick(value: string): void {
    this.query.set(value);
    this.submit(value);
  }

  protected submit(forced?: string): void {
    const picked = this.suggestions()[this.active()];
    const q = (forced ?? picked ?? this.query()).trim();
    if (!q) return;
    this.query.set(q);
    this.focused.set(false);
    this.router.navigate(['/catalogue'], {
      queryParams: { q, categorie: this.category().slug || null },
    });
  }
}
