<?php

namespace App\Commande\Domain\Exception;

use App\Commande\Domain\StatutCommande;

final class TransitionStatutInvalideException extends \DomainException
{
    public function __construct(StatutCommande $actuel, StatutCommande $cible)
    {
        parent::__construct(sprintf('Transition impossible : %s → %s.', $actuel->value, $cible->value));
    }
}
