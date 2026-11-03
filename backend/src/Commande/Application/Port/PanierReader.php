<?php

namespace App\Commande\Application\Port;

interface PanierReader
{
    /**
     * Renvoie une liste vide si le panier n'existe pas ou est vide.
     *
     * @return list<LignePanier>
     */
    public function lignes(string $panierToken): array;
}
