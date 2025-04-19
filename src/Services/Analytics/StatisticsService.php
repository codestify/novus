<?php

namespace Shah\Novus\Services\Analytics;

use Carbon\Carbon;

class StatisticsService extends BaseAnalyticsService
{
    /**
     * Get the cache key for this service
     */
    protected function getCacheKey(int $days): string
    {
        return "{$this->cachePrefix}stats_data_{$days}";
    }

    /**
     * Fetch analytics data for statistics dashboard
     */
    protected function fetchData(Carbon $startDate, Carbon $endDate): array
    {
        $visitorsAndPageViews = $this->fetchVisitorsAndPageViewsByDate($startDate, $endDate);
        $mostVisitedPages = $this->fetchMostVisitedPages($startDate, $endDate);
        $topReferrers = $this->fetchTopReferrers($startDate, $endDate);
        $topBrowsers = $this->fetchTopBrowsers($startDate, $endDate);
        $userMetrics = $this->calculateUserMetrics($startDate, $endDate);

        return [
            'period' => $endDate->diffInDays($startDate) + 1,
            'userMetrics' => $userMetrics,
            'activeUsers' => $this->fetchActiveUsers(),
            'visitorsAndPageViews' => $visitorsAndPageViews,
            'topBrowsers' => $topBrowsers,
            'topReferrers' => $topReferrers,
            'mostVisitedPages' => $mostVisitedPages,
        ];
    }

    /**
     * Fetch visitors and pageviews by date
     */
    protected function fetchVisitorsAndPageViewsByDate(Carbon $startDate, Carbon $endDate): array
    {
        $metrics = ['activeUsers', 'screenPageViews'];
        $dimensions = ['date'];

        $result = $this->client->runReport($startDate, $endDate, $metrics, $dimensions);

        // Format the data
        $formattedData = [];
        foreach ($result as $row) {
            $formattedData[] = [
                'date' => $row['date'],
                'visitors' => (int) $row['activeUsers'],
                'pageViews' => (int) $row['screenPageViews'],
            ];
        }

        return $formattedData;
    }

    /**
     * Fetch most visited pages
     */
    protected function fetchMostVisitedPages(Carbon $startDate, Carbon $endDate): array
    {
        $metrics = ['screenPageViews'];
        $dimensions = ['pagePath', 'pageTitle'];

        $result = $this->client->runReport($startDate, $endDate, $metrics, $dimensions, 40);

        // Format the data and filter out admin pages
        $formattedData = [];
        foreach ($result as $row) {
            $url = $row['pagePath'] ?? '/';

            // Skip pages that start with /novus
            if (preg_match('#^/novus(/|$)#i', $url)) {
                continue;
            }

            $formattedData[] = [
                'url' => $url,
                'pageTitle' => $row['pageTitle'] ?? 'Homepage',
                'pageViews' => (int) $row['screenPageViews'],
            ];
        }

        usort($formattedData, function ($a, $b) {
            return $b['pageViews'] <=> $a['pageViews'];
        });

        return array_slice($formattedData, 0, 8);
    }

    /**
     * Fetch top referrers
     */
    protected function fetchTopReferrers(Carbon $startDate, Carbon $endDate): array
    {
        $metrics = ['screenPageViews'];
        $dimensions = ['sessionSource'];

        $result = $this->client->runReport($startDate, $endDate, $metrics, $dimensions, 10);

        // Format the data
        $formattedData = [];
        foreach ($result as $row) {
            $formattedData[] = [
                'url' => $row['sessionSource'] ?? 'direct',
                'pageViews' => (int) $row['screenPageViews'],
            ];
        }

        return $formattedData;
    }

    /**
     * Fetch top browsers
     */
    protected function fetchTopBrowsers(Carbon $startDate, Carbon $endDate): array
    {
        $metrics = ['sessions'];
        $dimensions = ['browser'];

        $result = $this->client->runReport($startDate, $endDate, $metrics, $dimensions, 10);

        // Format the data
        $formattedData = [];
        foreach ($result as $row) {
            $formattedData[] = [
                'browser' => $row['browser'] ?? 'Other',
                'sessions' => (int) $row['sessions'],
            ];
        }

        return $formattedData;
    }

