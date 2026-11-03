<?php

namespace App\Catalogue\Api;

/** Vue en lecture seule d'un produit, exposée aux autres modules (jamais l'entité). */
final readonly class ProductSnapshot
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
