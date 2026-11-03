<?php

namespace App\Panier\Entity;

use App\Panier\Repository\CartItemRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CartItemRepository::class)]
#[ORM\UniqueConstraint(columns: ['cart_id', 'product_id'])]
class CartItem
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'items')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private Cart $cart;

    /** Simple identifiant : le module Panier ne connaît pas l'entité Product du Catalogue. */
    #[ORM\Column]
    private int $productId;

    #[ORM\Column]
    private int $quantity;

    /** Prix unitaire en centimes au moment de l'ajout. */
    #[ORM\Column]
    private int $unitPriceCents;

    public function __construct(Cart $cart, int $productId, int $quantity, int $unitPriceCents)
    {
        $this->cart = $cart;
        $this->productId = $productId;
        $this->quantity = $quantity;
        $this->unitPriceCents = $unitPriceCents;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCart(): Cart
    {
        return $this->cart;
    }

    public function getProductId(): int
    {
        return $this->productId;
    }

    public function getQuantity(): int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): void
    {
        $this->quantity = $quantity;
    }

    public function getUnitPriceCents(): int
    {
        return $this->unitPriceCents;
    }
}
