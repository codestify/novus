import React from "react";
import { Search } from "lucide-react";
import { Button } from "@novus/Components/ui/button";
import { Input } from "@novus/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@novus/Components/ui/select";
import { MediaCollection } from "@novus/types/media";
import { fileTypeOptions } from "@novus/lib/media-helpers";

type MediaFiltersProps = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCollection: string;
    handleCollectionChange: (value: string) => void;
    selectedMimeType: string;
    handleMimeTypeChange: (value: string) => void;
    handleSearch: (e: React.FormEvent) => void;
    collections: MediaCollection[];
};

export function MediaFilters({
    searchQuery,
    setSearchQuery,
    selectedCollection,
    handleCollectionChange,
    selectedMimeType,
    handleMimeTypeChange,
    handleSearch,
    collections,
}: MediaFiltersProps) {
    return (
        <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search media..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button type="submit" variant="secondary">
                    Search
                </Button>
            </form>

            <div className="flex gap-2 justify-between sm:gap-4 sm:justify-end">
                <div className="flex-shrink-0">
                    <Select
                        value={selectedCollection}
                        onValueChange={handleCollectionChange}
                    >
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Collection" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Collections</SelectItem>
                            {collections.map((collection) => (
                                <SelectItem
                                    key={collection.name}
                                    value={collection.name}
                                >
                                    {collection.name} ({collection.count})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-shrink-0">
                    <Select
                        value={selectedMimeType}
                        onValueChange={handleMimeTypeChange}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="File Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {fileTypeOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
