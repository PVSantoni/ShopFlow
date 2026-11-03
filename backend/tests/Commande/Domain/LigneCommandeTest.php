<?php

namespace App\Tests\Commande\Domain;

use App\Commande\Domain\LigneCommande;
use PHPUnit\Framework\TestCase;

final class LigneCommandeTest extends TestCase
{
    public function testLeTotalDUneLigneEstQuantiteFoisPrix(): void
    {
        $ligne = new LigneCommande(1, 'ESP32', 3, 990);

        self::assertSame(2970, $ligne->totalCents());
    }

    public function testLeTotalDUneLigneDUneSeuleUnite(): void
    {
        $ligne = new LigneCommande(1, 'ESP32', 1, 990);

        self::assertSame(990, $ligne->totalCents());
    }
}
