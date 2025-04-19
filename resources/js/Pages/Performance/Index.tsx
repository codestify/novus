import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@novus/Components/ui/select";
import { Card, CardContent } from "@novus/Components/ui/card";
import { Button } from "@novus/Components/ui/button";
import {
    ArrowDown,
    ArrowUp,
    BarChart2,
    BarChart3,
    Calendar,
    Clock,
    ExternalLink,
    RefreshCw,
    Search,
    TrendingDown,
    TrendingUp,
    Zap,
} from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import AuthLayout from "@novus/Layouts/AuthLayout";
import BounceRateChart from "@novus/Components/Analytics/BounceRateChart";
import KeywordsTable from "@novus/Components/Analytics/KeywordsTable";
import useTypedPage from "@novus/Hooks/useTypePage";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@novus/Components/ui/tabs";

// Define period options
const periodOptions = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "60", label: "Last 60 days" },
    { value: "90", label: "Last 90 days" },
    { value: "180", label: "Last 6 months" },
    { value: "365", label: "Last year" },
];

const Index = () => {
    const page = useTypedPage();
    const { performanceData, seoData } = page.props;

    const [period, setPeriod] = useState<string>(performanceData.period);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("overview");

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Calculate current period dates
    const currentPeriod = {
        start: formatDate(
            new Date(
                Date.now() - parseInt(period) * 24 * 60 * 60 * 1000,
            ).toISOString(),
        ),
        end: formatDate(new Date().toISOString()),
    };

    // Handle period change
    const handlePeriodChange = (value: string) => {
        setPeriod(value);
        // Fetch new data with updated period
        router.visit(window.location.pathname, {
            data: { period: value },
            preserveState: true,
            only: ["performanceData", "seoData"],
        });
    };

    // Refresh data
    const refreshData = () => {
        setIsRefreshing(true);
        // Fetch fresh data
        router.reload({
            onSuccess: () => {
                setIsRefreshing(false);
            },
            onError: () => {
                setIsRefreshing(false);
            },
        });
    };

    // Format X-axis ticks to display shorter date format
    const formatXAxisTick = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { day: "numeric" });
    };

    // Custom tooltip for page load time chart
    const PageLoadTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-3 rounded-lg border shadow-sm bg-background">
                    <p className="font-medium">{formatDate(label)}</p>
                    <div className="mt-2 space-y-1">
                        <p className="flex items-center text-sm">
                            <span className="inline-block mr-2 w-3 h-3 bg-blue-500 rounded-full"></span>
                            <span className="mr-2 text-muted-foreground">
                                Load Time:
                            </span>
                            <span className="font-medium">
                                {payload[0].value} seconds
                            </span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Custom tooltip for CTR chart
    const CtrTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-3 rounded-lg border shadow-sm bg-background">
                    <p className="font-medium">{formatDate(label)}</p>
                    <div className="mt-2 space-y-1">
                        <p className="flex items-center text-sm">
                            <span className="inline-block mr-2 w-3 h-3 bg-green-500 rounded-full"></span>
                            <span className="mr-2 text-muted-foreground">
                                Click-Through Rate:
                            </span>
                            <span className="font-medium">
                                {payload[0].value}%
                            </span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Custom tooltip for visitor sources chart
    const VisitorSourcesTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-3 rounded-lg border shadow-sm bg-background">
                    <p className="font-medium">{formatDate(label)}</p>
                    <div className="mt-2 space-y-1">
                        {payload.map((entry: any, index: number) => (
                            <p
                                key={index}
                                className="flex items-center text-sm"
                            >
                                <span
                                    className="inline-block mr-2 w-3 h-3 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="mr-2 text-muted-foreground">
                                    {entry.name}:
                                </span>
                                <span className="font-medium">
                                    {entry.value.toLocaleString()} visits
                                </span>
                            </p>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <AuthLayout>
            <Head title="Site Performance" />

            <div className="py-20 max-w-[1400px] mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Site Performance
                            </h1>
                            <p className="mt-1 text-muted-foreground">
                                Analyze website performance, user behavior, and
                                search visibility metrics
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 items-center mt-4 sm:mt-0">
                            {/* Time period selector */}
                            <div className="flex items-center">
                                <Calendar className="mr-2 w-4 h-4 text-muted-foreground" />
                                <Select
                                    value={period}
                                    onValueChange={handlePeriodChange}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {periodOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Refresh button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={refreshData}
                                disabled={isRefreshing}
                            >
                                <RefreshCw
                                    className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                                />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    {/* Date range info */}
                    <div className="p-2 mt-4 text-sm rounded-md bg-muted/50 text-muted-foreground">
                        Showing data from {currentPeriod.start} to{" "}
                        {currentPeriod.end}
                    </div>
                </div>

                {/* Tabs for different dashboard sections */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-8"
                >
                    <TabsList className="grid grid-cols-2 w-full sm:w-auto sm:inline-flex sm:grid-cols-none">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="performance">
                            Page Performance
                        </TabsTrigger>
                        <TabsTrigger value="seo">SEO Metrics</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab Content */}
                    <TabsContent value="overview" className="space-y-6">
                        {/* Key Performance Metrics Cards */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Page Load Time */}
                            <Card className="rounded-md border-muted shadow-xs">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="mb-1 text-sm font-medium text-muted-foreground">
                                                Page Load Time
                                            </p>
                                            <div className="flex gap-2 items-baseline">
                                                <h3 className="text-2xl font-bold">
                                                    {
                                                        performanceData
                                                            .performanceSummary
                                                            .avgPageLoadTime
                                                    }
                                                    s
                                                </h3>
                                                <span
                                                    className={`text-xs flex items-center ${performanceData.performanceSummary.pageLoadTimeChange < 0 ? "text-green-500" : "text-red-500"}`}
                                                >
                                                    {performanceData
                                                        .performanceSummary
                                                        .pageLoadTimeChange <
                                                    0 ? (
                                                        <ArrowDown className="h-3 w-3 mr-0.5" />
                                                    ) : (
                                                        <ArrowUp className="h-3 w-3 mr-0.5" />
                                                    )}
                                                    {Math.abs(
                                                        performanceData
                                                            .performanceSummary
                                                            .pageLoadTimeChange,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-full bg-primary/10">
                                            <Clock className="w-5 h-5 text-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Bounce Rate */}
                            <Card className="rounded-md border-muted shadow-xs">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="mb-1 text-sm font-medium text-muted-foreground">
                                                Bounce Rate
                                            </p>
                                            <div className="flex gap-2 items-baseline">
                                                <h3 className="text-2xl font-bold">
                                                    {
                                                        performanceData
                                                            .performanceSummary
                                                            .avgBounceRate
                                                    }
                                                    %
                                                </h3>
                                                <span
                                                    className={`text-xs flex items-center ${performanceData.performanceSummary.bounceRateChange < 0 ? "text-green-500" : "text-red-500"}`}
                                                >
                                                    {performanceData
                                                        .performanceSummary
                                                        .bounceRateChange <
                                                    0 ? (
                                                        <ArrowDown className="h-3 w-3 mr-0.5" />
                                                    ) : (
                                                        <ArrowUp className="h-3 w-3 mr-0.5" />
                                                    )}
                                                    {Math.abs(
                                                        performanceData
                                                            .performanceSummary
                                                            .bounceRateChange,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-full bg-primary/10">
                                            <Zap className="w-5 h-5 text-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Click-Through Rate */}
                            <Card className="rounded-md border-muted shadow-xs">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="mb-1 text-sm font-medium text-muted-foreground">
                                                Click-Through Rate
                                            </p>
                                            <div className="flex gap-2 items-baseline">
                                                <h3 className="text-2xl font-bold">
                                                    {seoData.seoSummary.avgCtr}%
                                                </h3>
                                                <span
                                                    className={`text-xs flex items-center ${seoData.seoSummary.ctrChange >= 0 ? "text-green-500" : "text-red-500"}`}
                                                >
                                                    {seoData.seoSummary
                                                        .ctrChange >= 0 ? (
                                                        <ArrowUp className="h-3 w-3 mr-0.5" />
                                                    ) : (
                                                        <ArrowDown className="h-3 w-3 mr-0.5" />
                                                    )}
                                                    {Math.abs(
                                                        seoData.seoSummary
                                                            .ctrChange,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-full bg-primary/10">
                                            <BarChart2 className="w-5 h-5 text-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Organic Search Traffic */}
                            <Card className="rounded-md border-muted shadow-xs">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="mb-1 text-sm font-medium text-muted-foreground">
                                                Organic Traffic
                                            </p>
                                            <div className="flex gap-2 items-baseline">
                                                <h3 className="text-2xl font-bold">
                                                    {(
                                                        seoData.seoSummary
                                                            .totalOrganicTraffic /
                                                        1000
                                                    ).toFixed(1)}
                                                    k
                                                </h3>
                                                <span
                                                    className={`text-xs flex items-center ${seoData.seoSummary.organicTrafficChange >= 0 ? "text-green-500" : "text-red-500"}`}
                                                >
                                                    {seoData.seoSummary
                                                        .organicTrafficChange >=
                                                    0 ? (
                                                        <TrendingUp className="h-3 w-3 mr-0.5" />
                                                    ) : (
                                                        <TrendingDown className="h-3 w-3 mr-0.5" />
                                                    )}
                                                    {Math.abs(
                                                        seoData.seoSummary
                                                            .organicTrafficChange,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-full bg-primary/10">
                                            <Search className="w-5 h-5 text-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Overview Charts */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Page Load Time Chart */}
                            <Card className="rounded-md border-muted shadow-xs">
                                <CardContent className="p-6">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold">
                                            Page Load Time
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Average time it takes to load your
                                            pages
                                        </p>
                                    </div>

                                    <div style={{ height: "250px" }}>
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <LineChart
                                                data={
                                                    performanceData.pageLoadTime
                                                }
                                                margin={{
                                                    top: 10,
                                                    right: 10,
                                                    left: 10,
                                                    bottom: 25,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                    opacity={0.3}
                                                />

                                                <XAxis
                                                    dataKey="date"
                                                    tickFormatter={
                                                        formatXAxisTick
                                                    }
                                                    axisLine={false}
                                                    tickLine={false}
                                                    dy={10}
                                                    tick={{ fontSize: 12 }}
                                                />

                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    width={40}
                                                    tick={{ fontSize: 12 }}
                                                    tickFormatter={(value) =>
                                                        `${value}s`
                                                    }
                                                    domain={[
                                                        0,
                                                        "dataMax + 0.5",
                                                    ]}
                                                />

                                                <Tooltip
                                                    content={
                                                        <PageLoadTooltip />
                                                    }
                                                />

                                                <Line
                                                    type="monotone"
                                                    dataKey="loadTime"
                                                    stroke="#3b82f6"
                                                    strokeWidth={2}
                                                    dot={false}
                                                    activeDot={{
                                                        r: 6,
                                                        fill: "#3b82f6",
                                                    }}
                                                />

                                                {/* Reference line for good performance */}
                                                <ReferenceLine
                                                    y={2.5}
                                                    stroke="#f97316"
                                                    strokeDasharray="3 3"
                                                    label={{
                                                        value: "Target: 2.5s",
                                                        position:
                                                            "insideBottomRight",
                                                        fill: "#f97316",
                                                        fontSize: 12,
                                                    }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Bounce Rate Chart */}
                            <Card className="rounded-md border-muted shadow-xs">
                                <CardContent className="p-6">
                                    <BounceRateChart
                                        data={performanceData.bounceRate}
                                        title="Bounce Rate Trend"
                                        description="Percentage of visitors who navigate away after viewing only one page"
                                        height={250}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Additional Overview Charts */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Click-Through Rate Chart */}
                            <Card className="rounded-md border-muted shadow-xs">
                                <CardContent className="p-6">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold">
                                            Click-Through Rate Trend
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Percentage of search impressions
                                            that resulted in clicks
                                        </p>
                                    </div>

                                    <div style={{ height: "250px" }}>
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <LineChart
                                                data={seoData.clickThroughRate}
                                                margin={{
                                                    top: 10,
                                                    right: 10,
                                                    left: 10,
                                                    bottom: 25,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                    opacity={0.3}
                                                />

                                                <XAxis
                                                    dataKey="date"
                                                    tickFormatter={
                                                        formatXAxisTick
                                                    }
                                                    axisLine={false}
                                                    tickLine={false}
                                                    dy={10}
                                                    tick={{ fontSize: 12 }}
                                                />

                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    width={40}
                                                    tick={{ fontSize: 12 }}
                                                    tickFormatter={(value) =>
                                                        `${value}%`
                                                    }
                                                    domain={[0, "dataMax + 1"]}
                                                />

                                                <Tooltip
                                                    content={<CtrTooltip />}
                                                />

                                                <Line
                                                    type="monotone"
                                                    dataKey="ctr"
                                                    stroke="#10b981"
                                                    strokeWidth={2}
                                                    dot={false}
                                                    activeDot={{
                                                        r: 6,
                                                        fill: "#10b981",
                                                    }}
                                                />

                                                {/* Reference line for industry average */}
                                                <ReferenceLine
                                                    y={3.5}
                                                    stroke="#8b5cf6"
                                                    strokeDasharray="3 3"
                                                    label={{
                                                        value: "Avg: 3.5%",
                                                        position:
                                                            "insideBottomRight",
                                                        fill: "#8b5cf6",
                                                        fontSize: 12,
                                                    }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Device Categories */}
                            <Card className="rounded-md border-muted shadow-xs">
                                <CardContent className="p-6">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold">
                                            Device Categories
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Sessions by device type
                                        </p>
                                    </div>

                                    <div style={{ height: "250px" }}>
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart
                                                data={
                                                    performanceData.deviceCategories
                                                }
                                                margin={{
                                                    top: 10,
                                                    right: 10,
                                                    left: 10,
                                                    bottom: 25,
                                                }}
                                                layout="vertical"
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    horizontal={true}
                                                    vertical={false}
                                                    opacity={0.3}
                                                />

                                                <XAxis
                                                    type="number"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 12 }}
                                                    tickFormatter={(value) =>
                                                        value.toLocaleString()
                                                    }
                                                />

                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    width={80}
                                                    tick={{ fontSize: 12 }}
                                                />

                                                <Tooltip
                                                    formatter={(value: any) => [
                                                        value.toLocaleString(),
                                                        "Sessions",
                                                    ]}
                                                    labelFormatter={(value) =>
                                                        `Device: ${value}`
                                                    }
                                                />

                                                <Bar
                                                    dataKey="sessions"
                                                    name="Sessions"
                                                    radius={[0, 4, 4, 0]}
                                                >
                                                    {performanceData.deviceCategories.map(
                                                        (entry, index) => {
                                                            const colors = [
                                                                "#3b82f6",
                                                                "#f97316",
                                                                "#8b5cf6",
                                                            ];
                                                            return (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={
                                                                        colors[
                                                                            index %
                                                                                colors.length
                                                                        ]
                                                                    }
                                                                />
                                                            );
                                                        },
                                                    )}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="flex flex-wrap gap-y-2 gap-x-6 justify-center mt-4 text-sm">
                                        {Object.entries(
                                            performanceData.performanceSummary
                                                .deviceDistribution,
                                        ).map(([device, data], index) => {
                                            const colors = [
                                                "bg-blue-500",
                                                "bg-orange-500",
                                                "bg-purple-500",
                                            ];
                                            return (
                                                <div
                                                    key={device}
                                                    className="flex items-center"
                                                >
                                                    <div
                                                        className={`w-3 h-3 rounded-full mr-2 ${colors[index % colors.length]}`}
                                                    />
                                                    <span>{device}</span>
                                                    <span className="ml-2 text-muted-foreground">
                                                        {data.percentage}%
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Page Performance Tab Content */}
                    <TabsContent value="performance" className="space-y-6">
                        {/* Page Load Time Detail Chart */}
                        <Card className="rounded-md border-muted shadow-xs">
                            <CardContent className="p-6">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold">
                                        Page Load Time
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Detailed view of page load times over
                                        the selected period
                                    </p>
                                </div>

                                <div style={{ height: "350px" }}>
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart
                                            data={performanceData.pageLoadTime}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: 10,
                                                bottom: 25,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                                opacity={0.3}
                                            />

                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={formatXAxisTick}
                                                axisLine={false}
                                                tickLine={false}
                                                dy={10}
                                                tick={{ fontSize: 12 }}
                                            />

                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                width={60}
                                                tick={{ fontSize: 12 }}
                                                tickFormatter={(value) =>
                                                    `${value}s`
                                                }
                                                domain={[0, "dataMax + 0.5"]}
                                            />

                                            <Tooltip
                                                content={<PageLoadTooltip />}
                                            />

                                            <Line
                                                type="monotone"
                                                dataKey="loadTime"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={{
                                                    r: 6,
                                                    fill: "#3b82f6",
                                                }}
                                            />

                                            {/* Reference lines for performance benchmarks */}
                                            <ReferenceLine
                                                y={1.5}
                                                stroke="#10b981"
                                                strokeDasharray="3 3"
                                                label={{
                                                    value: "Excellent: 1.5s",
                                                    position:
                                                        "insideBottomRight",
                                                    fill: "#10b981",
                                                    fontSize: 12,
                                                }}
                                            />

                                            <ReferenceLine
                                                y={2.5}
                                                stroke="#f97316"
                                                strokeDasharray="3 3"
                                                label={{
                                                    value: "Good: 2.5s",
                                                    position: "insideTopRight",
                                                    fill: "#f97316",
                                                    fontSize: 12,
                                                }}
                                            />

                                            <ReferenceLine
                                                y={4}
                                                stroke="#ef4444"
                                                strokeDasharray="3 3"
                                                label={{
                                                    value: "Poor: 4s",
                                                    position: "insideTopRight",
                                                    fill: "#ef4444",
                                                    fontSize: 12,
                                                }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bounce Rate Detail Chart */}
                        <Card className="rounded-md border-muted shadow-xs">
                            <CardContent className="p-6">
                                <BounceRateChart
                                    data={performanceData.bounceRate}
                                    title="Bounce Rate Analysis"
                                    description="Detailed breakdown of bounce rates with industry benchmarks"
                                    height={350}
                                />
                            </CardContent>
                        </Card>

                        {/* Device Performance */}
                        <div className="mt-6">
                            <h3 className="mb-4 text-lg font-semibold">
                                Device Performance Metrics
                            </h3>
                            {performanceData &&
                            performanceData.devicePerformance &&
                            performanceData.devicePerformance.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {performanceData.devicePerformance.map(
                                        (device, index) => {
                                            if (!device) return null;

                                            const colors = [
                                                "bg-blue-500 border-blue-500 text-blue-500",
                                                "bg-orange-500 border-orange-500 text-orange-500",
                                                "bg-purple-500 border-purple-500 text-purple-500",
                                            ];
                                            const [bg, border, text] =
                                                colors[
                                                    index % colors.length
                                                ].split(" ");

                                            return (
                                                <Card
                                                    key={device.device}
                                                    className="rounded-md transition-shadow hover:shadow-md"
                                                >
                                                    <CardContent className="p-5">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <div className="flex items-center">
                                                                <div
                                                                    className={`mr-2 w-3 h-3 rounded-full ${bg}`}
                                                                ></div>
                                                                <h4
                                                                    className={`font-semibold ${text}`}
                                                                >
                                                                    {
                                                                        device.device
                                                                    }
                                                                </h4>
                                                            </div>
                                                            <span className="px-2 py-1 text-sm font-medium rounded-full bg-muted">
                                                                {
                                                                    device.percentage
                                                                }
                                                                % of traffic
                                                            </span>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                                                                <span className="flex items-center text-sm text-muted-foreground">
                                                                    <Clock className="h-3.5 w-3.5 mr-2 opacity-70" />
                                                                    Avg. Page
                                                                    Load
                                                                </span>
                                                                <span className="text-sm font-medium">
                                                                    {
                                                                        device.pageLoadTime
                                                                    }
                                                                    s
                                                                    {index >
                                                                        0 &&
                                                                        performanceData
                                                                            .devicePerformance?.[0]
                                                                            ?.pageLoadTime &&
                                                                        device.pageLoadTime >
                                                                            performanceData
                                                                                .devicePerformance[0]
                                                                                .pageLoadTime && (
                                                                            <span className="ml-2 text-amber-500">
                                                                                <ArrowUp className="inline w-3 h-3" />
                                                                                {(
                                                                                    device.pageLoadTime -
                                                                                    performanceData
                                                                                        .devicePerformance[0]
                                                                                        .pageLoadTime
                                                                                ).toFixed(
                                                                                    1,
                                                                                )}

                                                                                s
                                                                            </span>
                                                                        )}
                                                                </span>
                                                            </div>

                                                            <div className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                                                                <span className="flex items-center text-sm text-muted-foreground">
                                                                    <Zap className="h-3.5 w-3.5 mr-2 opacity-70" />
                                                                    Bounce Rate
                                                                </span>
                                                                <span
                                                                    className={`text-sm font-medium ${device.bounceRate > 40 ? "text-amber-600" : "text-green-600"}`}
                                                                >
                                                                    {
                                                                        device.bounceRate
                                                                    }
                                                                    %
                                                                </span>
                                                            </div>

                                                            <div className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                                                                <span className="flex items-center text-sm text-muted-foreground">
                                                                    <BarChart3 className="h-3.5 w-3.5 mr-2 opacity-70" />
                                                                    Conversion
                                                                    Rate
                                                                </span>
                                                                <span
                                                                    className={`text-sm font-medium ${device.conversionRate < 2 ? "text-amber-600" : "text-green-600"}`}
                                                                >
                                                                    {
                                                                        device.conversionRate
                                                                    }
                                                                    %
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        },
                                    )}
                                </div>
                            ) : (
                                <div className="p-8 text-center rounded-md border border-dashed">
                                    <p className="text-muted-foreground">
                                        No device performance data available.
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* SEO Metrics Tab Content */}
                    <TabsContent value="seo" className="space-y-6">
                        {/* Organic Traffic Chart */}
                        <Card className="rounded-md border-muted shadow-xs">
                            <CardContent className="p-6">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold">
                                        Organic Traffic Sources
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Breakdown of traffic by source over time
                                    </p>
                                </div>

                                <div style={{ height: "350px" }}>
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart
                                            data={seoData.searchVisits}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: 10,
                                                bottom: 25,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                                opacity={0.3}
                                            />

                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={formatXAxisTick}
                                                axisLine={false}
                                                tickLine={false}
                                                dy={10}
                                                tick={{ fontSize: 12 }}
                                            />

                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                width={60}
                                                tick={{ fontSize: 12 }}
                                                tickFormatter={(value) =>
                                                    value.toLocaleString()
                                                }
                                            />

                                            <Tooltip
                                                content={
                                                    <VisitorSourcesTooltip />
                                                }
                                            />
                                            <Legend />

                                            <Line
                                                type="monotone"
                                                dataKey="organic"
                                                name="Organic"
                                                stroke="#10b981"
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={{
                                                    r: 6,
                                                    fill: "#10b981",
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="direct"
                                                name="Direct"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={{
                                                    r: 6,
                                                    fill: "#3b82f6",
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="referral"
                                                name="Referral"
                                                stroke="#8b5cf6"
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={{
                                                    r: 6,
                                                    fill: "#8b5cf6",
                                                }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Search Keywords & Search Engines - 2 column grid */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Keywords Table */}
                            <Card className="rounded-md border-muted shadow-xs">
                                <CardContent className="p-6">
                                    <KeywordsTable
                                        data={seoData.keywords}
                                        title="Search Keywords"
                                        description="Keywords driving traffic to your site"
                                    />
                                </CardContent>
                            </Card>

                            {/* Search Engines Distribution */}
                            <Card className="rounded-md border-muted shadow-xs">
                                <CardContent className="p-6">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold">
                                            Search Engine Distribution
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Visits by search engine
                                        </p>
                                    </div>

                                    {seoData &&
                                    seoData.searchEngines &&
                                    seoData.searchEngines.length > 0 ? (
                                        <div style={{ height: "300px" }}>
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <BarChart
                                                    data={seoData.searchEngines}
                                                    margin={{
                                                        top: 10,
                                                        right: 10,
                                                        left: 10,
                                                        bottom: 25,
                                                    }}
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        vertical={false}
                                                        opacity={0.3}
                                                    />

                                                    <XAxis
                                                        dataKey="engine"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        dy={10}
                                                        tick={{ fontSize: 12 }}
                                                    />

                                                    <YAxis
                                                        axisLine={false}
                                                        tickLine={false}
                                                        width={60}
                                                        tick={{ fontSize: 12 }}
                                                        tickFormatter={(
                                                            value,
                                                        ) =>
                                                            value.toLocaleString()
                                                        }
                                                    />

                                                    <Tooltip
                                                        formatter={(
                                                            value: any,
                                                        ) => [
                                                            value.toLocaleString(),
                                                            "Visits",
                                                        ]}
                                                        labelFormatter={(
                                                            value,
                                                        ) =>
                                                            `Search Engine: ${value}`
                                                        }
                                                    />

                                                    <Bar
                                                        dataKey="visits"
                                                        name="Visits"
                                                        fill="#10b981"
                                                        radius={[4, 4, 0, 0]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex justify-center items-center rounded-md border border-dashed"
                                            style={{ height: "300px" }}
                                        >
                                            <p className="text-muted-foreground">
                                                No search engine data available.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Landing Pages Table */}
                        <Card className="rounded-md border-muted shadow-xs">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            Top Landing Pages
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Pages that users enter your site
                                            through
                                        </p>
                                    </div>
                                </div>

                                {seoData &&
                                seoData.landingPages &&
                                seoData.landingPages.length > 0 ? (
                                    <div className="rounded-md border">
                                        <table className="w-full">
                                            <thead className="bg-muted/50">
                                                <tr>
                                                    <th className="p-3 text-sm font-medium text-left">
                                                        Page
                                                    </th>
                                                    <th className="p-3 text-sm font-medium text-right">
                                                        Entrances
                                                    </th>
                                                    <th className="p-3 text-sm font-medium text-right">
                                                        Bounce Rate
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {seoData.landingPages.map(
                                                    (page, index) => (
                                                        <tr
                                                            key={index}
                                                            className="border-t"
                                                        >
                                                            <td className="p-3 text-sm">
                                                                <div className="flex items-center max-w-[220px]">
                                                                    <span
                                                                        className="truncate"
                                                                        title={
                                                                            page.url
                                                                        }
                                                                    >
                                                                        {
                                                                            page.url
                                                                        }
                                                                    </span>
                                                                    <a
                                                                        href={
                                                                            page.url
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex-shrink-0 ml-2 transition-colors text-muted-foreground hover:text-primary"
                                                                    >
                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                    </a>
                                                                </div>
                                                            </td>
                                                            <td className="p-3 text-sm text-right">
                                                                {page.entrances.toLocaleString()}
                                                            </td>
                                                            <td className="p-3 text-sm text-right">
                                                                <span
                                                                    className={
                                                                        page.bounceRate >
                                                                        40
                                                                            ? "text-amber-600"
                                                                            : "text-green-600"
                                                                    }
                                                                >
                                                                    {
                                                                        page.bounceRate
                                                                    }
                                                                    %
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center rounded-md border border-dashed">
                                        <p className="text-muted-foreground">
                                            No landing page data available.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AuthLayout>
    );
};

export default Index;