    /**
     * Calculate user metrics from various data points
     */
    protected function calculateUserMetrics(Carbon $startDate, Carbon $endDate): array
    {
        // Get all the metrics we need in one go
        $metrics = ['totalUsers', 'newUsers', 'sessions', 'screenPageViews', 'userEngagementDuration'];

        $result = $this->client->runReport($startDate, $endDate, $metrics);

        // Default values
        $totalUsers = 0;
        $newUsers = 0;
        $sessions = 0;
        $pageViews = 0;
        $engagementDuration = 0;

        // Extract data from the first row if available
        if (! empty($result)) {
            $data = $result[0];
            $totalUsers = (int) ($data['totalUsers'] ?? 0);
            $newUsers = (int) ($data['newUsers'] ?? 0);
            $sessions = (int) ($data['sessions'] ?? 0);
            $pageViews = (int) ($data['screenPageViews'] ?? 0);
            $engagementDuration = (float) ($data['userEngagementDuration'] ?? 0);
        }

        // Calculate derived metrics
        $pageViewsPerSession = $sessions > 0 ? $pageViews / $sessions : 0;
        $avgSessionDuration = $sessions > 0 ? $engagementDuration / $sessions : 0;

        // Get previous period metrics to calculate changes
        $periodDays = (int) ($endDate->diffInDays($startDate) + 1);
        $previousPeriodMetrics = $this->getPreviousPeriodMetrics($startDate, $periodDays);

        // Calculate percentage changes
        $totalUsersChange = $this->calculatePercentageChange(
            $previousPeriodMetrics['totalUsers'] ?? 0,
            $totalUsers
        );

        $newUsersChange = $this->calculatePercentageChange(
            $previousPeriodMetrics['newUsers'] ?? 0,
            $newUsers
        );

        $sessionsChange = $this->calculatePercentageChange(
            $previousPeriodMetrics['sessions'] ?? 0,
            $sessions
        );

        $pageviewsPerSessionChange = $this->calculatePercentageChange(
            $previousPeriodMetrics['pageviewsPerSession'] ?? 0,
            $pageViewsPerSession
        );

        $avgSessionDurationChange = $this->calculatePercentageChange(
            $previousPeriodMetrics['avgSessionDuration'] ?? 0,
            $avgSessionDuration
        );

        return [
            'totalUsers' => $totalUsers,
            'totalUsersChange' => $totalUsersChange,
            'newUsers' => $newUsers,
            'newUsersChange' => $newUsersChange,
            'sessions' => $sessions,
            'sessionsChange' => $sessionsChange,
            'pageviewsPerSession' => round($pageViewsPerSession, 1),
            'pageviewsPerSessionChange' => $pageviewsPerSessionChange,
            'avgSessionDuration' => (int) round($avgSessionDuration),
            'avgSessionDurationChange' => $avgSessionDurationChange,
        ];
    }

    /**
     * Get metrics for the same period from exactly one week ago
     *
     * This method retrieves the same metrics for the equivalent period
     * that started exactly one week before the current period.
     * Used for week-over-week comparison.
     *
     * @param  Carbon  $currentPeriodStartDate  The start date of the current period
     * @param  int  $periodDays  The length of the period in days
     * @return array The metrics for the previous week's equivalent period
     */
    protected function getPreviousPeriodMetrics(Carbon $currentPeriodStartDate, int $periodDays): array
    {
        // Calculate same period but one week ago
        $previousPeriodStartDate = $currentPeriodStartDate->copy()->subDays(7);
        $previousPeriodEndDate = $previousPeriodStartDate->copy()->addDays($periodDays - 1);

        // Log comparison periods
        \Illuminate\Support\Facades\Log::info('Comparing analytics periods', [
            'current_period' => [
                'start' => $currentPeriodStartDate->format('Y-m-d'),
                'end' => $currentPeriodStartDate->copy()->addDays($periodDays - 1)->format('Y-m-d'),
                'days' => $periodDays,
            ],
            'previous_period' => [
                'start' => $previousPeriodStartDate->format('Y-m-d'),
                'end' => $previousPeriodEndDate->format('Y-m-d'),
                'days' => $periodDays,
            ],
        ]);

        // Get all the metrics we need in one go
        $metrics = ['totalUsers', 'newUsers', 'sessions', 'screenPageViews', 'userEngagementDuration'];

        $result = $this->client->runReport($previousPeriodStartDate, $previousPeriodEndDate, $metrics);

        // Default values
        $totalUsers = 0;
        $newUsers = 0;
        $sessions = 0;
        $pageViews = 0;
        $engagementDuration = 0;

        // Extract data from the first row if available
        if (! empty($result)) {
            $data = $result[0];
            $totalUsers = (int) ($data['totalUsers'] ?? 0);
            $newUsers = (int) ($data['newUsers'] ?? 0);
            $sessions = (int) ($data['sessions'] ?? 0);
            $pageViews = (int) ($data['screenPageViews'] ?? 0);
            $engagementDuration = (float) ($data['userEngagementDuration'] ?? 0);
        }

        // Calculate derived metrics
        $pageViewsPerSession = $sessions > 0 ? $pageViews / $sessions : 0;
        $avgSessionDuration = $sessions > 0 ? $engagementDuration / $sessions : 0;

        return [
            'totalUsers' => $totalUsers,
            'newUsers' => $newUsers,
            'sessions' => $sessions,
            'pageviewsPerSession' => round($pageViewsPerSession, 1),
            'avgSessionDuration' => (int) round($avgSessionDuration),
        ];
    }

