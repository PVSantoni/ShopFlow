import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

@Component({
  selector: 'app-price',
  template: `
    <span class="price">{{ current() }}</span>
    @if (previous(); as old) {
      <s class="old">{{ old }}</s>
    }
  `,
  styles: `
    :host { display: inline-flex; align-items: baseline; gap: 0.5rem; }
    .price { font-size: 1.25rem; font-weight: 600; }
    .old { font-size: 0.8125rem; color: var(--color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Price {
  readonly value = input.required<number>();
  readonly original = input<number | undefined>();
  protected readonly current = computed(() => eur.format(this.value()));
  protected readonly previous = computed(() => {
    const o = this.original();
    return o ? eur.format(o) : null;
  });
}
