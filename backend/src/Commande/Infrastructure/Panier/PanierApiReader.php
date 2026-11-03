<?php

namespace App\Commande\Infrastructure\Panier;

use App\Commande\Application\Port\LignePanier;
use App\Commande\Application\Port\PanierReader;
use App\Panier\Api\PanierApi;

/** Adaptateur : traduit la façade du Panier vers le port de Commande. */
final readonly class PanierApiReader implements PanierReader
{
    public function __construct(private PanierApi $panier)
    {
    }

    public function lignes(string $panierToken): array
    {
        return array_map(
            static fn ($l) => new LignePanier($l->productId, $l->name, $l->quantity, $l->unitPriceCents),
            $this->panier->lines($panierToken),
        );
    }
}
