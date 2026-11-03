<?php

namespace App\Commande\Application;

use App\Commande\Application\Port\CommandeRepository;
use App\Commande\Application\Port\Horloge;
use App\Commande\Application\Port\PaiementGateway;
use App\Commande\Application\Port\PanierReader;
use App\Commande\Domain\Commande;
use App\Commande\Domain\Event\CommandePassee;
use Symfony\Component\Messenger\MessageBusInterface;

final readonly class PasserCommandeHandler
{
    public function __construct(
        private CommandeRepository $commandes,
        private PanierReader $paniers,
        private PaiementGateway $paiement,
        private Horloge $horloge,
        private MessageBusInterface $bus,
    ) {
    }

    /** @throws \App\Commande\Domain\Exception\PanierVideException */
    public function handle(string $panierToken): Commande
    {
        $commande = Commande::passer(
            $this->commandes->nextId(),
            $this->paniers->lignes($panierToken),
            $this->horloge->maintenant(),
        );

        $this->paiement->payer($commande->id(), $commande->totalCents());
        $this->commandes->save($commande);

        $this->bus->dispatch(new CommandePassee(
            $commande->id(),
            $commande->lignes(),
            $commande->creeeLe(),
        ));

        return $commande;
    }
}
