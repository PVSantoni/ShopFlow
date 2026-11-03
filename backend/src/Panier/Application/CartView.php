<?php

namespace App\Panier\Application;

/** Représentation du panier prête à être exposée (forme du modèle Cart du front). */
final readonly class CartView
{
    /**
     * @param list<array{productId: int, product: ProductInfo, quantity: int, unitPriceCents: int, lineTotalCents: int}> $lines
     */
    public function __construct(
        public ?string $id,
        public array $lines,
        public int $totalCents,
    ) {
    }
}
