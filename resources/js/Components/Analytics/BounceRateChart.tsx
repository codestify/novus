import React from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    TooltipProps,
} from "recharts";

// Define the BounceRateData interface
interface BounceRateData {
    date: string;
    bounceRate: number;
}

interface BounceRateChartProps {
    data: BounceRateData[];
    title: string;
    description?: string;
    height?: number;
}

// Add proper typing for the tooltip props
interface CustomTooltipProps extends TooltipProps<number, string> {
    active?: boolean;
    payload?: Array<{
        value: number;
        color: string;
    }>;
    label?: string;
}

const BounceRateChart: React.FC<BounceRateChartProps> = ({
    data,
    title,
    description,
    height = 300,
}) => {
    // Format date for display in chart tooltip
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    // Format X-axis ticks to display shorter date format
    const formatXAxisTick = (dateString: string) => {
        // For responsive display, show fewer x-axis labels on smaller screens
        const date = new Date(dateString);
        // Only show every nth date depending on the data length
        if (data.length > 30) {
            // For longer periods, show every 5th date
            const day = date.getDate();
            if (day % 5 !== 0) return "";
            return date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
            });
        } else if (data.length > 14) {
            // For medium periods, show every 3rd date
            const day = date.getDate();
            if (day % 3 !== 0) return "";
            return date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
            });
        }
        // For shorter periods, show all dates
        return date.toLocaleDateString("en-US", { day: "numeric" });
    };

    // Calculate average bounce rate
    const averageBounceRate = data.length
        ? data.reduce((sum, item) => sum + item.bounceRate, 0) / data.length
        : 0;

    // Custom tooltip component for the chart
    const CustomTooltip: React.FC<CustomTooltipProps> = ({
        active,
        payload,
        label,
    }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background p-3 border rounded-lg shadow-sm">
                    <p className="font-medium">{formatDate(label || "")}</p>
                    <div className="mt-2 space-y-1">
                        <p className="text-sm flex items-center">
                            <span className="w-3 h-3 bg-orange-500 inline-block mr-2 rounded-full"></span>
                            <span className="text-muted-foreground mr-2">
                                Bounce Rate:
                            </span>
                            <span className="font-medium">
                                {payload[0].value.toFixed(1)}%
                            </span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <div className="mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            <div style={{ height: `${height}px` }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
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
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                            width={50}
                            tick={{ fontSize: 12 }}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        {/* Reference line for average bounce rate */}
                        <ReferenceLine
                            y={averageBounceRate}
                            stroke="#6b7280"
                            strokeDasharray="3 3"
                            strokeWidth={2}
                            label={{
                                value: `Avg: ${averageBounceRate.toFixed(1)}%`,
                                position: "insideBottomRight",
                                fill: "#6b7280",
                                fontSize: 12,
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="bounceRate"
                            stroke="#f97316"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: "#f97316" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-2 text-xs text-center text-muted-foreground">
                Average Bounce Rate:{" "}
                <span className="font-medium">
                    {averageBounceRate.toFixed(1)}%
                </span>
            </div>
        </div>
    );
};

export default BounceRateChart;
