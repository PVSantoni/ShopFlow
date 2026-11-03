<?php

namespace App\Commande\Application;

use App\Commande\Application\Port\CommandeRepository;
use App\Commande\Application\Port\Horloge;
use App\Commande\Application\Port\LignePanier;
use App\Commande\Application\Port\PaiementGateway;
use App\Commande\Application\Port\PanierReader;
use App\Commande\Domain\Commande;
use App\Commande\Domain\LigneCommande;

final readonly class PasserCommandeHandler
{
    public function __construct(
        private CommandeRepository $commandes,
        private PanierReader $paniers,
        private PaiementGateway $paiement,
        private Horloge $horloge,
    ) {
    }

    /**
     * La commande est enregistrée avant le paiement, pour garder une trace d'un paiement refusé.
     *
     * @throws \App\Commande\Domain\Exception\PanierVideException
     */
    public function handle(string $panierToken): Commande
    {
        $lignes = array_map(
            static fn (LignePanier $l) => new LigneCommande($l->produitId, $l->nom, $l->quantite, $l->prixUnitaireCents),
            $this->paniers->lignes($panierToken),
        );

        $commande = Commande::passer($this->commandes->nextId(), $lignes, $this->horloge->maintenant());
        $this->commandes->save($commande);

        $resultat = $this->paiement->payer($commande->id(), $commande->totalCents());
        if ($resultat->accepte) {
            $commande->marquerPayee($resultat->reference);
        } else {
            $commande->marquerPaiementRefuse();
        }
        $this->commandes->save($commande);

        return $commande;
    }
}
