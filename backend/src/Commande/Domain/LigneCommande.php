<?php

namespace App\Commande\Domain;

/** Une ligne du panier au moment de la commande (nom et prix figés). */
final readonly class LigneCommande
{
    public function __construct(
        public int $produitId,
        public string $nom,
        public int $quantite,
        public int $prixUnitaireCents,
    ) {
    }

    public function totalCents(): int
    {
        return $this->quantite * $this->prixUnitaireCents;
    }
}
