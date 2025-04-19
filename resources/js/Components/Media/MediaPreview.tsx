import React from "react";
import { Badge } from "@novus/Components/ui/badge";
import { Button } from "@novus/Components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { MediaItem } from "@novus/types/media";
import {
    isImageType,
    getMediaIcon,
    formatFileSize,
} from "@novus/lib/media-helpers";

type MediaPreviewProps = {
    media: MediaItem;
    altText: string;
    title: string;
    onDelete: () => void;
    disabled?: boolean;
};

export function MediaPreview({
    media,
    altText,
    title,
    onDelete,
    disabled = false,
}: MediaPreviewProps) {
    return (
        <div className="space-y-5">
            {/* Media Preview */}
            <div className="overflow-hidden rounded-lg border bg-background">
                {isImageType(media.mime_type) ? (
                    <img
                        src={media.url}
                        alt={altText || media.name}
                        className="object-contain w-full h-auto max-h-[400px]"
                    />
                ) : (
                    <div className="flex flex-col justify-center items-center h-72 bg-muted/30">
                        {getMediaIcon(media.mime_type)}
                        <span className="mt-4 text-sm text-muted-foreground">
                            {media.mime_type.split("/")[1].toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            {/* File Info */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <div className="text-muted-foreground">Type:</div>
                <div className="font-medium">{media.mime_type}</div>

                <div className="text-muted-foreground">Size:</div>
                <div className="font-medium">{formatFileSize(media.size)}</div>

                {media.width && media.height && (
                    <>
                        <div className="text-muted-foreground">Dimensions:</div>
                        <div className="font-medium">
                            {media.width} × {media.height}px
                        </div>
                    </>
                )}

                <div className="text-muted-foreground">Collection:</div>
                <div>
                    <Badge variant="outline">{media.collection_name}</Badge>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-1">
                {isImageType(media.mime_type) && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                        disabled={disabled}
                    >
                        <a
                            href={media.url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Download className="mr-2 w-4 h-4" />
                            Download
                        </a>
                    </Button>
                )}

                <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 text-white"
                    onClick={onDelete}
                    disabled={disabled}
                >
                    <Trash2 className="mr-2 w-4 h-4" />
                    Delete
                </Button>
            </div>
        </div>
    );
}
