import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@novus/Components/ui/table";
import { Button } from "@novus/Components/ui/button";
import { Download, Search, ChevronRight } from "lucide-react";
import { KeywordData } from "@novus/types/analytics";

interface KeywordsTableProps {
    data: KeywordData[];
    title: string;
    description?: string;
    showViewAll?: boolean;
    viewAllAction?: () => void;
    exportAction?: () => void;
}

const KeywordsTable = ({
    data,
    title,
    description,
    showViewAll = false,
    viewAllAction,
    exportAction,
}: KeywordsTableProps) => {
    // Calculate total sessions
    const totalSessions = data.reduce((sum, item) => sum + item.sessions, 0);

    // Check if we have "(not provided)" or similar keywords that indicate data limitations
    const hasLimitedData = data.some(
        (item) =>
            item.keyword.toLowerCase().includes("(not provided)") ||
            item.keyword.toLowerCase().includes("(not set)"),
    );

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

            {hasLimitedData && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700">
                    <p>
                        Some keyword data may appear as "(not provided)" due to
                        search engine privacy policies. This is normal and
                        affects all websites using Google Analytics.
                    </p>
                </div>
            )}

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Keyword</TableHead>
                            <TableHead className="text-right">
                                Sessions
                            </TableHead>
                            <TableHead className="text-right">
                                % of Total
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center">
                                            <Search className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                            <span
                                                className={
                                                    item.keyword.includes(
                                                        "(not",
                                                    )
                                                        ? "text-muted-foreground italic"
                                                        : ""
                                                }
                                            >
                                                {item.keyword}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {item.sessions.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {(
                                            (item.sessions / totalSessions) *
                                            100
                                        ).toFixed(1)}
                                        %
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={3}
                                    className="text-center py-6 text-muted-foreground"
                                >
                                    No keyword data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {showViewAll && viewAllAction && (
                <div className="mt-4 text-right">
                    <Button variant="ghost" size="sm" onClick={viewAllAction}>
                        View all keywords
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default KeywordsTable;
