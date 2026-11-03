<?php

namespace App\Commande\Domain;

use App\Commande\Domain\Exception\PanierVideException;

final class Commande
{
    /** @param list<LigneCommande> $lignes */
    private function __construct(
        private readonly string $id,
        private readonly array $lignes,
        private readonly \DateTimeImmutable $creeeLe,
    ) {
    }

    /** @param list<LigneCommande> $lignes */
    public static function passer(string $id, array $lignes, \DateTimeImmutable $creeeLe): self
    {
        if ($lignes === []) {
            throw new PanierVideException();
        }

        return new self($id, array_values($lignes), $creeeLe);
    }

    public function totalCents(): int
    {
        return array_sum(array_map(static fn (LigneCommande $l) => $l->totalCents(), $this->lignes));
    }

    public function id(): string
    {
        return $this->id;
    }

    /** @return list<LigneCommande> */
    public function lignes(): array
    {
        return $this->lignes;
    }

    public function creeeLe(): \DateTimeImmutable
    {
        return $this->creeeLe;
    }
}
