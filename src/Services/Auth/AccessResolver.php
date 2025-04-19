<?php

namespace Shah\Novus\Services\Auth;

use Illuminate\Contracts\Auth\Authenticatable;
use Shah\Novus\Contracts\Accessible;

class AccessResolver implements Accessible
{
    public function canAccess(?Authenticatable $user = null): bool
    {
        if (! $user) {
            return false;
        }

        return true;
    }
}
