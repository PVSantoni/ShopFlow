<?php

namespace App\Panier\Application;

use App\Panier\Entity\Cart;

final readonly class CartViewFactory
{
    public function __construct(private CatalogueGateway $catalogue)
    {
    }

    /**
     * Les lignes dont le produit n'est plus disponible au catalogue sont ignorées (affichage et total).
     */
    public function create(?Cart $cart): CartView
    {
        if ($cart === null) {
            return new CartView(null, [], 0);
        }

        $ids = $cart->getItems()->map(static fn ($item) => $item->getProductId())->toArray();
        $products = $this->catalogue->findProducts($ids);

        $lines = [];
        $total = 0;
        foreach ($cart->getItems() as $item) {
            $product = $products[$item->getProductId()] ?? null;
            if ($product === null) {
                continue;
            }
            $lineTotal = $item->getUnitPriceCents() * $item->getQuantity();
            $total += $lineTotal;
            $lines[] = [
                'productId' => $item->getProductId(),
                'product' => $product,
                'quantity' => $item->getQuantity(),
                'unitPriceCents' => $item->getUnitPriceCents(),
                'lineTotalCents' => $lineTotal,
            ];
        }

        return new CartView($cart->getId()->toRfc4122(), $lines, $total);
    }
}
