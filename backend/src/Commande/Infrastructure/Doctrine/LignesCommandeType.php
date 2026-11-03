<?php

namespace App\Commande\Infrastructure\Doctrine;

use App\Commande\Domain\LigneCommande;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\JsonType;

/** Stocke les lignes d'une commande en JSON dans la colonne de la commande. */
final class LignesCommandeType extends JsonType
{
    public function convertToDatabaseValue(mixed $value, AbstractPlatform $platform): ?string
    {
        if ($value === null) {
            return null;
        }

        return parent::convertToDatabaseValue(array_map(static fn (LigneCommande $l) => [
            'produitId' => $l->produitId,
            'nom' => $l->nom,
            'quantite' => $l->quantite,
            'prixUnitaireCents' => $l->prixUnitaireCents,
        ], $value), $platform);
    }

    /** @return list<LigneCommande>|null */
    public function convertToPHPValue(mixed $value, AbstractPlatform $platform): ?array
    {
        $rows = parent::convertToPHPValue($value, $platform);
        if ($rows === null) {
            return null;
        }

        return array_map(
            static fn (array $r) => new LigneCommande($r['produitId'], $r['nom'], $r['quantite'], $r['prixUnitaireCents']),
            $rows,
        );
    }
}
