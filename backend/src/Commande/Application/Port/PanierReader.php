<?php

namespace App\Commande\Application\Port;

use App\Commande\Domain\LigneCommande;

interface PanierReader
{
    /**
     * Liste vide si le panier est inconnu ou vide.
     *
     * @return list<LigneCommande>
     */
    public function lignes(string $panierToken): array;
}
