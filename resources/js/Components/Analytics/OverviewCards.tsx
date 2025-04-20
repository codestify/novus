import React from "react";
import { Card, CardContent } from "@novus/Components/ui/card";
import { UserMetrics as UserMetricsData } from "@novus/types/analytics";
import {
    Clock,
    EyeIcon,
    TrendingDown,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react";

interface OverviewCardsProps {
    userMetrics: UserMetricsData;
    activeUsers: number;
}

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number | null;
    icon: React.ReactNode;
    trendColor?: string;
}

const StatCard = ({
    title,
    value,
    change,
    icon,
    trendColor = "text-green-500",
}: StatCardProps) => {
    return (
        <Card className="rounded-md border-muted shadow-xs">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="mb-1 text-sm font-medium text-muted-foreground">
                            {title}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold">{value}</h3>
                            {change !== undefined && change !== null && (
                                <span
                                    className={`text-xs flex items-center ${trendColor}`}
                                    title="Weekly comparison from previous period"
                                >
                                    {change >= 0 ? (
                                        <>
                                            <TrendingUp className="h-3 w-3 mr-0.5" />
                                            <span className="font-medium">
                                                +{change}%
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <TrendingDown className="h-3 w-3 mr-0.5" />
                                            <span className="font-medium">
                                                {change}%
                                            </span>
                                        </>
                                    )}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="p-2 rounded-full bg-primary/10">{icon}</div>
                </div>
            </CardContent>
        </Card>
    );
};

const OverviewCards = ({ userMetrics, activeUsers }: OverviewCardsProps) => {
    // Format session duration (convert seconds to readable format)
    const formatSessionDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}m ${remainingSeconds}s`;
    };

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Visitors"
                value={userMetrics.totalUsers.toLocaleString()}
                change={userMetrics.totalUsersChange}
                icon={<Users className="h-5 w-5 text-primary" />}
            />

            <StatCard
                title="Total Pageviews"
                value={(
                    userMetrics.sessions * userMetrics.pageviewsPerSession
                ).toLocaleString()}
                change={userMetrics.pageviewsPerSessionChange}
                icon={<EyeIcon className="h-5 w-5 text-primary" />}
            />

            <StatCard
                title="Session Duration"
                value={formatSessionDuration(userMetrics.avgSessionDuration)}
                change={userMetrics.avgSessionDurationChange}
                icon={<Clock className="h-5 w-5 text-primary" />}
                trendColor={
                    userMetrics.avgSessionDurationChange !== null &&
                    userMetrics.avgSessionDurationChange >= 0
                        ? "text-green-500"
                        : "text-red-500"
                }
            />

            <StatCard
                title="Active Now"
                value={activeUsers}
                icon={<Zap className="w-5 h-5 text-primary" />}
            />
        </div>
    );
};

export default OverviewCards;
