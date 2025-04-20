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
import { Download, ExternalLink, ChevronRight } from "lucide-react";
import { TopReferrer as ReferrerData } from "@novus/types/analytics";

interface ReferrersTableProps {
    data: ReferrerData[];
    title: string;
    description?: string;
    showViewAll?: boolean;
    viewAllAction?: () => void;
    exportAction?: () => void;
}

const ReferrersTable = ({
    data,
    title,
    description,
    showViewAll = false,
    viewAllAction,
    exportAction,
}: ReferrersTableProps) => {
    // Format domain name for display
    const formatDomain = (url: string) => {
        try {
            // If it's a complete URL, parse it
            if (url.includes("http")) {
                const domain = new URL(url);
                return domain.hostname.replace("www.", "");
            }
            // If it's just a domain
            return url.replace("www.", "");
        } catch (e) {
            // If parsing fails, just return the original
            return url;
        }
    };

    const totalPageViews = data.reduce((sum, item) => sum + item.pageViews, 0);

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

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Source</TableHead>
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
                                            <span>
                                                {formatDomain(item.url)}
                                            </span>
                                            <a
                                                href={
                                                    item.url.includes("http")
                                                        ? item.url
                                                        : `https://${item.url}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-muted-foreground ml-2 transition-colors hover:text-primary"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </a>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {item.pageViews.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {(
                                            (item.pageViews / totalPageViews) *
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
                                    No referral data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {showViewAll && viewAllAction && (
                <div className="mt-4 text-right">
                    <Button variant="ghost" size="sm" onClick={viewAllAction}>
                        View all referrers
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ReferrersTable;
