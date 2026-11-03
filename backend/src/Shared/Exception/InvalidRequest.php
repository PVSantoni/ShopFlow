<?php

namespace App\Shared\Exception;

final class InvalidRequest extends ApiException
{
    /** @param array<string, string> $fields */
    public function __construct(array $fields, string $message = 'Requête invalide.')
    {
        parent::__construct($message, 422, $fields);
    }
}
