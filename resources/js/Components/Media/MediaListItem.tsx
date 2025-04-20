import React from "react";
import { Check } from "lucide-react";
import { Button } from "@novus/Components/ui/button";
import { Badge } from "@novus/Components/ui/badge";
import { cn } from "@novus/lib/utils";
import { MediaItem } from "@novus/types/media";
import {
    isImageType,
    getMediaIcon,
    formatFileSize,
} from "@novus/lib/media-helpers";

type MediaListItemProps = {
    item: MediaItem;
    isSelected: boolean;
    onSelect: (id: number) => void;
    onClick: (item: MediaItem) => void;
};

export function MediaListItem({
    item,
    isSelected,
    onSelect,
    onClick,
}: MediaListItemProps) {
    return (
        <div
            className={cn(
                "group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/30",
                isSelected && "bg-primary/5",
            )}
        >
            <div>
                <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                        "w-6 h-6",
                        isSelected
                            ? "border-primary text-primary"
                            : "border-muted",
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(item.id);
                    }}
                >
                    {isSelected && <Check className="w-3 h-3" />}
                </Button>
            </div>

            <div className="overflow-hidden flex-shrink-0 w-14 h-14 rounded">
                {isImageType(item.mime_type) ? (
                    <img
                        src={item.thumbnail_url}
                        alt={item.alt_text || item.name}
                        className="object-cover w-full h-full"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex justify-center items-center w-full h-full bg-muted/30">
                        {getMediaIcon(item.mime_type)}
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{item.name}</div>
                <div className="flex gap-3 items-center text-xs text-muted-foreground">
                    <span>{formatFileSize(item.size)}</span>
                    {item.width && item.height && (
                        <span>
                            {item.width} × {item.height}
                        </span>
                    )}
                    <span>
                        {new Date(item.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className="flex gap-2 items-center">
                <Badge variant="outline" className="font-normal">
                    {item.collection_name}
                </Badge>

                <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-8"
                    onClick={() => onClick(item)}
                >
                    Edit
                </Button>
            </div>
        </div>
    );
}
