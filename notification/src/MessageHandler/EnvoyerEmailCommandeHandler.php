<?php

namespace App\MessageHandler;

use App\Message\CommandePassee;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Mime\Email;

#[AsMessageHandler]
final readonly class EnvoyerEmailCommandeHandler
{
    public function __construct(
        private MailerInterface $mailer,
        #[Autowire('%env(NOTIFICATION_FROM)%')] private string $from,
        // L'événement ne porte pas l'email du client (pas de compte client) : destinataire de démo.
        #[Autowire('%env(NOTIFICATION_TO)%')] private string $to,
    ) {
    }

    public function __invoke(CommandePassee $commande): void
    {
        $lignes = array_map(
            static fn (array $l) => sprintf('- %d x %s : %.2f €', $l['quantite'], $l['nom'], $l['quantite'] * $l['prixUnitaireCents'] / 100),
            $commande->lignes,
        );

        $this->mailer->send((new Email())
            ->from($this->from)
            ->to($this->to)
            ->subject(sprintf('Confirmation de votre commande %s', $commande->id))
            ->text(implode("\n", [
                'Merci pour votre commande !',
                '',
                ...$lignes,
                '',
                sprintf('Total : %.2f €', $commande->totalCents() / 100),
            ])));
    }
}
