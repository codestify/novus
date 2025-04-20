import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { Button } from "@novus/Components/ui/button";
import { Download } from "lucide-react";
import { VisitorsAndPageViewsItem as VisitorPageViewData } from "@novus/types/analytics";
import { formatDate, formatXAxisTick } from "@novus/utils";

interface VisitorChartProps {
    data: VisitorPageViewData[];
    title: string;
    description?: string;
    height?: number;
    exportAction?: () => void;
}

const VisitorChart = ({
    data,
    title,
    description,
    height = 300,
    exportAction,
}: VisitorChartProps) => {
    // Custom tooltip component for the chart
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background p-3 border rounded-lg shadow-sm">
                    <p className="font-medium">{formatDate(label)}</p>
                    <div className="mt-2 space-y-1">
                        <p className="text-sm flex items-center">
                            <span className="w-3 h-3 bg-blue-500 inline-block mr-2 rounded-full"></span>
                            <span className="text-muted-foreground mr-2">
                                Visitors:
                            </span>
                            <span className="font-medium">
                                {payload[0].value.toLocaleString()}
                            </span>
                        </p>
                        <p className="text-sm flex items-center">
                            <span className="w-3 h-3 bg-green-500 inline-block mr-2 rounded-full"></span>
                            <span className="text-muted-foreground mr-2">
                                Pageviews:
                            </span>
                            <span className="font-medium">
                                {payload[1].value.toLocaleString()}
                            </span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    const getMaxValue = () => {
        const maxVisitors = Math.max(...data.map((item) => item.visitors));
        const maxPageViews = Math.max(...data.map((item) => item.pageViews));
        const maxValue = Math.max(maxVisitors, maxPageViews);
        // Round up to next nice number for better y-axis display
        return Math.ceil((maxValue * 1.1) / 100) * 100;
    };

    return (
        <div>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                {exportAction && (
                    <Button variant="outline" size="sm" onClick={exportAction}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                )}
            </div>

            <div style={{ height: `${height}px` }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
                    >
                        <defs>
                            <linearGradient
                                id="colorVisitors"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient
                                id="colorPageViews"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#10b981"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#10b981"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

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
                            domain={[0, getMaxValue()]}
                            tickFormatter={(value) => value.toLocaleString()}
                            width={60}
                            tick={{ fontSize: 12 }}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Legend
                            wrapperStyle={{
                                paddingTop: 20,
                                fontSize: "14px",
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="visitors"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorVisitors)"
                            name="Visitors"
                            activeDot={{ r: 6 }}
                        />

                        <Area
                            type="monotone"
                            dataKey="pageViews"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPageViews)"
                            name="Pageviews"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default VisitorChart;
