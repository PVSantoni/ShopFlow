<?php

namespace App\Panier\Application;

/** Port : le Panier ne connaît le Catalogue que par cette interface. */
interface CatalogueGateway
{
    public function findProduct(int $productId): ?ProductInfo;

    /**
     * @param int[] $productIds
     *
     * @return array<int, ProductInfo> indexé par id produit
     */
    public function findProducts(array $productIds): array;
}
