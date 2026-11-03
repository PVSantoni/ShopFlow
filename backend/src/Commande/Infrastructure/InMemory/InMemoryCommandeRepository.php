<?php

namespace App\Commande\Infrastructure\InMemory;

use App\Commande\Application\Port\CommandeRepository;
use App\Commande\Domain\Commande;

/** Adaptateur pour les tests : aucune base de données. */
final class InMemoryCommandeRepository implements CommandeRepository
{
    /** @var array<string, Commande> */
    private array $commandes = [];
    private int $sequence = 0;

    public function nextId(): string
    {
        return 'commande-' . ++$this->sequence;
    }

    public function save(Commande $commande): void
    {
        $this->commandes[$commande->id()] = $commande;
    }

    public function find(string $id): ?Commande
    {
        return $this->commandes[$id] ?? null;
    }
}
