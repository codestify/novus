<?php

namespace Shah\Novus\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \Shah\Novus\Novus
 */
class Novus extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \Shah\Novus\Novus::class;
    }
}
