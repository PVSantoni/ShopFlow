<?php

namespace App\Commande\Infrastructure\Horloge;

use App\Commande\Application\Port\Horloge;

final class SystemHorloge implements Horloge
{
    public function maintenant(): \DateTimeImmutable
    {
        return new \DateTimeImmutable();
    }
}
