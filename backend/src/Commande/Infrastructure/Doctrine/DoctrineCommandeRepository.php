<?php

namespace App\Commande\Infrastructure\Doctrine;

use App\Commande\Application\Port\CommandeRepository;
use App\Commande\Domain\Commande;
use App\Commande\Domain\LigneCommande;
use Doctrine\DBAL\Connection;
use Symfony\Component\Uid\Uuid;

/** Enregistre directement en SQL : le Domain n'a donc besoin d'aucun mapping Doctrine. */
final readonly class DoctrineCommandeRepository implements CommandeRepository
{
    public function __construct(private Connection $connection)
    {
    }

    public function nextId(): string
    {
        return Uuid::v4()->toRfc4122();
    }

    public function save(Commande $commande): void
    {
        $this->connection->insert('commande', [
            'id' => $commande->id(),
            'creee_le' => $commande->creeeLe()->format('Y-m-d H:i:s'),
            'lignes' => json_encode(array_map(static fn (LigneCommande $l) => [
                'produitId' => $l->produitId,
                'nom' => $l->nom,
                'quantite' => $l->quantite,
                'prixUnitaireCents' => $l->prixUnitaireCents,
            ], $commande->lignes()), JSON_THROW_ON_ERROR),
        ]);
    }
}
