import React, { useState, useMemo } from "react";
import { Button } from "@novus/Components/ui/button";
import { Card } from "@novus/Components/ui/card";
import { Input } from "@novus/Components/ui/input";
import { Image, Upload, LinkIcon, X, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@novus/Components/ui/dialog";
import { FeaturedImageProps, MediaSelection } from "@novus/types/post";
import { MediaItem } from "@novus/types/media";
import { MediaSelector } from "@novus/Components/Media/MediaSelector";
import useRoute from "@novus/Hooks/useRoute";

const FeaturedImage: React.FC<FeaturedImageProps> = ({
    featuredImage,
    onChange,
    error,
}) => {
    const route = useRoute();
    const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
    const [selectedMediaItem, setSelectedMediaItem] =
        useState<MediaItem | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Compute preview URL from the current MediaSelection
    const preview = useMemo(() => {
        if (!featuredImage) {
            return null;
        }

        if (typeof featuredImage === "object" && "url" in featuredImage) {
            return featuredImage.url;
        }

        return null;
    }, [featuredImage]);

    // Upload file to media endpoint, then pass the media ID to onChange
    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];
        setUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("collection_name", "featured_image");

            const response = await fetch(route("novus.media.upload"), {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
                credentials: "same-origin",
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Upload failed",
                );
            }

            const selection: MediaSelection = {
                id: result.media.id,
                url: result.media.url || result.media.thumbnail_url,
                fromLibrary: true,
            };

            onChange(selection);
        } catch (err: any) {
            setUploadError(
                err.message || "Failed to upload image. Please try again.",
            );
        } finally {
            setUploading(false);
            // Reset file input so the same file can be re-selected
            e.target.value = "";
        }
    };

    // Confirm media selection
    const confirmMediaSelection = () => {
        if (selectedMediaItem) {
            const selection: MediaSelection = {
                id: selectedMediaItem.id,
                url: selectedMediaItem.url,
                fromLibrary: true,
            };
            onChange(selection);
            setMediaDialogOpen(false);
            setSelectedMediaItem(null);
        }
    };

    return (
        <Card className="rounded-md border border-muted shadow-xs bg-card p-5">
            <div className="flex items-center mb-3">
                <Image className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-lg font-semibold">Featured Image</h2>
            </div>

            {preview ? (
                <div className="mt-3 relative">
                    <img
                        src={preview}
                        alt="Featured preview"
                        className="w-full h-auto rounded-md object-cover aspect-video"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                        onClick={() => onChange(null)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="border border-dashed rounded-md p-6 mt-3 flex flex-col items-center justify-center">
                    <div className="text-primary mb-2">
                        {uploading ? (
                            <Loader2 className="h-10 w-10 mx-auto animate-spin" />
                        ) : (
                            <Upload className="h-10 w-10 mx-auto" />
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                        {uploading
                            ? "Uploading..."
                            : "Drag & drop an image or select from the options below"}
                    </p>
                    <div className="flex gap-3">
                        <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="featured-image-upload"
                            onChange={handleImageChange}
                            disabled={uploading}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={uploading}
                            onClick={() =>
                                document
                                    .getElementById("featured-image-upload")
                                    ?.click()
                            }
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={uploading}
                            onClick={() => setMediaDialogOpen(true)}
                        >
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Media Library
                        </Button>
                    </div>
                </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
                Recommended size: 1200×630 pixels
            </p>
            {(error || uploadError) && (
                <div className="text-red-500 text-sm mt-1">
                    {error || uploadError}
                </div>
            )}

            <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
                <DialogContent className="max-w-4xl h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Select Featured Image</DialogTitle>
                    </DialogHeader>

                    <div className="h-[calc(80vh-10rem)] overflow-hidden">
                        <MediaSelector
                            onSelect={setSelectedMediaItem}
                            selectedId={selectedMediaItem?.id}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setMediaDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmMediaSelection}
                            disabled={!selectedMediaItem}
                        >
                            Select Image
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default FeaturedImage;
