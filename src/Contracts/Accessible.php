<?php

namespace Shah\Novus\Contracts;

use Illuminate\Contracts\Auth\Authenticatable;

interface Accessible
{
    public function canAccess(?Authenticatable $user = null): bool;
}
