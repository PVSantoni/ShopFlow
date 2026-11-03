<?php

namespace App\Catalogue\Api;

use App\Catalogue\Repository\ProductRepository;

/** Seul point d'entrée des autres modules vers le Catalogue. */
final readonly class CatalogueApi
{
    public function __construct(private ProductRepository $products)
    {
    }

    public function findProduct(int $productId): ?ProductSnapshot
    {
        return $this->findProducts([$productId])[$productId] ?? null;
    }

    /**
     * Seuls les produits actifs sont renvoyés.
     *
     * @param int[] $productIds
     *
     * @return array<int, ProductSnapshot> indexé par id produit
     */
    public function findProducts(array $productIds): array
    {
        $snapshots = [];
        foreach ($this->products->findActiveByIds($productIds) as $product) {
            $snapshots[$product->getId()] = new ProductSnapshot(
                $product->getId(),
                $product->getName(),
                $product->getSlug(),
                $product->getImageUrls(),
                $product->getPriceCents(),
                $product->getStock(),
            );
        }

        return $snapshots;
    }
}
