<?php

namespace App\Catalogue\Application;

use App\Catalogue\Repository\ProductRepository;
use App\Commande\Domain\Event\CommandePassee;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final class DecrementerStockHandler
{
    public function __construct(
        private ProductRepository $produits,
        private EntityManagerInterface $em,
    ) {
    }

    public function __invoke(CommandePassee $e): void
    {
        foreach ($e->lignes as $ligne) {
            $this->produits->find($ligne->produitId)?->decrementerStock($ligne->quantite);
        }

        $this->em->flush();
    }
}
