<?php

namespace App\Shared\Exception;

/** Erreur métier traduite en réponse JSON { status, message, fields? } (cf. ApiError côté front). */
abstract class ApiException extends \RuntimeException
{
    /** @param array<string, string> $fields */
    public function __construct(
        string $message,
        private readonly int $statusCode,
        private readonly array $fields = [],
    ) {
        parent::__construct($message);
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    /** @return array<string, string> */
    public function getFields(): array
    {
        return $this->fields;
    }
}
