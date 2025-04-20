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
import { Calendar, RefreshCw } from "lucide-react";
import AuthLayout from "@novus/Layouts/AuthLayout";
import OverviewCards from "@novus/Components/Analytics/OverviewCards";
import VisitorChart from "@novus/Components/Analytics/VisitorChart";
import BrowserChart from "@novus/Components/Analytics/BrowserChart";
import ReferrersTable from "@novus/Components/Analytics/ReferrersTable";
import PagesTable from "@novus/Components/Analytics/PagesTable";
import useTypedPage from "@novus/Hooks/useTypePage";
import useRoute from "@novus/Hooks/useRoute";
import { formatDateWithDay } from "@novus/utils";

const Statistics = () => {
    const page = useTypedPage();
    const { periodOptions, analyticsData } = page.props;
    const [period, setPeriod] = useState<string>("30");
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const route = useRoute();

    // Calculate current period dates
    const currentPeriod = {
        start: formatDateWithDay(
            new Date(
                Date.now() - parseInt(period) * 24 * 60 * 60 * 1000,
            ).toISOString(),
        ),
        end: formatDateWithDay(new Date().toISOString()),
    };

    const handlePeriodChange = (value: string) => {
        setPeriod(value);
        router.get(
            route("novus.analytics"),
            { period: value },
            { preserveState: true, replace: true },
        );
    };

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

    return (
        <AuthLayout title="Your website statistics">
            <Head title="Statistics" />

            <div className="py-20 max-w-[1400px] mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Statistics
                            </h1>
                            <p className="mt-1 text-muted-foreground">
                                Overview of your website's traffic and visitor
                                statistics
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
                    <div className="flex items-center gap-2 px-4 py-3 mt-5 text-sm border rounded-md bg-muted/20 border-muted/30 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-primary/70" />
                            <span className="font-medium">Time period:</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-semibold text-foreground">
                                {currentPeriod.start}
                            </span>
                            <span className="mx-2">—</span>
                            <span className="font-semibold text-foreground">
                                {currentPeriod.end}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Key metrics overview cards */}
                <OverviewCards
                    userMetrics={analyticsData.userMetrics}
                    activeUsers={analyticsData.activeUsers}
                />

                {/* Main content */}
                <div className="mt-8 space-y-6">
                    {/* Visitors & Pageviews */}
                    <Card className="rounded-md border-muted shadow-xs">
                        <CardContent className="p-6">
                            <VisitorChart
                                data={analyticsData.visitorsAndPageViews}
                                title="Visitors & Pageviews"
                                description="Daily visitor and pageview trends"
                                height={400}
                            />
                        </CardContent>
                    </Card>

                    {/* Browser and Pages in a grid */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Browser Distribution */}
                        <Card className="rounded-md border-muted shadow-xs">
                            <CardContent className="p-6">
                                <BrowserChart
                                    data={analyticsData.topBrowsers}
                                    title="Browser Distribution"
                                    description="Sessions by browser"
                                />
                            </CardContent>
                        </Card>

                        {/* Top Pages */}
                        <Card className="rounded-md border-muted shadow-xs">
                            <CardContent className="p-6">
                                <PagesTable
                                    data={analyticsData.mostVisitedPages}
                                    title="Top Pages"
                                    description="Most visited pages on your site"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top Referrers */}
                    <Card className="rounded-md border-muted shadow-xs">
                        <CardContent className="p-6">
                            <ReferrersTable
                                data={analyticsData.topReferrers}
                                title="Top Referrers"
                                description="Where your visitors are coming from"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Statistics;
