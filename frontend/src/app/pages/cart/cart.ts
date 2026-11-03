import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  LucideArrowRight,
  LucideBookmark,
  LucideBookmarkPlus,
  LucideLock,
  LucideMinus,
  LucidePackage,
  LucidePlus,
  LucideShoppingCart,
  LucideTrash,
  LucideTriangleAlert,
} from '@lucide/angular';
import { Observable } from 'rxjs';
import { CartItem, Id } from '../../core/models';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { SavedItem, SavedItemsService } from '../../core/services/saved-items.service';
import { EuroPipe } from '../../shared/pipes/euro.pipe';
import { Button } from '../../ui/button/button';
import { Price } from '../../ui/price/price';

@Component({
  selector: 'app-cart',
  imports: [
    RouterLink,
    Button,
    EuroPipe,
    Price,
    LucideArrowRight,
    LucideBookmark,
    LucideBookmarkPlus,
    LucideLock,
    LucideMinus,
    LucidePackage,
    LucidePlus,
    LucideShoppingCart,
    LucideTrash,
    LucideTriangleAlert,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {
  private readonly cartService = inject(CartService);
  private readonly orders = inject(OrderService);
  private readonly router = inject(Router);
  protected readonly saved = inject(SavedItemsService);

  protected readonly cart = this.cartService.cart;
  protected readonly items = computed(() => this.cart()?.items ?? []);
  protected readonly count = this.cartService.count;

  /** Produits dont une requête est en cours : leurs boutons sont désactivés. */
  protected readonly busy = signal<ReadonlySet<Id>>(new Set());
  protected readonly error = signal('');
  protected readonly ordering = signal(false);

  /** Passe la commande : 201 -> page de confirmation ; 402/422 -> message, le panier est conservé. */
  protected placeOrder(): void {
    this.error.set('');
    this.ordering.set(true);
    this.orders.place().subscribe({
      next: () => {
        this.ordering.set(false);
        this.router.navigate(['/commande/confirmation']);
      },
      error: (e) => {
        this.ordering.set(false);
        this.error.set(
          e.status === 402
            ? 'Paiement refusé. Votre panier est conservé : modifiez-le ou réessayez.'
            : (e.error?.message ?? 'Impossible de passer la commande.'),
        );
      },
    });
  }

  protected changeQuantity(item: CartItem, quantity: number): void {
    this.run(item.productId, this.cartService.update(item.productId, quantity));
  }

  protected remove(item: CartItem): void {
    this.run(item.productId, this.cartService.update(item.productId, 0));
  }

  /** Sort la ligne du panier et la garde de côté. */
  protected saveForLater(item: CartItem): void {
    this.run(item.productId, this.cartService.update(item.productId, 0), () => this.saved.save(item));
  }

  protected moveToCart(item: SavedItem): void {
    this.run(item.productId, this.cartService.add(item.productId, item.quantity), () =>
      this.saved.remove(item.productId),
    );
  }

  private run(productId: Id, request: Observable<unknown>, onSuccess?: () => void): void {
    this.error.set('');
    this.busy.update((s) => new Set(s).add(productId));
    request.subscribe({
      next: () => {
        onSuccess?.();
        this.release(productId);
      },
      error: (e) => {
        this.error.set(e.error?.message ?? "Impossible de modifier le panier.");
        this.release(productId);
      },
    });
  }

  private release(productId: Id): void {
    this.busy.update((s) => {
      const next = new Set(s);
      next.delete(productId);
      return next;
    });
  }
}
