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
import { MostVisitedPage as PageData } from "@novus/types/analytics";

interface PagesTableProps {
    data: PageData[];
    title: string;
    description?: string;
    showViewAll?: boolean;
    viewAllAction?: () => void;
    exportAction?: () => void;
    fullWidth?: boolean;
}

const PagesTable: React.FC<PagesTableProps> = ({
    data,
    title,
    description,
    showViewAll = false,
    viewAllAction,
    exportAction,
    fullWidth = false,
}) => {
    // Format URL for display
    const formatUrl = (url: string) => {
        // Handle empty URLs
        if (!url) return "/";

        // Remove trailing slashes except for the root URL
        if (url !== "/" && url.endsWith("/")) {
            url = url.slice(0, -1);
        }

        // Remove query parameters
        if (url.includes("?")) {
            url = url.split("?")[0];
        }

        return url;
    };

    // Get shortened page title for display
    const getPageTitle = (url: string, pageTitle?: string) => {
        if (pageTitle && pageTitle !== "") return pageTitle;

        // Extract the last part of the URL path as the title
        const pathParts = url.split("/");
        const lastPart = pathParts[pathParts.length - 1];

        // If it's the root or empty, return "Homepage"
        if (!lastPart || lastPart === "") {
            return "Homepage";
        }

        // Convert slug to title case
        return lastPart
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    // Calculate total pageviews
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
                            <TableHead className={fullWidth ? "w-[60%]" : ""}>
                                Page
                            </TableHead>
                            {fullWidth && <TableHead>Title</TableHead>}
                            <TableHead className="text-right">Views</TableHead>
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
                                            <span
                                                className="truncate max-w-[250px]"
                                                title={item.url}
                                            >
                                                {formatUrl(item.url)}
                                            </span>
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-muted-foreground ml-2 transition-colors hover:text-primary flex-shrink-0"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </a>
                                        </div>
                                    </TableCell>
                                    {fullWidth && (
                                        <TableCell className="max-w-[250px] truncate">
                                            {item.pageTitle ||
                                                getPageTitle(item.url)}
                                        </TableCell>
                                    )}
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
                                    colSpan={fullWidth ? 4 : 3}
                                    className="text-center py-6 text-muted-foreground"
                                >
                                    No page data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {showViewAll && viewAllAction && (
                <div className="mt-4 text-right">
                    <Button variant="ghost" size="sm" onClick={viewAllAction}>
                        View all pages
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default PagesTable;
