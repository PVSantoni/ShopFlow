<?php

namespace App\Commande\Application\Port;

final readonly class ResultatPaiement
{
    private function __construct(
        public bool $accepte,
        public ?string $reference,
        public ?string $motifRefus,
    ) {
    }

    public static function accepte(string $reference): self
    {
        return new self(true, $reference, null);
    }

    public static function refuse(string $motif): self
    {
        return new self(false, null, $motif);
    }
}
