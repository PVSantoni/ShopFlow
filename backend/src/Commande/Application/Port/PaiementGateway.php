<?php

namespace App\Commande\Application\Port;

interface PaiementGateway
{
    public function payer(string $commandeId, int $montantCents): void;
}
