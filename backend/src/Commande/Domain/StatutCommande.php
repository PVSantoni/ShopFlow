<?php

namespace App\Commande\Domain;

enum StatutCommande: string
{
    case EnAttentePaiement = 'en_attente_paiement';
    case Payee = 'payee';
    case PaiementRefuse = 'paiement_refuse';
}
