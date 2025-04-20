<?php

namespace Shah\Novus\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Shah\Novus\Services\AnalyticsService;

class StatisticsController extends Controller
{
    public function __construct(
        protected AnalyticsService $analyticsService
    ) {}

    public function __invoke(Request $request)
    {
        $period = $request->input('period', 30);
        $data = $this->analyticsService->getDashboardData($period);

        return Inertia::render('Statistics/Index', [
            'periodOptions' => $this->getPeriodOptions(),
            'period' => $period,
            'analyticsData' => $data,
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
