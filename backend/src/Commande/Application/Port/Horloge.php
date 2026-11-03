<?php

namespace App\Commande\Application\Port;

interface Horloge
{
    public function maintenant(): \DateTimeImmutable;
}
