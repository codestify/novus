import React from "react";
import { Image, Upload } from "lucide-react";
import { Card, CardContent, CardFooter } from "@novus/Components/ui/card";
import { Button } from "@novus/Components/ui/button";
import useRoute from "@novus/hooks/useRoute";
import { router } from "@inertiajs/react";
import { MediaItem, PaginationData } from "@novus/types/media";
import { GridView } from "./GridView";
import { ListView } from "./ListView";
import { EmptyState } from "@novus/Components/EmptyState";

type MediaDisplayProps = {
    media: PaginationData & {
        data: MediaItem[];
    };
    viewMode: "grid" | "list";
    gridSize: "sm" | "md" | "lg";
    selectedItems: number[];
    toggleItemSelection: (id: number) => void;
    handleMediaClick: (media: MediaItem) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCollection: string;
    setSelectedCollection: (collection: string) => void;
    selectedMimeType: string;
    setSelectedMimeType: (mimeType: string) => void;
    onUploadClick: () => void;
    recentlyUploadedIds?: number[];
};

export function MediaDisplay({
    media,
    viewMode,
    gridSize,
    selectedItems,
    toggleItemSelection,
    handleMediaClick,
    searchQuery,
    setSearchQuery,
    selectedCollection,
    setSelectedCollection,
    selectedMimeType,
    setSelectedMimeType,
    onUploadClick,
    recentlyUploadedIds = [],
}: MediaDisplayProps) {
    const route = useRoute();

    const handlePaginationChange = (page: number) => {
        router.get(
            route("novus.media.index", { page }),
            {
                search: searchQuery || undefined,
                collection:
                    selectedCollection !== "all"
                        ? selectedCollection
                        : undefined,
                mime_type:
                    selectedMimeType !== "all" ? selectedMimeType : undefined,
            },
            { preserveState: true },
        );
    };

    return (
        <Card className="overflow-hidden rounded-t-none border-t-0 min-h-[500px] shadow-xs border-muted">
            <CardContent className="p-0">
                {media.data.length > 0 ? (
                    viewMode === "grid" ? (
                        <GridView
                            items={media.data}
                            selectedItems={selectedItems}
                            gridSize={gridSize}
                            onSelect={toggleItemSelection}
                            onItemClick={handleMediaClick}
                            recentlyUploadedIds={recentlyUploadedIds}
                        />
                    ) : (
                        <ListView
                            items={media.data}
                            selectedItems={selectedItems}
                            onSelect={toggleItemSelection}
                            onItemClick={handleMediaClick}
                        />
                    )
                ) : (
                    <EmptyState
                        icon={<Image className="w-10 h-10" />}
                        title="No images found"
                        description={
                            searchQuery
                                ? "No images match your search criteria. Try different keywords or filters."
                                : "Upload your first image to get started."
                        }
                        action={
                            searchQuery ? (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCollection("all");
                                        setSelectedMimeType("all");
                                        router.get(route("novus.media.index"));
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            ) : (
                                <Button onClick={onUploadClick}>
                                    <Upload className="mr-2 w-4 h-4" />
                                    Upload Images
                                </Button>
                            )
                        }
                        className="py-20"
                    />
                )}
            </CardContent>

            {/* Pagination */}
            {media.data.length > 0 && media.last_page > 1 && (
                <CardFooter className="flex justify-between items-center p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="font-medium">{media.from}</span> to{" "}
                        <span className="font-medium">{media.to}</span> of{" "}
                        <span className="font-medium">{media.total}</span> items
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={media.current_page === 1}
                            onClick={() =>
                                handlePaginationChange(media.current_page - 1)
                            }
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={media.current_page === media.last_page}
                            onClick={() =>
                                handlePaginationChange(media.current_page + 1)
                            }
                        >
                            Next
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
