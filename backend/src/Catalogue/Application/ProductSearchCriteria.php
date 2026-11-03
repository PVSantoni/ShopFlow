<?php

namespace App\Catalogue\Application;

final readonly class ProductSearchCriteria
{
    public const SORTS = ['relevance', 'price_asc', 'price_desc', 'newest', 'rating'];

    public function __construct(
        public ?string $query = null,
        public ?string $categorySlug = null,
        public ?int $minPriceCents = null,
        public ?int $maxPriceCents = null,
        public bool $inStockOnly = false,
        public string $sort = 'relevance',
        public int $page = 1,
        public int $pageSize = 12,
    ) {
    }
}
