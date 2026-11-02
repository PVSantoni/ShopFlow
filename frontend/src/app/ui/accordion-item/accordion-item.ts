import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { LucideChevronDown } from '@lucide/angular';

let nextId = 0;

@Component({
  selector: 'app-accordion-item',
  imports: [LucideChevronDown],
  template: `
    <h3>
      <button
        class="acc__head"
        type="button"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="id"
        (click)="open.set(!open())"
      >
        <span>{{ title() }}</span>
        <svg lucideChevronDown class="acc__chevron" [class.acc__chevron--open]="open()" [size]="20"></svg>
      </button>
    </h3>
    @if (open()) {
      <div class="acc__body" [id]="id"><ng-content /></div>
    }
  `,
  styles: `
    :host { display: block; border-bottom: 1px solid var(--color-border); }
    h3 { font-size: 1rem; }
    .acc__head {
      display: flex; align-items: center; justify-content: space-between; gap: 1rem;
      width: 100%; padding: 1rem 0; border: 0; background: none;
      font: inherit; font-weight: 600; text-align: left; cursor: pointer; color: inherit;
    }
    .acc__chevron { flex-shrink: 0; transition: transform 0.2s; }
    .acc__chevron--open { transform: rotate(180deg); }
    .acc__body { padding-bottom: 1rem; color: var(--color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionItem {
  readonly title = input.required<string>();
  readonly open = signal(false);
  protected readonly id = `acc-${nextId++}`;
}
