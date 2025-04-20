<?php

namespace Shah\Novus\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Shah\Novus\Services\AnalyticsService;

class PerformanceController extends Controller
{
    public function __construct(
        protected AnalyticsService $analytics_service
    ) {}

    public function __invoke(Request $request)
    {
        $period = $request->input('period', 30);

        return Inertia::render('Performance/Index', [
            'performanceData' => $this->analytics_service->getPerformanceData((int) $period),
            'seoData' => $this->analytics_service->getSeoData((int) $period),
            'period' => $period,
            'periodOptions' => $this->getPeriodOptions(),
        ]);
    }

    public function getPeriodOptions(): array
    {
        $days = config('novus.analytics.available_periods', [30, 60, 90, 180]);

        return array_map(function ($day) {
            return [
                'value' => (string) $day,
                'label' => "Last {$day} days",
            ];
        }, $days);
    }
}
