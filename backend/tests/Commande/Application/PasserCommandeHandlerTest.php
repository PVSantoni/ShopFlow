<?php

namespace App\Tests\Commande\Application;

use App\Commande\Application\PasserCommandeHandler;
use App\Commande\Application\Port\LignePanier;
use App\Commande\Domain\Exception\PanierVideException;
use App\Commande\Domain\StatutCommande;
use App\Commande\Infrastructure\InMemory\InMemoryCommandeRepository;
use App\Tests\Commande\Support\HorlogeFixe;
use App\Tests\Commande\Support\PaiementFactice;
use App\Tests\Commande\Support\PanierEnMemoire;
use PHPUnit\Framework\TestCase;

final class PasserCommandeHandlerTest extends TestCase
{
    private InMemoryCommandeRepository $commandes;
    private \DateTimeImmutable $maintenant;

    protected function setUp(): void
    {
        $this->commandes = new InMemoryCommandeRepository();
        $this->maintenant = new \DateTimeImmutable('2026-11-03 10:00:00');
    }

    public function testPasDeCommandeSiLePanierEstVide(): void
    {
        $paiement = new PaiementFactice();

        try {
            $this->handler(new PanierEnMemoire(['t' => []]), $paiement)->handle('t');
            self::fail('PanierVideException attendue.');
        } catch (PanierVideException) {
            self::assertNull($this->commandes->find('commande-1'));
            self::assertSame([], $paiement->appels, 'Aucun paiement ne doit être tenté.');
        }
    }

    public function testUnPanierInconnuEstTraiteCommeVide(): void
    {
        $this->expectException(PanierVideException::class);

        $this->handler(new PanierEnMemoire(), new PaiementFactice())->handle('inconnu');
    }

    public function testPasserCommandeCreeUneCommandePayee(): void
    {
        $paiement = new PaiementFactice();

        $commande = $this->handler($this->panier(), $paiement)->handle('t');

        self::assertSame(StatutCommande::Payee, $commande->statut());
        self::assertSame(1980, $commande->totalCents());
        self::assertSame([['commande-1', 1980]], $paiement->appels);
        self::assertSame('ref-commande-1', $commande->referencePaiement());
        self::assertSame($commande, $this->commandes->find('commande-1'));
    }

    public function testLaDateDeCreationVientDeLHorloge(): void
    {
        $commande = $this->handler($this->panier(), new PaiementFactice())->handle('t');

        self::assertEquals($this->maintenant, $commande->creeeLe());
    }

    public function testUnPaiementRefuseConserveLaCommandeEnPaiementRefuse(): void
    {
        $commande = $this->handler($this->panier(), new PaiementFactice(accepte: false))->handle('t');

        self::assertSame(StatutCommande::PaiementRefuse, $commande->statut());
        self::assertNull($commande->referencePaiement());
        self::assertSame(StatutCommande::PaiementRefuse, $this->commandes->find($commande->id())?->statut());
    }

    private function panier(): PanierEnMemoire
    {
        return new PanierEnMemoire(['t' => [new LignePanier(2, 'ESP32', 2, 990)]]);
    }

    private function handler(PanierEnMemoire $panier, PaiementFactice $paiement): PasserCommandeHandler
    {
        return new PasserCommandeHandler($this->commandes, $panier, $paiement, new HorlogeFixe($this->maintenant));
    }
}
