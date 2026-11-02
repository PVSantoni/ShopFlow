import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'button[appButton], a[appButton]',
  template: `<ng-content />`,
  styleUrl: './button.scss',
  host: { '[class]': 'classes()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly variant = input<'primary' | 'accent' | 'ghost'>('primary');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly block = input(false);

  protected readonly classes = computed(
    () => `btn btn--${this.variant()} btn--${this.size()}${this.block() ? ' btn--block' : ''}`,
  );
}
