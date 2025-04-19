// resources/js/Components/Subscribers/SubscriberFilters.tsx
import React from "react";
import { Button } from "@novus/Components/ui/button";
import { Input } from "@novus/Components/ui/input";
import { Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@novus/Components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@novus/Components/ui/dropdown-menu";

interface SubscriberFiltersProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    statusFilter: string;
    handleStatusFilterChange: (value: string) => void;
    handleSearch: (e: React.FormEvent) => void;
    selectedSubscribers: number[];
    handleBulkAction: (action: string) => void;
    total: number;
}

const SubscriberFilters: React.FC<SubscriberFiltersProps> = ({
    searchQuery,
    setSearchQuery,
    statusFilter,
    handleStatusFilterChange,
    handleSearch,
    selectedSubscribers,
    handleBulkAction,
    total,
}) => {
    return (
        <div className="px-6 pb-6 border-b">
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <form
                    onSubmit={handleSearch}
                    className="flex flex-grow gap-2 items-center max-w-md"
                >
                    <div className="relative flex-grow">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search subscribers..."
                            className="pl-8 h-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        type="submit"
                        size="sm"
                        variant="default"
                        className="h-9"
                    >
                        Search
                    </Button>
                </form>

                <div className="flex gap-2 items-center">
                    <Select
                        value={statusFilter}
                        onValueChange={handleStatusFilterChange}
                    >
                        <SelectTrigger className="w-[160px] h-9">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="unsubscribed">
                                Unsubscribed
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {selectedSubscribers.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 h-9"
                                >
                                    <span>Bulk Actions</span>
                                    <span className="ml-1 rounded-full bg-primary w-5 h-5 text-[11px] text-primary-foreground flex items-center justify-center">
                                        {selectedSubscribers.length}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-[200px]"
                            >
                                <DropdownMenuItem
                                    onClick={() => handleBulkAction("activate")}
                                >
                                    Set Active
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleBulkAction("deactivate")
                                    }
                                >
                                    Set Inactive
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => handleBulkAction("delete")}
                                    className="text-destructive"
                                >
                                    Delete Selected
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriberFilters;
