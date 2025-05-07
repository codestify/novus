import React from "react";
import { LayoutGrid, LayoutList, Filter, Search, X } from "lucide-react";
import { Input } from "@novus/Components/ui/input";
import { Button } from "@novus/Components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@novus/Components/ui/select";
import { Badge } from "@novus/Components/ui/badge";
import { PostListItem } from "@novus/types/post";
import useTypedPage from "@novus/hooks/useTypePage";

interface PostsFiltersProps {
    viewMode: "list" | "grid";
    setViewMode: (mode: "list" | "grid") => void;
    selectedPosts: number[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: string;
    handleSearch: (e: React.FormEvent) => void;
    handleFilterChange: (status: string) => void;
    handleBulkAction: (action: string) => void;
    total: number;
}

export default function PostsFilters({
    viewMode,
    setViewMode,
    selectedPosts,
    searchQuery,
    setSearchQuery,
    statusFilter,
    handleSearch,
    handleFilterChange,
    handleBulkAction,
    total,
}: PostsFiltersProps) {
    const { post_counts } = useTypedPage().props;
    const { published, drafts, scheduled, archived } = post_counts;

    return (
        <div className="p-4 mb-6 rounded-md border border-muted bg-card shadow-xs">
            <div className="flex flex-col gap-4 justify-between mb-4 sm:flex-row sm:items-center">
                {/* Post Counts */}
                <div className="overflow-x-auto flex-shrink-0 pb-2 sm:pb-0">
                    <div className="flex items-center space-x-4 text-sm">
                        <Badge
                            variant={
                                statusFilter === "all" ? "default" : "outline"
                            }
                            className="cursor-pointer hover:bg-primary/90 hover:text-muted transition-colors"
                            onClick={() => handleFilterChange("all")}
                        >
                            All{" "}
                            <span className="ml-1 font-semibold">{total}</span>
                        </Badge>
                        <Badge
                            variant={
                                statusFilter === "published"
                                    ? "default"
                                    : "outline"
                            }
                            className="cursor-pointer hover:bg-primary/90 hover:text-muted transition-colors"
                            onClick={() => handleFilterChange("published")}
                        >
                            Published{" "}
                            <span className="ml-1 font-semibold">
                                {published}
                            </span>
                        </Badge>
                        <Badge
                            variant={
                                statusFilter === "draft" ? "default" : "outline"
                            }
                            className="cursor-pointer hover:bg-primary/90 hover:text-muted transition-colors"
                            onClick={() => handleFilterChange("draft")}
                        >
                            Drafts{" "}
                            <span className="ml-1 font-semibold">{drafts}</span>
                        </Badge>
                        <Badge
                            variant={
                                statusFilter === "scheduled"
                                    ? "default"
                                    : "outline"
                            }
                            className="cursor-pointer hover:bg-primary/90 hover:text-muted transition-colors"
                            onClick={() => handleFilterChange("scheduled")}
                        >
                            Scheduled{" "}
                            <span className="ml-1 font-semibold">
                                {scheduled}
                            </span>
                        </Badge>
                        {archived > 0 && (
                            <Badge
                                variant={
                                    statusFilter === "archived"
                                        ? "default"
                                        : "outline"
                                }
                                className="cursor-pointer hover:bg-primary/90 hover:text-muted transition-colors"
                                onClick={() => handleFilterChange("archived")}
                            >
                                Archived{" "}
                                <span className="ml-1 font-semibold">
                                    {archived}
                                </span>
                            </Badge>
                        )}
                    </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center">
                    <div className="flex p-1 rounded-md bg-muted">
                        <Button
                            variant={
                                viewMode === "list" ? "secondary" : "ghost"
                            }
                            size="sm"
                            className="p-0 w-8 h-8"
                            onClick={() => setViewMode("list")}
                            aria-label="List view"
                            title="List view"
                        >
                            <LayoutList className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={
                                viewMode === "grid" ? "secondary" : "ghost"
                            }
                            size="sm"
                            className="p-0 w-8 h-8"
                            onClick={() => setViewMode("grid")}
                            aria-label="Grid view"
                            title="Grid view"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <form
                onSubmit={handleSearch}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:pt-5"
            >
                {/* Search Bar with Button */}
                <div className="relative flex-1 max-w-lg flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 pr-10 focus-visible:ring-primary/30"
                        />
                        {searchQuery && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                                onClick={() => setSearchQuery("")}
                            >
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>
                    <Button
                        type="submit"
                        size="lg"
                        className="flex items-center gap-1 whitespace-nowrap"
                    >
                        <Search className="w-3.5 h-3.5" />
                        <span>Search</span>
                    </Button>
                </div>

                <div className="flex gap-2 ml-auto">
                    {/* Status Filter */}
                    <div className="w-40 flex-shrink-0">
                        <Select
                            value={statusFilter}
                            onValueChange={handleFilterChange}
                        >
                            <SelectTrigger className="h-10 bg-background">
                                <Filter className="mr-2 w-4 h-4" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="published">
                                    Published
                                </SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="scheduled">
                                    Scheduled
                                </SelectItem>
                                <SelectItem value="archived">
                                    Archived
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Bulk Actions (only visible when posts are selected) */}
                    {selectedPosts.length > 0 && (
                        <div className="w-48 flex-shrink-0">
                            <Select onValueChange={handleBulkAction}>
                                <SelectTrigger className="h-10 bg-background border-primary/20 text-primary">
                                    <SelectValue
                                        placeholder={`${selectedPosts.length} selected`}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="publish">
                                        Publish Selected
                                    </SelectItem>
                                    <SelectItem value="draft">
                                        Move to Draft
                                    </SelectItem>
                                    <SelectItem value="feature">
                                        Feature Posts
                                    </SelectItem>
                                    <SelectItem value="unfeature">
                                        Unfeature Posts
                                    </SelectItem>
                                    <SelectItem
                                        value="delete"
                                        className="text-destructive"
                                    >
                                        Delete Selected
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
