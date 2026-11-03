<?php

namespace App\Commande\Application\Port;

/** Ce que Commande sait d'une ligne de panier. */
final readonly class LignePanier
{
    public function __construct(
        public int $produitId,
        public string $nom,
        public int $quantite,
        public int $prixUnitaireCents,
    ) {
    }
}
