<?php

namespace App\Commande\Domain;

use App\Commande\Domain\Exception\PanierVideException;
use App\Commande\Domain\Exception\TransitionStatutInvalideException;

final class Commande
{
    private StatutCommande $statut = StatutCommande::EnAttentePaiement;
    private ?string $referencePaiement = null;

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

    public function marquerPayee(string $referencePaiement): void
    {
        $this->changerStatut(StatutCommande::Payee);
        $this->referencePaiement = $referencePaiement;
    }

    public function marquerPaiementRefuse(): void
    {
        $this->changerStatut(StatutCommande::PaiementRefuse);
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

    public function statut(): StatutCommande
    {
        return $this->statut;
    }

    public function referencePaiement(): ?string
    {
        return $this->referencePaiement;
    }

    public function creeeLe(): \DateTimeImmutable
    {
        return $this->creeeLe;
    }

    private function changerStatut(StatutCommande $cible): void
    {
        if ($this->statut !== StatutCommande::EnAttentePaiement) {
            throw new TransitionStatutInvalideException($this->statut, $cible);
        }
        $this->statut = $cible;
    }
}
