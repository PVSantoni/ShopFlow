<?php

namespace App\Panier\Application\Exception;

use App\Shared\Exception\ApiException;

final class InvalidQuantity extends ApiException
{
    public function __construct(string $message = 'Quantité invalide.')
    {
        parent::__construct($message, 422, ['quantity' => $message]);
    }
}
