<?php

namespace App\Commande\Domain\Event;

use App\Commande\Domain\Commande;
use App\Commande\Domain\LigneCommande;

final class CommandePassee
{
    /** @param list<LigneCommande> $lignes */
    public function __construct(
        public readonly string $id,
        public readonly array $lignes,
        public readonly \DateTimeImmutable $creeeLe,
    ) {
    }
}
