<?php

namespace App\Catalogue\Application;

use App\Catalogue\Entity\Product;
use App\Catalogue\Repository\ProductRepository;

final readonly class SearchProducts
{
    public function __construct(private ProductRepository $products)
    {
    }

    /** @return array{items: Product[], total: int} */
    public function execute(ProductSearchCriteria $criteria): array
    {
        return $this->products->search($criteria);
    }
}
