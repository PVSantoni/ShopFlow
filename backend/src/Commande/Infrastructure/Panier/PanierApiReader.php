<?php

namespace App\Commande\Infrastructure\Panier;

use App\Commande\Application\Port\PanierReader;
use App\Commande\Domain\LigneCommande;
use App\Panier\Api\PanierApi;

/** Adaptateur : lit le panier via la façade du module Panier. */
final readonly class PanierApiReader implements PanierReader
{
    public function __construct(private PanierApi $panier)
    {
    }

    public function lignes(string $panierToken): array
    {
        return array_map(
            static fn ($l) => new LigneCommande($l->productId, $l->name, $l->quantity, $l->unitPriceCents),
            $this->panier->lines($panierToken),
        );
    }
}
