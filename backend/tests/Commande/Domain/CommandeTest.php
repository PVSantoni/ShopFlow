<?php

namespace App\Tests\Commande\Domain;

use App\Commande\Domain\Commande;
use App\Commande\Domain\Exception\PanierVideException;
use App\Commande\Domain\LigneCommande;
use PHPUnit\Framework\TestCase;

final class CommandeTest extends TestCase
{
    public function testPasDeCommandeSiLePanierEstVide(): void
    {
        $this->expectException(PanierVideException::class);

        Commande::passer('c1', [], new \DateTimeImmutable());
    }

    public function testLeTotalAvecUneLigne(): void
    {
        $commande = Commande::passer('c1', [new LigneCommande(1, 'ESP32', 2, 990)], new \DateTimeImmutable());

        self::assertSame(1980, $commande->totalCents());
    }

    public function testLeTotalAvecPlusieursLignes(): void
    {
        $commande = Commande::passer('c1', [
            new LigneCommande(1, 'ESP32', 2, 990),
            new LigneCommande(2, 'Arduino', 1, 2490),
        ], new \DateTimeImmutable());

        self::assertSame(4470, $commande->totalCents());
    }

    public function testLaCommandeGardeSonIdentifiant(): void
    {
        $commande = Commande::passer('c1', [new LigneCommande(1, 'ESP32', 1, 990)], new \DateTimeImmutable());

        self::assertSame('c1', $commande->id());
    }

    public function testLaCommandeGardeSaDate(): void
    {
        $date = new \DateTimeImmutable('2026-11-03 10:00:00');

        $commande = Commande::passer('c1', [new LigneCommande(1, 'ESP32', 1, 990)], $date);

        self::assertSame($date, $commande->creeeLe());
    }
}
