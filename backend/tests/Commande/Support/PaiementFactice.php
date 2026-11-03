<?php

namespace App\Tests\Commande\Support;

use App\Commande\Application\Port\PaiementGateway;
use App\Commande\Application\Port\ResultatPaiement;

final class PaiementFactice implements PaiementGateway
{
    /** @var list<array{string, int}> */
    public array $appels = [];

    public function __construct(private readonly bool $accepte = true)
    {
    }

    public function payer(string $commandeId, int $montantCents): ResultatPaiement
    {
        $this->appels[] = [$commandeId, $montantCents];

        return $this->accepte ? ResultatPaiement::accepte('ref-' . $commandeId) : ResultatPaiement::refuse('Carte refusée');
    }
}
