import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideCircleCheck } from '@lucide/angular';
import { OrderService } from '../../core/services/order.service';
import { EuroPipe } from '../../shared/pipes/euro.pipe';
import { Button } from '../../ui/button/button';

@Component({
  selector: 'app-order-confirmation',
  imports: [RouterLink, Button, EuroPipe, LucideCircleCheck],
  template: `
    <div class="page">
      @if (order(); as o) {
        <section class="card">
          <svg lucideCircleCheck class="ok" [size]="56" [strokeWidth]="1.5"></svg>
          <h1>Merci, votre commande est confirmée</h1>
          <p class="muted">Paiement accepté. Un récapitulatif vous sera envoyé.</p>

          <dl class="meta">
            <div><dt>Commande</dt><dd>{{ o.id }}</dd></div>
            @if (o.paymentReference) {
              <div><dt>Référence de paiement</dt><dd>{{ o.paymentReference }}</dd></div>
            }
          </dl>

          <ul class="items">
            @for (i of o.items; track i.productId) {
              <li>
                <span>{{ i.name }} <small>× {{ i.quantity }}</small></span>
                <strong>{{ i.lineTotalCents | euro }}</strong>
              </li>
            }
          </ul>

          <p class="total"><span>Total payé</span> <strong>{{ o.totalCents | euro }}</strong></p>

          <a appButton variant="accent" routerLink="/catalogue">Continuer mes achats</a>
        </section>
      } @else {
        <section class="card">
          <h1>Aucune commande récente</h1>
          <p class="muted">Vous n'avez pas de commande à afficher.</p>
          <a appButton variant="accent" routerLink="/catalogue">Voir le catalogue</a>
        </section>
      }
    </div>
  `,
  styles: `
    :host { display: block; background: var(--color-canvas); }
    .page { max-width: 40rem; margin-inline: auto; padding: var(--space-8) var(--space-4) var(--space-16); }
    .card {
      display: grid; justify-items: center; gap: var(--space-3); padding: var(--space-8) var(--space-6);
      background: var(--color-bg); box-shadow: var(--shadow-1); border-radius: var(--radius-sm); text-align: center;
    }
    .ok { color: var(--color-success); }
    h1 { font-size: 1.5rem; letter-spacing: -0.02em; }
    .muted { color: var(--color-text-muted); }
    .meta { display: grid; gap: var(--space-1); width: 100%; margin: var(--space-2) 0 0; font-size: 0.875rem; }
    .meta div { display: flex; justify-content: space-between; gap: var(--space-3); }
    .meta dt { color: var(--color-text-muted); }
    .meta dd { margin: 0; font-weight: 600; word-break: break-all; text-align: right; }
    .items { display: grid; width: 100%; margin-top: var(--space-2); text-align: left; }
    .items li { display: flex; justify-content: space-between; gap: var(--space-3); padding: var(--space-2) 0; border-top: 1px solid var(--color-border); }
    .items small { color: var(--color-text-muted); }
    .total { display: flex; justify-content: space-between; width: 100%; padding-top: var(--space-3); border-top: 1px solid var(--color-border); font-size: 1.125rem; }
    a { margin-top: var(--space-3); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderConfirmation {
  protected readonly order = inject(OrderService).lastOrder;
}
