<?php

namespace App\Catalogue\Controller;

use App\Catalogue\Application\GetProduct;
use App\Catalogue\Application\ProductSearchCriteria;
use App\Catalogue\Application\SearchProducts;
use App\Catalogue\Entity\Product;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class ProductController extends AbstractController
{
    private const MAX_PAGE_SIZE = 50;

    #[Route('/products', methods: ['GET'])]
    public function list(Request $request, SearchProducts $searchProducts): JsonResponse
    {
        $q = $request->query;
        $sort = $q->getString('sort', 'relevance');

        $criteria = new ProductSearchCriteria(
            query: trim($q->getString('q')) ?: null,
            categorySlug: $q->getString('category') ?: null,
            minPriceCents: $q->has('minPriceCents') ? max(0, $q->getInt('minPriceCents')) : null,
            maxPriceCents: $q->has('maxPriceCents') ? max(0, $q->getInt('maxPriceCents')) : null,
            inStockOnly: $q->getBoolean('inStockOnly'),
            sort: in_array($sort, ProductSearchCriteria::SORTS, true) ? $sort : 'relevance',
            page: max(1, $q->getInt('page', 1)),
            pageSize: min(self::MAX_PAGE_SIZE, max(1, $q->getInt('pageSize', 12))),
        );

        $result = $searchProducts->execute($criteria);

        return $this->json([
            'items' => array_map($this->toArray(...), $result['items']),
            'page' => $criteria->page,
            'pageSize' => $criteria->pageSize,
            'total' => $result['total'],
        ]);
    }

    #[Route('/products/{slug}', methods: ['GET'])]
    public function show(string $slug, GetProduct $getProduct): JsonResponse
    {
        $product = $getProduct->execute($slug);

        if ($product === null) {
            return $this->json(['status' => 404, 'message' => 'Produit introuvable.'], 404);
        }

        return $this->json($this->toArray($product));
    }

    /** Forme attendue par le modèle Product du front (core/models/product.model.ts). */
    private function toArray(Product $product): array
    {
        $category = $product->getCategory();

        return array_filter([
            'id' => $product->getId(),
            'sku' => $product->getSku(),
            'slug' => $product->getSlug(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'priceCents' => $product->getPriceCents(),
            'compareAtPriceCents' => $product->getCompareAtPriceCents(),
            'category' => ['id' => $category->getId(), 'name' => $category->getName(), 'slug' => $category->getSlug()],
            'imageUrls' => $product->getImageUrls(),
            'specs' => (object) $product->getSpecs(),
            'stock' => $product->getStock(),
            'averageRating' => 0,
            'reviewCount' => 0,
            'active' => $product->isActive(),
            'createdAt' => $product->getCreatedAt()->format(\DATE_ATOM),
        ], static fn ($value) => $value !== null);
    }
}
