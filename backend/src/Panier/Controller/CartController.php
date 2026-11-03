<?php

namespace App\Panier\Controller;

use App\Panier\Application\AddItemToCart;
use App\Panier\Application\CartView;
use App\Panier\Application\GetCart;
use App\Panier\Application\UpdateCartItem;
use App\Shared\Exception\InvalidRequest;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class CartController extends AbstractController
{
    private const TOKEN_HEADER = 'X-Cart-Token';

    #[Route('/cart', methods: ['GET'])]
    public function show(Request $request, GetCart $getCart): JsonResponse
    {
        return $this->respond($getCart->execute($this->token($request)));
    }

    #[Route('/cart/items', methods: ['POST'])]
    public function add(Request $request, AddItemToCart $addItem): JsonResponse
    {
        [$productId, $quantity] = $this->parseBody($request);

        return $this->respond($addItem->execute($this->token($request), $productId, $quantity), 201);
    }

    #[Route('/cart/items/{productId}', requirements: ['productId' => '\d+'], methods: ['PATCH'])]
    public function update(int $productId, Request $request, UpdateCartItem $updateItem): JsonResponse
    {
        $quantity = $this->parseBody($request, requireProductId: false)[1];

        return $this->respond($updateItem->execute($this->token($request), $productId, $quantity));
    }

    private function token(Request $request): ?string
    {
        return $request->headers->get(self::TOKEN_HEADER) ?: null;
    }

    /** @return array{int, int} [productId, quantity] */
    private function parseBody(Request $request, bool $requireProductId = true): array
    {
        $body = json_decode($request->getContent(), true);
        $body = is_array($body) ? $body : [];

        $errors = [];
        if ($requireProductId && !is_int($body['productId'] ?? null)) {
            $errors['productId'] = 'Identifiant produit invalide.';
        }
        if (!is_int($body['quantity'] ?? null)) {
            $errors['quantity'] = 'La quantité doit être un entier.';
        }
        if ($errors !== []) {
            throw new InvalidRequest($errors);
        }

        return [$body['productId'] ?? 0, $body['quantity']];
    }

    private function respond(CartView $cart, int $status = 200): JsonResponse
    {
        $response = $this->json([
            'id' => $cart->id,
            'items' => array_map(static fn (array $l) => [
                'productId' => $l['productId'],
                'product' => [
                    'id' => $l['product']->id,
                    'name' => $l['product']->name,
                    'slug' => $l['product']->slug,
                    'imageUrls' => $l['product']->imageUrls,
                    'stock' => $l['product']->stock,
                ],
                'quantity' => $l['quantity'],
                'unitPriceCents' => $l['unitPriceCents'],
                'lineTotalCents' => $l['lineTotalCents'],
            ], $cart->lines),
            'subtotalCents' => $cart->totalCents,
            'discountCents' => 0,
            'totalCents' => $cart->totalCents,
        ], $status);

        if ($cart->id !== null) {
            $response->headers->set(self::TOKEN_HEADER, $cart->id);
        }

        return $response;
    }
}
