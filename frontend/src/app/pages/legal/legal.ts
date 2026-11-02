import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PageShell } from '../../ui/page-shell/page-shell';
import { LegalDoc } from './legal.data';

/** Page de texte juridique générique. Le contenu arrive via les `data` de la route. */
@Component({
  selector: 'app-legal',
  imports: [PageShell],
  template: `
    <app-page-shell [title]="doc().title" [subtitle]="doc().subtitle">
      <article class="legal">
        @for (s of doc().sections; track s.heading) {
          <section>
            <h2>{{ s.heading }}</h2>
            @for (p of s.body; track $index) {
              <p>{{ p }}</p>
            }
          </section>
        }
      </article>
    </app-page-shell>
  `,
  styles: `
    .legal { display: grid; gap: var(--space-6); padding: var(--space-6); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); }
    h2 { font-size: 1.125rem; margin-bottom: var(--space-2); }
    p + p { margin-top: var(--space-2); }
    p { color: var(--color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Legal {
  readonly doc = input.required<LegalDoc>();
}
