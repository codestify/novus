<?php

namespace Shah\Novus\Exceptions;

use Exception;

class GoogleAnalyticsException extends Exception
{
    public static function because(string $reason): self
    {
        return new static($reason);
    }
}
