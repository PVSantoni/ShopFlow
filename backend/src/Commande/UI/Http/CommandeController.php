<?php

namespace App\Commande\UI\Http;

use App\Commande\Application\PasserCommandeHandler;
use App\Commande\Domain\Commande;
use App\Commande\Domain\Exception\PanierVideException;
use App\Commande\Domain\LigneCommande;
use App\Commande\Domain\StatutCommande;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class CommandeController extends AbstractController
{
    #[Route('/orders', methods: ['POST'])]
    public function passer(Request $request, PasserCommandeHandler $handler): JsonResponse
    {
        try {
            $commande = $handler->handle((string) $request->headers->get('X-Cart-Token'));
        } catch (PanierVideException $e) {
            return $this->json(['status' => 422, 'message' => $e->getMessage()], 422);
        }

        if ($commande->statut() === StatutCommande::PaiementRefuse) {
            return $this->json(['status' => 402, 'message' => 'Paiement refusé.', 'order' => $this->toArray($commande)], 402);
        }

        return $this->json($this->toArray($commande), 201);
    }

    private function toArray(Commande $commande): array
    {
        return [
            'id' => $commande->id(),
            'status' => $commande->statut()->value,
            'totalCents' => $commande->totalCents(),
            'paymentReference' => $commande->referencePaiement(),
            'createdAt' => $commande->creeeLe()->format(\DATE_ATOM),
            'items' => array_map(static fn (LigneCommande $l) => [
                'productId' => $l->produitId,
                'name' => $l->nom,
                'quantity' => $l->quantite,
                'unitPriceCents' => $l->prixUnitaireCents,
                'lineTotalCents' => $l->totalCents(),
            ], $commande->lignes()),
        ];
    }
}
