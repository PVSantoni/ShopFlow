import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type ThemeChoice = 'light' | 'dark' | 'system';

export const THEME_KEY = 'theme';

/**
 * Thème choisi par l'utilisateur, mémorisé dans le localStorage.
 * « system » suit la préférence de l'OS : aucun attribut `data-theme` n'est posé.
 * Le script de index.html applique le même choix avant le rendu pour éviter un flash.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root = inject(DOCUMENT).documentElement;

  readonly theme = signal<ThemeChoice>(this.load());

  constructor() {
    effect(() => {
      const theme = this.theme();
      if (theme === 'system') this.root.removeAttribute('data-theme');
      else this.root.setAttribute('data-theme', theme);
      try {
        theme === 'system' ? localStorage.removeItem(THEME_KEY) : localStorage.setItem(THEME_KEY, theme);
      } catch {}
    });
  }

  set(theme: ThemeChoice): void {
    this.theme.set(theme);
  }

  private load(): ThemeChoice {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved === 'light' || saved === 'dark' ? saved : 'system';
    } catch {
      return 'system';
    }
  }
}
