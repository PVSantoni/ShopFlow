<?php

namespace App\Panier\Api;

use App\Panier\Application\GetCart;

/** Seul point d'entrée des autres modules vers le Panier. */
final readonly class PanierApi
{
    public function __construct(private GetCart $getCart)
    {
    }

    /**
     * Vide si le token est inconnu ou si le panier est vide.
     *
     * @return list<PanierLine>
     */
    public function lines(string $token): array
    {
        return array_map(
            static fn (array $l) => new PanierLine($l['productId'], $l['product']->name, $l['quantity'], $l['unitPriceCents']),
            $this->getCart->execute($token)->lines,
        );
    }
}
