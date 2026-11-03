<?php

namespace App\Panier\Repository;

use App\Panier\Entity\Cart;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<Cart>
 */
class CartRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Cart::class);
    }

    /** Renvoie null si le token n'est pas un UUID valide ou n'existe pas. */
    public function findByToken(string $token): ?Cart
    {
        return Uuid::isValid($token) ? $this->find(Uuid::fromString($token)) : null;
    }

    public function save(Cart $cart): void
    {
        $em = $this->getEntityManager();
        $em->persist($cart);
        $em->flush();
    }
}
