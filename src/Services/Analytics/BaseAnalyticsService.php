<?php

namespace Shah\Novus\Services\Analytics;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Shah\Novus\Contracts\Reportable;

abstract class BaseAnalyticsService implements Reportable
{
    /**
     * The cache prefix for all analytics data
     */
    protected string $cachePrefix = 'novus_analytics_';

    /**
     * Cache duration in minutes
     */
    protected int $cacheDuration;

    /**
     * Whether analytics is properly configured
     */
    protected bool $isConfigured;

    /**
     * The Google Analytics client
     */
    protected GoogleAnalyticsClient $client;

    /**
     * Base constructor
     */
    public function __construct(GoogleAnalyticsClient $client)
    {
        $this->client = $client;
        $this->cacheDuration = config('novus.analytics.cache_lifetime_in_minutes', 60);
        $this->isConfigured = $this->client->isConfigured();
    }

    /**
     * Check if analytics service is properly configured
     */
    public function isConfigured(): bool
    {
        return $this->isConfigured;
    }

    /**
     * Get data with caching
     */
    public function getData(int $days = 30): array
    {
        if (! $this->isConfigured()) {
            Log::info('Using placeholder analytics data because Google Analytics is not configured');

            return $this->getPlaceholderData($days);
        }

        $cacheKey = $this->getCacheKey($days);

        return Cache::remember($cacheKey, $this->cacheDuration * 60, function () use ($days) {
            try {
                // Create date range
                $endDate = Carbon::today();
                $startDate = Carbon::today()->subDays($days - 1);

                $data = $this->fetchData($startDate, $endDate);

                // Check if we got actual data back
                if (empty($data) || $this->isEmptyDataset($data)) {
                    Log::warning('Received empty dataset from Google Analytics, falling back to placeholder data');

                    return $this->getPlaceholderData($days);
                }

                Log::info('Successfully fetched real data from Google Analytics');

                return $data;
            } catch (\Exception $e) {
                Log::error('Failed to fetch analytics data: '.$e->getMessage());

                return $this->getPlaceholderData($days);
            }
        });
    }

    /**
     * Check if the dataset is effectively empty
     */
    protected function isEmptyDataset(array $data): bool
    {
        // Check if userMetrics contains any actual data
        if (isset($data['userMetrics']) && is_array($data['userMetrics'])) {
            $metrics = $data['userMetrics'];
            $nonZeroValues = array_filter($metrics, function ($value) {
                return is_numeric($value) && $value > 0;
            });

            // If we have some non-zero values, data is not empty
            if (count($nonZeroValues) > 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * Clear cached data
     *
     * @param  int|null  $days  Specific period to clear, or null for all periods
     */
    public function clearCache(?int $days = null): bool
    {
        if ($days !== null) {
            return Cache::forget($this->getCacheKey($days));
        }

        // Clear all periods
        $periods = [7, 30, 60, 90, 180, 365];
        foreach ($periods as $period) {
            Cache::forget($this->getCacheKey($period));
        }

        return true;
    }

    /**
     * Get the cache key for this service
     */
    abstract protected function getCacheKey(int $days): string;

    /**
     * Fetch real data from analytics API
     */
    abstract protected function fetchData(Carbon $startDate, Carbon $endDate): array;

    /**
     * Get placeholder data when analytics is not configured
     */
    abstract protected function getPlaceholderData(int $days): array;
}
