<?php

namespace App\Panier\Application;

use App\Panier\Repository\CartRepository;

final readonly class GetCart
{
    public function __construct(private CartRepository $carts, private CartViewFactory $views)
    {
    }

    public function execute(?string $token): CartView
    {
        return $this->views->create($token === null ? null : $this->carts->findByToken($token));
    }
}
