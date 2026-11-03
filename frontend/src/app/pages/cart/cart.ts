import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Button } from '../../ui/button/button';
import { PageShell } from '../../ui/page-shell/page-shell';
import { Price } from '../../ui/price/price';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, Button, PageShell, Price],
  template: `
    <app-page-shell title="Mon panier">
      @let items = cart.cart()?.items ?? [];
      @if (items.length === 0) {
        <p class="empty">Votre panier est vide.</p>
        <a appButton variant="accent" routerLink="/">Continuer mes achats</a>
      } @else {
        <ul class="lines">
          @for (item of items; track item.productId) {
            <li class="line">
              <div class="line__info">
                <strong>{{ item.product.name }}</strong>
                <app-price [value]="item.unitPriceCents / 100" />
              </div>
              <div class="line__qty">
                <button appButton variant="ghost" size="sm" type="button" aria-label="Diminuer" (click)="change(item.productId, item.quantity - 1)">−</button>
                <span>{{ item.quantity }}</span>
                <button appButton variant="ghost" size="sm" type="button" aria-label="Augmenter" [disabled]="item.quantity >= item.product.stock" (click)="change(item.productId, item.quantity + 1)">+</button>
              </div>
              <app-price class="line__total" [value]="item.lineTotalCents / 100" />
              <button appButton variant="ghost" size="sm" type="button" (click)="change(item.productId, 0)">Retirer</button>
            </li>
          }
        </ul>
        <p class="total">Total : <app-price [value]="(cart.cart()?.totalCents ?? 0) / 100" /></p>
      }
    </app-page-shell>
  `,
  styles: `
    .empty { margin-bottom: var(--space-4); color: var(--color-text-muted); }
    .lines { list-style: none; padding: 0; border-top: 1px solid var(--color-border); }
    .line { display: grid; grid-template-columns: 1fr auto auto auto; align-items: center; gap: var(--space-4); padding: var(--space-4) 0; border-bottom: 1px solid var(--color-border); }
    .line__info { display: grid; gap: var(--space-1); }
    .line__qty { display: flex; align-items: center; gap: var(--space-2); }
    .total { display: flex; justify-content: flex-end; align-items: baseline; gap: var(--space-3); margin-top: var(--space-6); font-size: 1.25rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {
  protected readonly cart = inject(CartService);

  protected change(productId: number, quantity: number): void {
    this.cart.update(productId, quantity).subscribe({
      error: (e) => alert(e.error?.message ?? 'Impossible de modifier le panier.'),
    });
  }
}
