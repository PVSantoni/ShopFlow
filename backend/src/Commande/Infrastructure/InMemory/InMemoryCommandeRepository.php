<?php

namespace App\Commande\Infrastructure\InMemory;

use App\Commande\Application\Port\CommandeRepository;
use App\Commande\Domain\Commande;

/** Adaptateur pour les tests : aucune base de données. */
final class InMemoryCommandeRepository implements CommandeRepository
{
    /** @var list<Commande> */
    private array $commandes = [];

    public function nextId(): string
    {
        return 'commande-' . (count($this->commandes) + 1);
    }

    public function save(Commande $commande): void
    {
        $this->commandes[] = $commande;
    }

    /** @return list<Commande> */
    public function toutes(): array
    {
        return $this->commandes;
    }
}
