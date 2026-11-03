<?php

namespace App\Panier\Application;

/** Ce que le Panier sait d'un produit : une copie en lecture seule fournie par le Catalogue. */
final readonly class ProductInfo
{
    /** @param string[] $imageUrls */
    public function __construct(
        public int $id,
        public string $name,
        public string $slug,
        public array $imageUrls,
        public int $priceCents,
        public int $stock,
    ) {
    }
}
