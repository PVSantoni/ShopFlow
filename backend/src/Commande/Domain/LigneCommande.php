<?php

namespace App\Commande\Domain;

use App\Commande\Domain\Exception\LigneCommandeInvalideException;

/** Photographie d'une ligne du panier au moment de la commande (nom et prix figés). */
final readonly class LigneCommande
{
    public function __construct(
        public int $produitId,
        public string $nom,
        public int $quantite,
        public int $prixUnitaireCents,
    ) {
        if ($quantite < 1) {
            throw new LigneCommandeInvalideException('La quantité d\'une ligne doit être supérieure ou égale à 1.');
        }
        if ($prixUnitaireCents < 0) {
            throw new LigneCommandeInvalideException('Le prix unitaire ne peut pas être négatif.');
        }
    }

    public function totalCents(): int
    {
        return $this->quantite * $this->prixUnitaireCents;
    }
}
