<?php

namespace App\Catalogue\Repository;

use App\Catalogue\Application\ProductSearchCriteria;
use App\Catalogue\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Product>
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    /** @return array{items: Product[], total: int} */
    public function search(ProductSearchCriteria $criteria): array
    {
        $qb = $this->createQueryBuilder('p')
            ->addSelect('c')
            ->join('p.category', 'c')
            ->andWhere('p.active = true');

        if ($criteria->query !== null) {
            $like = '%' . addcslashes($criteria->query, '%_\\') . '%';
            $qb->andWhere('p.name LIKE :q OR p.description LIKE :q OR p.sku LIKE :q')->setParameter('q', $like);
        }
        if ($criteria->categorySlug !== null) {
            $qb->andWhere('c.slug = :category')->setParameter('category', $criteria->categorySlug);
        }
        if ($criteria->minPriceCents !== null) {
            $qb->andWhere('p.priceCents >= :min')->setParameter('min', $criteria->minPriceCents);
        }
        if ($criteria->maxPriceCents !== null) {
            $qb->andWhere('p.priceCents <= :max')->setParameter('max', $criteria->maxPriceCents);
        }
        if ($criteria->inStockOnly) {
            $qb->andWhere('p.stock > 0');
        }

        // Pas d'avis dans le module Catalogue : "rating" retombe sur "newest".
        match ($criteria->sort) {
            'price_asc' => $qb->orderBy('p.priceCents', 'ASC'),
            'price_desc' => $qb->orderBy('p.priceCents', 'DESC'),
            'newest', 'rating' => $qb->orderBy('p.createdAt', 'DESC'),
            default => $qb->orderBy('p.name', 'ASC'),
        };
        $qb->addOrderBy('p.id', 'ASC')
            ->setFirstResult(($criteria->page - 1) * $criteria->pageSize)
            ->setMaxResults($criteria->pageSize);

        $paginator = new Paginator($qb);

        return ['items' => iterator_to_array($paginator), 'total' => count($paginator)];
    }

    public function findActiveBySlug(string $slug): ?Product
    {
        return $this->createQueryBuilder('p')
            ->addSelect('c')
            ->join('p.category', 'c')
            ->andWhere('p.slug = :slug')
            ->andWhere('p.active = true')
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param int[] $ids
     *
     * @return Product[]
     */
    public function findActiveByIds(array $ids): array
    {
        if ($ids === []) {
            return [];
        }

        return $this->createQueryBuilder('p')
            ->andWhere('p.id IN (:ids)')
            ->andWhere('p.active = true')
            ->setParameter('ids', $ids)
            ->getQuery()
            ->getResult();
    }
}
