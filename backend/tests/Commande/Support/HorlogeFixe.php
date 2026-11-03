<?php

namespace App\Tests\Commande\Support;

use App\Commande\Application\Port\Horloge;

final readonly class HorlogeFixe implements Horloge
{
    public function __construct(private \DateTimeImmutable $instant)
    {
    }

    public function maintenant(): \DateTimeImmutable
    {
        return $this->instant;
    }
}
