<?php

namespace Shah\Novus\Services;

use Shah\Novus\Contracts\LogoProvider;

class DefaultLogoProvider implements LogoProvider
{
    /**
     * Get the logo HTML for the application.
     */
    public function getLogo(bool $isDarkMode = true): string
    {
        $firstLetter = strtoupper(substr(config('app.name', 'Novus'), 0, 1));

        return '<div class="flex items-center justify-center gap-2">
            <div class="h-10 w-10 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                <span class="text-white dark:text-black font-bold text-2xl">'
                    .$firstLetter.
                '</span>
            </div>
        </div>';
    }
}
