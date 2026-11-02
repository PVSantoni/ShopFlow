import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Button } from '../../ui/button/button';
import { Input } from '../../ui/input/input';
import { PageShell } from '../../ui/page-shell/page-shell';

@Component({
  selector: 'app-contact',
  imports: [PageShell, Input, Button],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly subject = signal('');
  protected readonly message = signal('');
  protected readonly submitted = signal(false);
  protected readonly sent = signal(false);

  protected readonly errors = computed(() => ({
    name: this.name().trim() ? '' : 'Indiquez votre nom.',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email()) ? '' : 'Adresse e-mail invalide.',
    message: this.message().trim().length >= 10 ? '' : 'Votre message doit faire au moins 10 caractères.',
  }));

  protected readonly valid = computed(() => Object.values(this.errors()).every((e) => !e));

  protected submit(): void {
    this.submitted.set(true);
    if (this.valid()) this.sent.set(true);
  }
}
