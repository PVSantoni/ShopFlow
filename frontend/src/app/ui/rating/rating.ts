import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideStar } from '@lucide/angular';

@Component({
  selector: 'app-rating',
  imports: [LucideStar],
  template: `
    <span class="stars" role="img" [attr.aria-label]="value() + ' sur 5'">
      <span class="stars__row stars__row--base">
        @for (i of slots; track i) {
          <svg lucideStar [size]="14" [strokeWidth]="1.5"></svg>
        }
      </span>
      <span class="stars__row stars__row--fill" [style.width.%]="percent()">
        @for (i of slots; track i) {
          <svg lucideStar [size]="14" [strokeWidth]="1.5"></svg>
        }
      </span>
    </span>
    @if (count() !== null) {
      <span class="count">{{ count() }}</span>
    }
  `,
  styles: `
    :host { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.8125rem; }
    .stars { position: relative; display: inline-block; line-height: 0; }
    .stars__row { display: flex; gap: 1px; }
    .stars__row--base { color: var(--color-border); }
    .stars__row--fill { position: absolute; inset: 0 auto 0 0; overflow: hidden; color: var(--color-star); }
    .stars__row--fill svg { flex-shrink: 0; fill: currentColor; }
    .stars__row--base svg { fill: currentColor; }
    .count { color: var(--color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Rating {
  readonly value = input.required<number>();
  readonly count = input<number | null>(null);
  protected readonly slots = [0, 1, 2, 3, 4];
  protected readonly percent = computed(() => (Math.min(5, Math.max(0, this.value())) / 5) * 100);
}
