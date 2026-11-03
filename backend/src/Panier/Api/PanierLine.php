<?php

namespace App\Panier\Api;

/** Ligne de panier exposée aux autres modules (jamais l'entité). */
final readonly class PanierLine
{
    public function __construct(
        public int $productId,
        public string $name,
        public int $quantity,
        public int $unitPriceCents,
    ) {
    }
}
