<?php

namespace App\Commande\Domain\Exception;

final class PanierVideException extends \DomainException
{
    public function __construct()
    {
        parent::__construct('Impossible de passer commande avec un panier vide.');
    }
}
