<?php

namespace App\Panier\Application;

use App\Panier\Application\Exception\CartItemNotFound;
use App\Panier\Application\Exception\InsufficientStock;
use App\Panier\Application\Exception\InvalidQuantity;
use App\Panier\Application\Exception\ProductNotAvailable;
use App\Panier\Repository\CartRepository;

final readonly class UpdateCartItem
{
    public function __construct(
        private CartRepository $carts,
        private CatalogueGateway $catalogue,
        private CartViewFactory $views,
    ) {
    }

    /** Remplace la quantité de la ligne ; 0 retire la ligne. */
    public function execute(?string $token, int $productId, int $quantity): CartView
    {
        if ($quantity < 0) {
            throw new InvalidQuantity('La quantité ne peut pas être négative.');
        }

        $cart = ($token === null ? null : $this->carts->findByToken($token)) ?? throw new CartItemNotFound();

        $item = null;
        foreach ($cart->getItems() as $candidate) {
            if ($candidate->getProductId() === $productId) {
                $item = $candidate;
                break;
            }
        }
        $item ?? throw new CartItemNotFound();

        if ($quantity === 0) {
            $cart->getItems()->removeElement($item);
        } else {
            $product = $this->catalogue->findProduct($productId) ?? throw new ProductNotAvailable();
            if ($quantity > $product->stock) {
                throw new InsufficientStock($product->stock);
            }
            $item->setQuantity($quantity);
        }
        $cart->touch();
        $this->carts->save($cart);

        return $this->views->create($cart);
    }
}
