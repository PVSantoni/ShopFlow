<?php

namespace App\Message;

/** Contrat JSON publié par ShopFlow (routing key « commande.passee »). */
final readonly class CommandePassee
{
    /** @param list<array{produitId: int, nom: string, quantite: int, prixUnitaireCents: int}> $lignes */
    public function __construct(
        public string $id,
        public array $lignes,
        public \DateTimeImmutable $creeeLe,
    ) {
    }

    public function totalCents(): int
    {
        return array_sum(array_map(static fn (array $l) => $l['quantite'] * $l['prixUnitaireCents'], $this->lignes));
    }
}
