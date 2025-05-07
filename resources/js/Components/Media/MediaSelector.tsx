import React, { useEffect, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@novus/Components/ui/input";
import { Button } from "@novus/Components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@novus/Components/ui/tabs";
import { Card } from "@novus/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@novus/Components/ui/select";
import { MediaItem, MediaSelection } from "@novus/types/media";
import { cn } from "@novus/lib/utils";
import useRoute from "@novus/hooks/useRoute";
import { ScrollArea } from "@novus/Components/ui/scroll-area";

interface MediaSelectorProps {
    onSelect: (media: MediaSelection) => void;
    selectedId?: number | null;
}

export const MediaSelector: React.FC<MediaSelectorProps> = ({
    onSelect,
    selectedId,
}) => {
    const route = useRoute();
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [collections, setCollections] = useState<string[]>([]);
    const [selectedCollection, setSelectedCollection] = useState("all");

    // Media data state
    const [media, setMedia] = useState<{
        data: MediaItem[];
        current_page: number;
        last_page: number;
        total: number;
    }>({
        data: [],
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    const [isLoading, setIsLoading] = useState(true);

    // Load media data
    const fetchMedia = async (page = 1, searchParams = {}) => {
        setIsLoading(true);
        try {
            const params = {
                page,
                search: searchQuery,
                collection:
                    selectedCollection !== "all"
                        ? selectedCollection
                        : undefined,
                filter: activeTab === "recent" ? "recent" : "all",
                ...searchParams,
            };

            const response = await fetch(route("novus.media.selector", params));
            const data = await response.json();
            setMedia(data);

            // Extract collections from the first page only
            if (page === 1 && !collections.length) {
                const uniqueCollections = [
                    ...new Set(
                        data.data
                            .map((item: MediaItem) => item.collection_name)
                            .filter(Boolean) as string[],
                    ),
                ];
                setCollections(uniqueCollections);
            }
        } catch (error) {
            // Error fetching media
        } finally {
            setIsLoading(false);
        }
    };

    // // Initial load
    useEffect(() => {
        void fetchMedia();
    }, []);

    // Handle tab change
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        void fetchMedia(1, { filter: value === "recent" ? "recent" : "all" });
    };

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        fetchMedia(1, { search: searchQuery }).finally(() => {
            setIsSearching(false);
        });
    };

    // Handle collection change
    const handleCollectionChange = (value: string) => {
        setSelectedCollection(value);
        void fetchMedia(1, { collection: value !== "all" ? value : undefined });
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        void fetchMedia(page);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex gap-3 items-center mb-4">
                <div className="relative flex-1">
                    <form onSubmit={handleSearch}>
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search media..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                        {searchQuery && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-0 right-0 w-9 h-9"
                                onClick={() => {
                                    setSearchQuery("");
                                    void fetchMedia(1, { search: "" });
                                }}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </form>
                </div>

                <Select
                    value={selectedCollection}
                    onValueChange={handleCollectionChange}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All collections" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All collections</SelectItem>
                        {collections.map((collection) => (
                            <SelectItem key={collection} value={collection}>
                                {collection}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="flex flex-col flex-1"
            >
                <TabsList>
                    <TabsTrigger value="all">All Media</TabsTrigger>
                    <TabsTrigger value="recent">Recently Uploaded</TabsTrigger>
                </TabsList>

                <div className="relative flex-1 mt-4">
                    {isLoading && (
                        <div className="flex absolute inset-0 z-10 justify-center items-center bg-background/50">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    )}

                    <ScrollArea className="h-[calc(100%-2rem)]">
                        {media.data.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 p-2 sm:grid-cols-3 lg:grid-cols-4">
                                {media.data.map((item) => (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            "relative p-0.5 transition-all duration-200",
                                            selectedId === item.id
                                                ? "z-10"
                                                : "",
                                        )}
                                    >
                                        <Card
                                            className={cn(
                                                "cursor-pointer overflow-hidden transition-all duration-150 border border-border",
                                                selectedId === item.id
                                                    ? "ring-2 ring-primary border-primary shadow-md"
                                                    : "hover:shadow-md hover:border-primary/20",
                                            )}
                                            onClick={() =>
                                                onSelect(item as MediaSelection)
                                            }
                                        >
                                            <div className="relative aspect-square bg-muted/50">
                                                <img
                                                    src={item.thumbnail_url}
                                                    alt={item.name}
                                                    className="object-cover w-full h-full"
                                                />
                                                {selectedId === item.id && (
                                                    <div className="flex absolute inset-0 justify-center items-center bg-primary/20 dark:bg-primary/30">
                                                        <div className="flex justify-center items-center w-8 h-8 text-white rounded-full shadow-md bg-primary">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="3"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="w-4 h-4"
                                                            >
                                                                <polyline points="20 6 9 17 4 12"></polyline>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className={cn(
                                                    "p-2 text-sm truncate",
                                                    selectedId === item.id
                                                        ? "bg-primary/5 dark:bg-primary/10 font-medium"
                                                        : "",
                                                )}
                                            >
                                                {item.name}
                                            </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center items-center h-64">
                                <div className="mb-2 text-muted-foreground">
                                    No media found
                                </div>
                                {searchQuery && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSearchQuery("");
                                            void fetchMedia(1, { search: "" });
                                        }}
                                    >
                                        Clear search
                                    </Button>
                                )}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                {media.last_page > 1 && (
                    <div className="flex gap-1 justify-center mt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={media.current_page === 1}
                            onClick={() =>
                                handlePageChange(media.current_page - 1)
                            }
                        >
                            Previous
                        </Button>
                        <span className="px-2 py-1 text-sm">
                            Page {media.current_page} of {media.last_page}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={media.current_page === media.last_page}
                            onClick={() =>
                                handlePageChange(media.current_page + 1)
                            }
                        >
                            Next
                        </Button>
                    </div>
                )}
            </Tabs>
        </div>
    );
};
