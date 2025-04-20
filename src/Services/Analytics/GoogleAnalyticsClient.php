<?php

namespace Shah\Novus\Services\Analytics;

use Carbon\Carbon;
use Google\Analytics\Data\V1beta\Client\BetaAnalyticsDataClient;
use Google\Analytics\Data\V1beta\DateRange;
use Google\Analytics\Data\V1beta\Dimension;
use Google\Analytics\Data\V1beta\Metric;
use Google\Analytics\Data\V1beta\RunReportRequest;
use Illuminate\Support\Facades\Log;

class GoogleAnalyticsClient
{
    protected ?BetaAnalyticsDataClient $client = null;

    protected bool $isConfigured;

    protected string $propertyId;

    public function __construct()
    {
        $this->propertyId = config('novus.analytics.property_id', '');
        $credentialsPath = config('novus.analytics.service_account_credentials_json', '');

        $this->isConfigured = ! empty($this->propertyId) && file_exists($credentialsPath);

        if (! $this->isConfigured) {
            Log::warning('Google Analytics is not configured correctly. propertyId='.(empty($this->propertyId) ? 'missing' : 'present').
                ', credentialsPath='.($credentialsPath ? $credentialsPath : 'missing').
                ', fileExists='.(file_exists($credentialsPath) ? 'yes' : 'no'));

            return;
        }

        try {
            $this->client = new BetaAnalyticsDataClient([
                'credentials' => $credentialsPath,
            ]);
            Log::info('Google Analytics client initialized successfully with property ID: '.$this->propertyId);
        } catch (\Exception $e) {
            Log::error('Failed to create Google Analytics client: '.$e->getMessage());
            $this->isConfigured = false;
        }
    }

    /**
     * Check if the client is configured correctly
     */
    public function isConfigured(): bool
    {
        return $this->isConfigured && $this->client !== null;
    }

    /**
     * Run a report with the given metrics and dimensions
     */
    public function runReport(
        Carbon $startDate,
        Carbon $endDate,
        array $metrics,
        array $dimensions = [],
        int $limit = 100
    ): array {
        if (! $this->isConfigured()) {
            return [];
        }

        try {
            // Create date range
            $dateRange = new DateRange;
            $dateRange->setStartDate($startDate->format('Y-m-d'));
            $dateRange->setEndDate($endDate->format('Y-m-d'));

            // Create request
            $request = new RunReportRequest;
            $request->setProperty('properties/'.$this->propertyId);
            $request->setDateRanges([$dateRange]);

            // Add metrics
            $metricObjects = [];
            foreach ($metrics as $metric) {
                $metricObject = new Metric;
                $metricObject->setName($metric);
                $metricObjects[] = $metricObject;
            }
            $request->setMetrics($metricObjects);

            // Add dimensions
            $dimensionObjects = [];
            foreach ($dimensions as $dimension) {
                $dimensionObject = new Dimension;
                $dimensionObject->setName($dimension);
                $dimensionObjects[] = $dimensionObject;
            }
            $request->setDimensions($dimensionObjects);

            // Set limit
            $request->setLimit($limit);

            // Execute the request
            $response = $this->client->runReport($request);

            return $this->formatReportResponse($response);
        } catch (\Exception $e) {
            Log::error('Failed to run Google Analytics report: '.$e->getMessage());

            return [];
        }
    }

    /**
     * Format the report response into a usable array
     */
    protected function formatReportResponse(
        $response
    ): array {
        $result = [];
        $dimensionHeaders = [];
        $metricHeaders = [];

        // Get headers
        foreach ($response->getDimensionHeaders() as $header) {
            $dimensionHeaders[] = $header->getName();
        }

        foreach ($response->getMetricHeaders() as $header) {
            $metricHeaders[] = $header->getName();
        }

        // Process rows
        foreach ($response->getRows() as $row) {
            $rowData = [];

            // Add dimensions
            foreach ($dimensionHeaders as $index => $header) {
                $value = $row->getDimensionValues()[$index]->getValue();

                // Convert date dimension to Carbon instance
                if ($header === 'date') {
                    $value = Carbon::createFromFormat('Ymd', $value)->format('Y-m-d');
                }

                $rowData[$header] = $value;
            }

            // Add metrics
            foreach ($metricHeaders as $index => $header) {
                $value = $row->getMetricValues()[$index]->getValue();
                $rowData[$header] = is_numeric($value) ? (float) $value : $value;
            }

            $result[] = $rowData;
        }

        return $result;
    }
}
