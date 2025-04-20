import React from "react";
import { CheckSquare, Plus } from "lucide-react";
import { Button } from "@novus/Components/ui/button";
import { cn } from "@novus/lib/utils";
import { MediaItem } from "@novus/types/media";
import { isImageType, formatFileSize } from "@novus/lib/media-helpers";

type MediaCardProps = {
    item: MediaItem;
    isSelected: boolean;
    onSelect: (id: number) => void;
    onClick: (item: MediaItem) => void;
    isNewlyUploaded?: boolean;
};

export function MediaCard({
    item,
    isSelected,
    onSelect,
    onClick,
    isNewlyUploaded = false,
}: MediaCardProps) {
    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-md border bg-background transition-all hover:shadow-sm cursor-pointer",
                isSelected && "ring-2 ring-primary",
                isNewlyUploaded && "ring-2 ring-green-500 animate-pulse",
            )}
        >
            <div className="absolute top-2 left-2 z-10">
                <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                        "w-7 h-7 backdrop-blur-sm bg-background/80",
                        isSelected
                            ? "border-primary text-primary"
                            : "border-transparent opacity-0 group-hover:opacity-100",
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(item.id);
                    }}
                >
                    {isSelected ? (
                        <CheckSquare className="w-4 h-4" />
                    ) : (
                        <Plus className="w-4 h-4" />
                    )}
                </Button>
            </div>

            <div
                className="overflow-hidden relative cursor-pointer aspect-square"
                onClick={() => onClick(item)}
            >
                {isImageType(item.mime_type) ? (
                    <img
                        src={item.thumbnail_url}
                        alt={item.alt_text || item.name}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex justify-center items-center w-full h-full bg-muted/30">
                        <div className="text-muted-foreground">Image</div>
                    </div>
                )}

                {/* New upload badge */}
                {isNewlyUploaded && (
                    <div className="absolute top-0 right-0 px-2 py-1 text-xs text-white bg-green-500 rounded-bl-md">
                        New
                    </div>
                )}
            </div>

            <div className="px-2 py-3">
                <div className="text-sm font-medium truncate">{item.name}</div>
                <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                        {formatFileSize(item.size)}
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick(item);
                        }}
                        className="text-xs opacity-0 transition-opacity text-primary group-hover:opacity-100"
                    >
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
}