    /**
     * Calculate percentage change between two values
     */
    protected function calculatePercentageChange(float $oldValue, float $newValue): ?float
    {
        if ($oldValue == 0) {
            return $newValue > 0 ? 100 : null;
        }

        return round((($newValue - $oldValue) / $oldValue) * 100, 1);
    }

    /**
     * Fetch the number of currently active users
     */
    protected function fetchActiveUsers(): int
    {
        // Get active users for today
        $today = Carbon::today();

        $metrics = ['activeUsers'];
        $dimensions = ['hour'];

        $result = $this->client->runReport($today, $today, $metrics, $dimensions);

        // Get the most recent hour's data
        $activeUsers = 0;

        if (! empty($result)) {
            // Find the most recent hour data
            $currentHour = (int) Carbon::now()->format('H');

            foreach ($result as $row) {
                if ((int) $row['hour'] === $currentHour) {
                    $activeUsers = (int) $row['activeUsers'];
                    break;
                }
            }
        }

        return $activeUsers;
    }

    /**
     * Get placeholder data for dashboard when analytics is not configured
     */
    protected function getPlaceholderData(int $days): array
    {
        // Create sample visitors and pageviews data
        $visitorsData = [];
        $startDate = Carbon::now()->subDays($days - 1);

        for ($i = 0; $i < $days; $i++) {
            $date = $startDate->copy()->addDays($i);
            $isWeekend = $date->isWeekend();

            // Lower traffic on weekends
            $baseVisitors = $isWeekend ? rand(600, 700) : rand(750, 850);
            $basePageViews = $baseVisitors * rand(28, 35) / 10;

            $visitorsData[] = [
                'date' => $date->format('Y-m-d'),
                'visitors' => $baseVisitors,
                'pageViews' => (int) $basePageViews,
            ];
        }

        // Sample browser data
        $browserData = [
            ['browser' => 'Chrome', 'sessions' => 18432],
            ['browser' => 'Safari', 'sessions' => 9234],
            ['browser' => 'Firefox', 'sessions' => 3621],
            ['browser' => 'Edge', 'sessions' => 2875],
            ['browser' => 'Opera', 'sessions' => 763],
            ['browser' => 'Other', 'sessions' => 542],
        ];

        // Sample referrer data
        $referrerData = [
            ['url' => 'google.com', 'pageViews' => 12532],
            ['url' => 'facebook.com', 'pageViews' => 5487],
            ['url' => 'twitter.com', 'pageViews' => 3214],
            ['url' => 'instagram.com', 'pageViews' => 2846],
            ['url' => 'linkedin.com', 'pageViews' => 1923],
        ];

        // Sample pages data
        $pagesData = [
            ['url' => '/', 'pageTitle' => 'Home', 'pageViews' => 8765],
            ['url' => '/blog', 'pageTitle' => 'Blog', 'pageViews' => 6543],
            ['url' => '/products', 'pageTitle' => 'Products', 'pageViews' => 4321],
            ['url' => '/about', 'pageTitle' => 'About Us', 'pageViews' => 3210],
            ['url' => '/contact', 'pageTitle' => 'Contact', 'pageViews' => 2109],
        ];

        // Sample aggregated metrics with simulated change percentages
        $userMetrics = [
            'totalUsers' => 24895,
            'totalUsersChange' => 8.5,
            'newUsers' => 18432,
            'newUsersChange' => 12.2,
            'sessions' => 35467,
            'sessionsChange' => 5.7,
            'pageviewsPerSession' => 3.2,
            'pageviewsPerSessionChange' => 4.3,
            'avgSessionDuration' => 142,
            'avgSessionDurationChange' => -2.8,
        ];

        return [
            'period' => (string) $days,
            'userMetrics' => $userMetrics,
            'activeUsers' => rand(20, 30),
            'visitorsAndPageViews' => $visitorsData,
            'topBrowsers' => $browserData,
            'topReferrers' => $referrerData,
            'mostVisitedPages' => $pagesData,
        ];
    }

    /**
     * Get a minimal test dataset to verify GA4 connectivity
     *
     * @return array Test data with basic metrics for today
     */
    public function getTestData(): array
    {
        if (! $this->isConfigured()) {
            return [];
        }

        // Try to get today's data only
        $today = Carbon::today();

        try {
            // Get basic metrics only
            $metrics = ['totalUsers', 'sessions'];
            $result = $this->client->runReport($today, $today, $metrics);

            // Default values
            $totalUsers = 0;
            $sessions = 0;

            // Extract data from the first row if available
            if (! empty($result)) {
                $data = $result[0];
                $totalUsers = (int) ($data['totalUsers'] ?? 0);
                $sessions = (int) ($data['sessions'] ?? 0);
            }

            return [
                'userMetrics' => [
                    'totalUsers' => $totalUsers,
                    'sessions' => $sessions,
                ],
                'timestamp' => now()->toDateTimeString(),
                'source' => 'google-analytics',
            ];
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('GA4 test failed: '.$e->getMessage());

            return [];
        }
    }
}
