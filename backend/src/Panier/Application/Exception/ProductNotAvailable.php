<?php

namespace App\Panier\Application\Exception;

use App\Shared\Exception\ApiException;

final class ProductNotAvailable extends ApiException
{
    public function __construct()
    {
        parent::__construct('Ce produit n\'est pas disponible.', 404);
    }
}
