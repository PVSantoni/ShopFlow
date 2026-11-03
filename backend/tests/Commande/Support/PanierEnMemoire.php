<?php

namespace App\Tests\Commande\Support;

use App\Commande\Application\Port\LignePanier;
use App\Commande\Application\Port\PanierReader;

final class PanierEnMemoire implements PanierReader
{
    /** @param array<string, list<LignePanier>> $paniers */
    public function __construct(private array $paniers = [])
    {
    }

    public function lignes(string $panierToken): array
    {
        return $this->paniers[$panierToken] ?? [];
    }
}
