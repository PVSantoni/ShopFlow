import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideDynamicIcon, LucideIcon, LucideMonitor, LucideMoon, LucideSun } from '@lucide/angular';
import { ThemeChoice, ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [LucideDynamicIcon],
  template: `
    <div class="toggle" role="radiogroup" aria-label="Thème">
      @for (o of options; track o.value) {
        <button
          type="button"
          role="radio"
          [attr.aria-checked]="theme.theme() === o.value"
          [class.is-active]="theme.theme() === o.value"
          (click)="theme.set(o.value)"
        >
          <svg [lucideIcon]="o.icon" [size]="16" aria-hidden="true"></svg>
          {{ o.label }}
        </button>
      }
    </div>
  `,
  styles: `
    .toggle { display: inline-flex; flex-direction: column; gap: 2px; }
    button {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.375rem 0.75rem; border: 1px solid transparent; border-radius: var(--radius-md);
      background: none; color: var(--color-header-muted); font: inherit; font-size: 0.875rem;
      text-align: left; cursor: pointer;
    }
    button:hover { background: rgb(255 255 255 / 0.1); }
    button.is-active { border-color: var(--color-accent); color: var(--color-header-text); font-weight: 600; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);

  protected readonly options: { value: ThemeChoice; label: string; icon: LucideIcon }[] = [
    { value: 'light', label: 'Clair', icon: LucideSun },
    { value: 'dark', label: 'Sombre', icon: LucideMoon },
    { value: 'system', label: 'Système', icon: LucideMonitor },
  ];
}
