<?php

namespace App\Panier\Application\Exception;

use App\Shared\Exception\ApiException;

final class InsufficientStock extends ApiException
{
    public function __construct(int $available)
    {
        parent::__construct(
            $available > 0 ? sprintf('Stock insuffisant : %d disponible(s).', $available) : 'Produit en rupture de stock.',
            409,
            ['quantity' => (string) $available],
        );
    }
}
