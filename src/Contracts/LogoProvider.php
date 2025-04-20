<?php

namespace Shah\Novus\Contracts;

interface LogoProvider
{
    public function getLogo(bool $isDarkMode = true): string;
}
