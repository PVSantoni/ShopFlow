<?php

namespace App\Commande\Infrastructure\Paiement;

use App\Commande\Application\Port\PaiementGateway;

/** PSP sandbox simulé : aucun appel réseau, le paiement est toujours accepté. */
final class PspGateway implements PaiementGateway
{
    public function payer(string $commandeId, int $montantCents): void
    {
    }
}
