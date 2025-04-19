<?php

namespace Shah\Novus\Facades;

use Illuminate\Support\Facades\Facade;

class Assets extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'novus.assets';
    }
}
