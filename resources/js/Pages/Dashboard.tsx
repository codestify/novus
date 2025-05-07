import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthLayout from "@novus/Layouts/AuthLayout";
import { Card, CardContent } from "@novus/Components/ui/card";
import { Button } from "@novus/Components/ui/button";
import {
    ArrowRight,
    Bookmark,
    Clock,
    Edit,
    Eye,
    FileText,
    Image,
    TrendingUp,
    Users,
} from "lucide-react";
import { Badge } from "@novus/Components/ui/badge";
import useRoute from "@novus/hooks/useRoute";

type GrowthTrend = {
    current: number;
    previous: number;
    growth: number;
};

interface Props {
    postsStats: GrowthTrend;
    pageViewsStats: GrowthTrend;
    activeUsersStats: GrowthTrend;
    sessionDurationStats: GrowthTrend;
    posts: {
        id: number;
        title: string;
        slug: string;
        status: string;
        created_at: string;
        updated_at: string;
        image: string | null;
    }[];
}

interface StatsCardProps {
    title: string;
    value: string;
    description: string;
    currentValue?: number;
    previousValue?: number;
    comparisonPeriod?: string;
    icon: React.ReactNode;
    iconColor?: string;
    animate?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    description,
    currentValue,
    previousValue,
    icon,
    iconColor = "primary",
    animate = false,
}) => {
    // Calculate trend percentage dynamically
    const hasTrend =
        typeof currentValue !== "undefined" &&
        typeof previousValue !== "undefined" &&
        previousValue !== 0;

    let trendPercentage: number | null = null;
    let trendUp = false;

    if (hasTrend) {
        // Round to 1 decimal place immediately after calculation
        trendPercentage =
            Math.round(
                ((currentValue! - previousValue!) / previousValue!) * 1000,
            ) / 10;
        trendUp = trendPercentage >= 0;
    }

    // Format trend text - use the pre-rounded value
    const trendText = hasTrend
        ? `${trendUp ? "+" : ""}${Math.abs(trendPercentage!).toFixed(1)}%`
        : null;

    return (
        <Card
            className={`rounded-md border-muted shadow-sm ${
                animate
                    ? "transform transition-all hover:-translate-y-1 hover:shadow-md"
                    : ""
            }`}
        >
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="mb-1 text-sm font-medium text-muted-foreground">
                            {title}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold">{value}</h3>
                            {trendText && (
                                <span
                                    className={`text-xs flex items-center ${
                                        trendUp
                                            ? "text-green-600 dark:text-green-500"
                                            : "text-red-600 dark:text-red-500"
                                    }`}
                                    title={`Comparison to previous period`}
                                >
                                    <TrendingUp
                                        className={`h-3 w-3 mr-0.5 ${
                                            !trendUp && "rotate-180"
                                        }`}
                                    />
                                    <span className="font-medium">
                                        {trendText}
                                    </span>
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {description}
                        </p>
                    </div>
                    <div
                        className={`p-2 rounded-full bg-${iconColor}/10 text-${iconColor}`}
                    >
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function Dashboard({
    postsStats,
    pageViewsStats,
    activeUsersStats,
    sessionDurationStats,
    posts,
}: Props) {
    const route = useRoute();
    const formatNumber = (num: number): string => {
        return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();
    };

    // Format time in seconds to readable format
    const formatDuration = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    return (
        <>
            <Head title="Dashboard" />
            <AuthLayout>
                <div className="space-y-8 py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <section>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">
                                    Welcome back, Admin
                                </h2>
                                <p className="text-muted-foreground mt-1">
                                    Here's what's happening with your publishing
                                    platform today.
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-0 flex items-center">
                                <span className="text-sm font-medium text-muted-foreground mr-2">
                                    Last updated:
                                </span>
                                <Badge
                                    variant="outline"
                                    className="gap-1 pl-2 pr-3 py-1 h-7"
                                >
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                </Badge>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <StatsCard
                                title="Total Posts"
                                value={postsStats.current.toString()}
                                description="Total published posts"
                                currentValue={postsStats.current}
                                previousValue={postsStats.previous}
                                icon={<FileText className="h-5 w-5" />}
                                animate={true}
                            />
                            <StatsCard
                                title="Active Users"
                                value={activeUsersStats.current.toString()}
                                description="Currently browsing your site"
                                currentValue={activeUsersStats.current}
                                previousValue={activeUsersStats.previous}
                                icon={<Users className="h-5 w-5" />}
                                iconColor="green"
                                animate={true}
                            />
                            <StatsCard
                                title="Page Views"
                                value={formatNumber(pageViewsStats.current)}
                                description="Total views this month"
                                currentValue={pageViewsStats.current}
                                previousValue={pageViewsStats.previous}
                                icon={<Eye className="h-5 w-5" />}
                                iconColor="indigo"
                                animate={true}
                            />
                            <StatsCard
                                title="Avg. Session Duration"
                                value={formatDuration(
                                    sessionDurationStats.current,
                                )}
                                description="Time spent on your site"
                                currentValue={sessionDurationStats.current}
                                previousValue={sessionDurationStats.previous}
                                icon={<Clock className="h-5 w-5" />}
                                iconColor="orange"
                                animate={true}
                            />
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">
                                Popular Content
                            </h2>
                            <Link
                                href={route("novus.posts.index")}
                                className="text-sm font-medium text-primary hover:text-primary/80 flex items-center"
                            >
                                View All Posts
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </div>

                        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                            {posts.map((post, index) => (
                                <Card
                                    key={post.id}
                                    className="flex flex-col md:flex-row overflow-hidden"
                                >
                                    <div className="w-full md:w-1/3 h-48 md:h-auto">
                                        {post.image ? (
                                            // If there's an image, display it
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="h-full w-full object-cover rounded-l-lg"
                                            />
                                        ) : (
                                            // If no image, make the background take the full space
                                            <div className="h-full w-full bg-muted rounded-l-lg flex items-center justify-center">
                                                <div
                                                    className={`h-20 w-20 rounded-md ${index === 0 ? "bg-primary/20" : "bg-blue-500/20"} flex items-center justify-center ${index === 0 ? "text-primary" : "text-blue-500"}`}
                                                >
                                                    {index === 0 ? (
                                                        <Image className="h-10 w-10" />
                                                    ) : (
                                                        <Bookmark className="h-10 w-10" />
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-full md:w-2/3 p-6 flex flex-col">
                                        <h3 className="text-lg font-bold mb-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {index === 0
                                                ? "Learn how to build your first site with Novus, the powerful content management system built for modern developers."
                                                : "Discover the power of Novus themes and learn how to create a unique look for your website with these customization techniques."}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between">
                                            <Link
                                                href={route(
                                                    "novus.posts.edit",
                                                    { post },
                                                )}
                                                className="flex items-center text-sm font-medium text-primary hover:text-primary/80"
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>
            </AuthLayout>
        </>
    );
}
