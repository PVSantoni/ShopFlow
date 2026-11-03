<?php

namespace App\Catalogue\Entity;

use App\Catalogue\Repository\ProductRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
#[ORM\Index(columns: ['active', 'created_at'])]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50, unique: true)]
    private string $sku;

    #[ORM\Column(length: 150, unique: true)]
    private string $slug;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(type: Types::TEXT)]
    private string $description;

    /** Montants en centimes, comme côté front. */
    #[ORM\Column]
    private int $priceCents;

    /** Prix barré, renseigné uniquement si le produit est en promotion. */
    #[ORM\Column(nullable: true)]
    private ?int $compareAtPriceCents = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private Category $category;

    /** @var string[] */
    #[ORM\Column(type: Types::JSON)]
    private array $imageUrls = [];

    /** @var array<string, string> */
    #[ORM\Column(type: Types::JSON)]
    private array $specs = [];

    #[ORM\Column]
    private int $stock;

    #[ORM\Column]
    private bool $active = true;

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    /**
     * @param string[]              $imageUrls
     * @param array<string, string> $specs
     */
    public function __construct(
        string $sku,
        string $slug,
        string $name,
        string $description,
        int $priceCents,
        Category $category,
        int $stock,
        ?int $compareAtPriceCents = null,
        array $imageUrls = [],
        array $specs = [],
    ) {
        $this->sku = $sku;
        $this->slug = $slug;
        $this->name = $name;
        $this->description = $description;
        $this->priceCents = $priceCents;
        $this->category = $category;
        $this->stock = $stock;
        $this->compareAtPriceCents = $compareAtPriceCents;
        $this->imageUrls = $imageUrls;
        $this->specs = $specs;
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSku(): string
    {
        return $this->sku;
    }

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getPriceCents(): int
    {
        return $this->priceCents;
    }

    public function getCompareAtPriceCents(): ?int
    {
        return $this->compareAtPriceCents;
    }

    public function getCategory(): Category
    {
        return $this->category;
    }

    /** @return string[] */
    public function getImageUrls(): array
    {
        return $this->imageUrls;
    }

    /** @return array<string, string> */
    public function getSpecs(): array
    {
        return $this->specs;
    }

    public function getStock(): int
    {
        return $this->stock;
    }

    public function isActive(): bool
    {
        return $this->active;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
