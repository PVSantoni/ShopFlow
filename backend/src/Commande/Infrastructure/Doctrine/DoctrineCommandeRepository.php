<?php

namespace App\Commande\Infrastructure\Doctrine;

use App\Commande\Application\Port\CommandeRepository;
use App\Commande\Domain\Commande;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;

final readonly class DoctrineCommandeRepository implements CommandeRepository
{
    public function __construct(private EntityManagerInterface $em)
    {
    }

    public function nextId(): string
    {
        return Uuid::v4()->toRfc4122();
    }

    public function save(Commande $commande): void
    {
        $this->em->persist($commande);
        $this->em->flush();
    }

    public function find(string $id): ?Commande
    {
        return $this->em->find(Commande::class, $id);
    }
}
