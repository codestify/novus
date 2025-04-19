<?php

namespace Shah\Novus\Contracts;

interface Reportable
{
    /**
     * Check if analytics service is properly configured
     */
    public function isConfigured(): bool;

    /**
     * Get data for the specified period
     */
    public function getData(int $days = 30): array;
}
