import React from "react";
import { cn } from "@novus/lib/utils";
import { MediaItem } from "@novus/types/media";
import { MediaCard } from "./MediaCard";

type GridViewProps = {
    items: MediaItem[];
    selectedItems: number[];
    gridSize: "sm" | "md" | "lg";
    onSelect: (id: number) => void;
    onItemClick: (item: MediaItem) => void;
    recentlyUploadedIds?: number[];
};

export function GridView({
    items,
    selectedItems,
    gridSize,
    onSelect,
    onItemClick,
    recentlyUploadedIds = [],
}: GridViewProps) {
    // Grid size class mapping
    const gridSizeClass = {
        sm: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8",
        md: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5",
        lg: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    }[gridSize];

    return (
        <div className={cn("grid gap-4 p-4", gridSizeClass)}>
            {items.map((item) => (
                <MediaCard
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.includes(item.id)}
                    onSelect={onSelect}
                    onClick={onItemClick}
                    isNewlyUploaded={recentlyUploadedIds.includes(item.id)}
                />
            ))}
        </div>
    );
}
