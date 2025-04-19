<?php

namespace Shah\Novus\Services;

use Shah\Novus\Services\Analytics\PerformanceAnalyticsService;
use Shah\Novus\Services\Analytics\SeoAnalyticsService;
use Shah\Novus\Services\Analytics\StatisticsService;

class AnalyticsService
{
    public function __construct(
        protected StatisticsService $statisticsService,
        protected SeoAnalyticsService $seoService,
        protected PerformanceAnalyticsService $performanceService
    ) {}

    /**
     * Check if analytics is configured
     */
    public function isConfigured(): bool
    {
        return $this->statisticsService->isConfigured();
    }

    /**
     * Get dashboard analytics data
     *
     * @param  int  $days  Number of days to include in the report
     */
    public function getDashboardData(int $days = 30): array
    {
        return $this->statisticsService->getData($days);
    }

    /**
     * Get SEO analytics data
     *
     * @param  int  $days  Number of days to include in the report
     */
    public function getSeoData(int $days = 30): array
    {
        return $this->seoService->getData($days);
    }

    /**
     * Get performance analytics data
     *
     * @param  int  $days  Number of days to include in the report
     */
    public function getPerformanceData(int $days = 30): array
    {
        return $this->performanceService->getData($days);
    }

    /**
     * Clear cache for all analytics data
     */
    public function clearCache(): bool
    {
        $this->statisticsService->clearCache();
        $this->seoService->clearCache();
        $this->performanceService->clearCache();

        return true;
    }
}
