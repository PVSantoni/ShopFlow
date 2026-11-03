<?php

namespace App\Panier\Infrastructure;

use App\Catalogue\Api\CatalogueApi;
use App\Panier\Application\CatalogueGateway;
use App\Panier\Application\ProductInfo;

/** Adapter : traduit la façade du Catalogue vers le port du Panier. */
final readonly class CatalogueApiGateway implements CatalogueGateway
{
    public function __construct(private CatalogueApi $catalogue)
    {
    }

    public function findProduct(int $productId): ?ProductInfo
    {
        return $this->findProducts([$productId])[$productId] ?? null;
    }

    public function findProducts(array $productIds): array
    {
        return array_map(
            static fn ($p) => new ProductInfo($p->id, $p->name, $p->slug, $p->imageUrls, $p->priceCents, $p->stock),
            $this->catalogue->findProducts($productIds),
        );
    }
}
