<?php

namespace App\Catalogue\Application;

use App\Catalogue\Entity\Product;
use App\Catalogue\Repository\ProductRepository;

final readonly class GetProduct
{
    public function __construct(private ProductRepository $products)
    {
    }

    public function execute(string $slug): ?Product
    {
        return $this->products->findActiveBySlug($slug);
    }
}
