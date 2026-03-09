<?php

namespace Shah\Novus\Services;

use Shah\Novus\Contracts\LogoProvider;

class DefaultLogoProvider implements LogoProvider
{
    public function getLogo(): string
    {
        $firstLetter = strtoupper(substr(config('app.name', 'Novus'), 0, 1));

        return '<div class="flex items-center gap-2">
            <div class="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                <span class="text-primary font-bold text-lg">'.$firstLetter.'</span>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">'.e(config('app.name', 'Novus')).'</span>
        </div>';
    }
}
