<?php

namespace App\Commande\Application\Port;

use App\Commande\Domain\Commande;

interface CommandeRepository
{
    public function nextId(): string;

    public function save(Commande $commande): void;

    public function find(string $id): ?Commande;
}
