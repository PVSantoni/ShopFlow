import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-shell',
  template: `
    <div class="shell">
      <header class="shell__head">
        <h1>{{ title() }}</h1>
        @if (subtitle()) {
          <p>{{ subtitle() }}</p>
        }
      </header>
      <ng-content />
    </div>
  `,
  styles: `
    :host { display: block; background: var(--color-surface); }
    .shell {
      max-width: 52rem; margin-inline: auto;
      padding: var(--space-8) var(--space-4) var(--space-16);
    }
    .shell__head { margin-bottom: var(--space-8); }
    h1 { font-size: clamp(1.5rem, 3vw, 2rem); letter-spacing: -0.02em; }
    p { margin-top: var(--space-2); color: var(--color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageShell {
  readonly title = input.required<string>();
  readonly subtitle = input('');
}
