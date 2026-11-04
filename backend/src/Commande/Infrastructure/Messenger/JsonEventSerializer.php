<?php

namespace App\Commande\Infrastructure\Messenger;

use App\Commande\Domain\Event\CommandePassee;
use App\Commande\Domain\LigneCommande;
use Symfony\Component\Messenger\Envelope;
use Symfony\Component\Messenger\Exception\MessageDecodingFailedException;
use Symfony\Component\Messenger\Transport\Serialization\SerializerInterface;

/**
 * Publie les événements en JSON plutôt qu'en serialize() PHP : les autres applications
 * (ex. shopflow-notification) lisent le contrat JSON sans connaître nos classes.
 */
final class JsonEventSerializer implements SerializerInterface
{
    private const TYPE_COMMANDE_PASSEE = 'commande.passee';

    public function encode(Envelope $envelope): array
    {
        $message = $envelope->getMessage();
        if (!$message instanceof CommandePassee) {
            throw new \LogicException(sprintf('Message non supporté : %s', $message::class));
        }

        return [
            'body' => json_encode([
                'id' => $message->id,
                'creeeLe' => $message->creeeLe->format(\DATE_ATOM),
                'lignes' => array_map(static fn (LigneCommande $l) => [
                    'produitId' => $l->produitId,
                    'nom' => $l->nom,
                    'quantite' => $l->quantite,
                    'prixUnitaireCents' => $l->prixUnitaireCents,
                ], $message->lignes),
            ], \JSON_THROW_ON_ERROR),
            'headers' => ['type' => self::TYPE_COMMANDE_PASSEE, 'Content-Type' => 'application/json'],
        ];
    }

    public function decode(array $encodedEnvelope): Envelope
    {
        if (($encodedEnvelope['headers']['type'] ?? null) !== self::TYPE_COMMANDE_PASSEE) {
            throw new MessageDecodingFailedException('Type de message inconnu.');
        }

        try {
            $data = json_decode($encodedEnvelope['body'], true, flags: \JSON_THROW_ON_ERROR);

            return new Envelope(new CommandePassee(
                $data['id'],
                array_map(static fn (array $l) => new LigneCommande($l['produitId'], $l['nom'], $l['quantite'], $l['prixUnitaireCents']), $data['lignes']),
                new \DateTimeImmutable($data['creeeLe']),
            ));
        } catch (\Throwable $e) {
            throw new MessageDecodingFailedException('Message invalide : '.$e->getMessage(), 0, $e);
        }
    }
}
