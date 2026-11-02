import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-input',
  templateUrl: './input.html',
  styleUrl: './input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Input {
  readonly label = input.required<string>();
  readonly type = input<'text' | 'email' | 'password' | 'tel' | 'search'>('text');
  readonly multiline = input(false);
  readonly placeholder = input('');
  readonly hint = input('');
  readonly error = input('');
  readonly required = input(false);
  readonly value = model('');

  protected readonly id = `app-input-${nextId++}`;

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement | HTMLTextAreaElement).value);
  }
}
