<?php

namespace App\Shared\EventListener;

use App\Shared\Exception\ApiException;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;

#[AsEventListener]
final class ApiExceptionListener
{
    public function __invoke(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        if (!$exception instanceof ApiException) {
            return;
        }

        $body = ['status' => $exception->getStatusCode(), 'message' => $exception->getMessage()];
        if ($exception->getFields() !== []) {
            $body['fields'] = $exception->getFields();
        }

        $event->setResponse(new JsonResponse($body, $exception->getStatusCode()));
    }
}
