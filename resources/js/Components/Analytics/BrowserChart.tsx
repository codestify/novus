import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
} from "recharts";
import { TopBrowser as BrowserData } from "@novus/types/analytics";

interface BrowserChartProps {
    data: BrowserData[];
    title: string;
    description?: string;
    height?: number;
}

const COLORS = [
    "#3b82f6",
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#64748b",
];

const BrowserChart = ({
    data,
    title,
    description,
    height = 300,
}: BrowserChartProps) => {
    // Calculate total sessions
    const totalSessions = useMemo(() => {
        return data.reduce((sum, item) => sum + item.sessions, 0);
    }, [data]);

    // Calculate percentages for each browser
    const chartData = useMemo(() => {
        return data.map((item) => ({
            name: item.browser,
            value: item.sessions,
            percentage: ((item.sessions / totalSessions) * 100).toFixed(1),
        }));
    }, [data, totalSessions]);

    // Custom tooltip component for the chart
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const { name, value, percentage } = payload[0].payload;
            return (
                <div className="bg-background p-3 border rounded-lg shadow-sm">
                    <p className="font-medium">{name}</p>
                    <div className="mt-2 text-sm">
                        <p className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">
                                Sessions:
                            </span>
                            <span className="font-medium">
                                {value.toLocaleString()}
                            </span>
                        </p>
                        <p className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">
                                Share:
                            </span>
                            <span className="font-medium">{percentage}%</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    const renderLegend = (props: any) => {
        const { payload } = props;

        return (
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm pt-4">
                {payload.map((entry: any, index: number) => (
                    <div key={`item-${index}`} className="flex items-center">
                        <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span>
                            {entry.value} ({chartData[index].percentage}%)
                        </span>
                    </div>
                ))}
            </div>
        );
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
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={renderLegend} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BrowserChart;
