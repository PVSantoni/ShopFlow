import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideSearchX } from '@lucide/angular';
import { Button } from '../../ui/button/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Button, LucideSearchX],
  template: `
    <section class="nf">
      <svg lucideSearchX [size]="64" [strokeWidth]="1.25"></svg>
      <h1>Page introuvable</h1>
      <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <a appButton variant="accent" routerLink="/">Retour à l'accueil</a>
    </section>
  `,
  styles: `
    .nf { display: grid; justify-items: center; gap: var(--space-3); padding: var(--space-16) var(--space-4); text-align: center; }
    svg { color: var(--color-text-muted); }
    p { color: var(--color-text-muted); margin-bottom: var(--space-3); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {}
