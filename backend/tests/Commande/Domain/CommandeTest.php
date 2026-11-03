<?php

namespace App\Tests\Commande\Domain;

use App\Commande\Domain\Commande;
use App\Commande\Domain\Exception\LigneCommandeInvalideException;
use App\Commande\Domain\Exception\PanierVideException;
use App\Commande\Domain\Exception\TransitionStatutInvalideException;
use App\Commande\Domain\LigneCommande;
use App\Commande\Domain\StatutCommande;
use PHPUnit\Framework\TestCase;

final class CommandeTest extends TestCase
{
    public function testPasDeCommandeSiPanierVide(): void
    {
        $this->expectException(PanierVideException::class);

        Commande::passer('c1', [], new \DateTimeImmutable());
    }

    public function testLeTotalEstLaSommeDesLignes(): void
    {
        $commande = $this->commande(new LigneCommande(1, 'ESP32', 2, 990), new LigneCommande(2, 'Arduino', 1, 2490));

        self::assertSame(4470, $commande->totalCents());
    }

    public function testUneNouvelleCommandeAttendSonPaiement(): void
    {
        $commande = $this->commande(new LigneCommande(1, 'ESP32', 1, 990));

        self::assertSame(StatutCommande::EnAttentePaiement, $commande->statut());
        self::assertNull($commande->referencePaiement());
    }

    public function testMarquerPayeeEnregistreLaReference(): void
    {
        $commande = $this->commande(new LigneCommande(1, 'ESP32', 1, 990));

        $commande->marquerPayee('ref-42');

        self::assertSame(StatutCommande::Payee, $commande->statut());
        self::assertSame('ref-42', $commande->referencePaiement());
    }

    public function testUneCommandeDejaTraiteeNePeutPlusChangerDeStatut(): void
    {
        $commande = $this->commande(new LigneCommande(1, 'ESP32', 1, 990));
        $commande->marquerPaiementRefuse();

        $this->expectException(TransitionStatutInvalideException::class);

        $commande->marquerPayee('ref-42');
    }

    public function testUneLigneRefuseUneQuantiteNulle(): void
    {
        $this->expectException(LigneCommandeInvalideException::class);

        new LigneCommande(1, 'ESP32', 0, 990);
    }

    public function testUneLigneRefuseUnPrixNegatif(): void
    {
        $this->expectException(LigneCommandeInvalideException::class);

        new LigneCommande(1, 'ESP32', 1, -1);
    }

    private function commande(LigneCommande ...$lignes): Commande
    {
        return Commande::passer('c1', $lignes, new \DateTimeImmutable('2026-11-03 10:00:00'));
    }
}
