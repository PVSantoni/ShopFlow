import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  template: `
    <button
      class="dropdown__trigger"
      type="button"
      aria-haspopup="true"
      [attr.aria-expanded]="open()"
      (click)="onTriggerClick()"
    >
      <ng-content select="[trigger]" />
    </button>
    @if (open()) {
      <div
        class="dropdown__panel"
        [class.dropdown__panel--end]="placement() === 'end'"
        (click)="onPanelClick($event)"
      >
        <ng-content />
      </div>
    }
  `,
  styleUrl: './dropdown.scss',
  host: { '[class.is-open]': 'open()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dropdown {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  // Pas `align` : c'est un attribut HTML qui applique un text-align à la balise.
  readonly placement = input<'start' | 'end'>('start');
  readonly hover = input(false);
  readonly closeOnSelect = input(true);

  protected readonly open = signal(false);

  close(): void {
    this.open.set(false);
  }

  protected onTriggerClick(): void {
    // En mode survol, le clic ouvre seulement (utile au tactile).
    this.open.update((o) => (this.hover() ? true : !o));
  }

  protected onPanelClick(event: MouseEvent): void {
    if (this.closeOnSelect() && (event.target as HTMLElement).closest('a, button, [role="option"]')) {
      this.close();
    }
  }

  @HostListener('mouseenter')
  protected onEnter(): void {
    if (this.hover()) this.open.set(true);
  }

  @HostListener('mouseleave')
  protected onLeave(): void {
    if (this.hover()) this.close();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.close();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.close();
  }
}
