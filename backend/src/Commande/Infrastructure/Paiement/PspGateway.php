<?php

namespace App\Commande\Infrastructure\Paiement;

use App\Commande\Application\Port\PaiementGateway;
use App\Commande\Application\Port\ResultatPaiement;

/**
 * PSP sandbox simulé : aucun appel réseau. Refuse tout montant supérieur au plafond,
 * ce qui permet de tester le parcours "paiement refusé" avec un gros panier.
 */
final class PspGateway implements PaiementGateway
{
    public const PLAFOND_CENTS = 100_000;

    public function payer(string $commandeId, int $montantCents): ResultatPaiement
    {
        if ($montantCents > self::PLAFOND_CENTS) {
            return ResultatPaiement::refuse('Plafond du sandbox dépassé (1000 €).');
        }

        return ResultatPaiement::accepte('sandbox_' . substr(sha1($commandeId . $montantCents), 0, 12));
    }
}
