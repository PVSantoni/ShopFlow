<?php

namespace App\Messenger;

use App\Message\CommandePassee;
use Symfony\Component\Messenger\Envelope;
use Symfony\Component\Messenger\Exception\MessageDecodingFailedException;
use Symfony\Component\Messenger\Transport\Serialization\SerializerInterface;

/** Lit les événements JSON de ShopFlow ; cette application ne publie rien. */
final class JsonEventSerializer implements SerializerInterface
{
    public function decode(array $encodedEnvelope): Envelope
    {
        if (($encodedEnvelope['headers']['type'] ?? null) !== 'commande.passee') {
            throw new MessageDecodingFailedException('Type de message inconnu.');
        }

        try {
            $data = json_decode($encodedEnvelope['body'], true, flags: \JSON_THROW_ON_ERROR);

            return new Envelope(new CommandePassee($data['id'], $data['lignes'], new \DateTimeImmutable($data['creeeLe'])));
        } catch (\Throwable $e) {
            throw new MessageDecodingFailedException('Message invalide : '.$e->getMessage(), 0, $e);
        }
    }

    public function encode(Envelope $envelope): array
    {
        throw new \LogicException('shopflow-notification ne publie pas de messages.');
    }
}
