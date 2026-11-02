import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  template: `<ng-content />`,
  styles: `
    :host {
      display: inline-block;
      padding: 0.125rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 600;
      background: var(--color-price);
      color: #fff;
    }
    :host([tone='dark']) { background: var(--color-subheader-bg); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  readonly tone = input<'danger' | 'dark'>('danger');
}
