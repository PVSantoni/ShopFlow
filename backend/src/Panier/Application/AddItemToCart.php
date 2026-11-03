<?php

namespace App\Panier\Application;

use App\Panier\Application\Exception\InsufficientStock;
use App\Panier\Application\Exception\InvalidQuantity;
use App\Panier\Application\Exception\ProductNotAvailable;
use App\Panier\Entity\Cart;
use App\Panier\Entity\CartItem;
use App\Panier\Repository\CartRepository;

final readonly class AddItemToCart
{
    public function __construct(
        private CartRepository $carts,
        private CatalogueGateway $catalogue,
        private CartViewFactory $views,
    ) {
    }

    /** Crée le panier si le token est absent ou inconnu. */
    public function execute(?string $token, int $productId, int $quantity): CartView
    {
        if ($quantity < 1) {
            throw new InvalidQuantity('La quantité doit être supérieure ou égale à 1.');
        }

        $product = $this->catalogue->findProduct($productId) ?? throw new ProductNotAvailable();

        $cart = ($token === null ? null : $this->carts->findByToken($token)) ?? new Cart();
        $item = $this->findItem($cart, $productId);

        $newQuantity = ($item?->getQuantity() ?? 0) + $quantity;
        if ($newQuantity > $product->stock) {
            throw new InsufficientStock($product->stock);
        }

        if ($item === null) {
            $cart->getItems()->add(new CartItem($cart, $productId, $newQuantity, $product->priceCents));
        } else {
            $item->setQuantity($newQuantity);
        }
        $cart->touch();
        $this->carts->save($cart);

        return $this->views->create($cart);
    }

    private function findItem(Cart $cart, int $productId): ?CartItem
    {
        foreach ($cart->getItems() as $item) {
            if ($item->getProductId() === $productId) {
                return $item;
            }
        }

        return null;
    }
}
