import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@novus/Components/ui/button";
import { Card } from "@novus/Components/ui/card";
import { Input } from "@novus/Components/ui/input";
import { Image, LinkIcon, Upload, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@novus/Components/ui/dialog";
import { FeaturedImageProps } from "@novus/types/post";
import { MediaSelection } from "@novus/types/media";
import { MediaSelector } from "@novus/Components/Media/MediaSelector";

const FeaturedImage = ({
    featuredImage,
    onChange,
    error,
}: FeaturedImageProps) => {
    // Use URL object references to avoid recreating them
    const objectUrlRef = useRef<string | null>(null);
    const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
    const [selectedMediaItem, setSelectedMediaItem] =
        useState<MediaSelection | null>(null);

    // Compute preview without extra state
    const preview = useMemo(() => {
        if (!featuredImage) {
            return null;
        }

        if (featuredImage instanceof File) {
            // Clean up previous URL if it exists
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
            }

            // Create new URL and store the reference
            objectUrlRef.current = URL.createObjectURL(featuredImage);
            return objectUrlRef.current;
        }

        if ("fromLibrary" in featuredImage) {
            return featuredImage.url;
        }

        return null;
    }, [featuredImage]);

    // Clean up URL objects when unmounting
    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, []);

    // Handle file upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onChange(e.target.files[0]);
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
                        <Upload className="h-10 w-10 mx-auto" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                        Drag & drop an image or select from the options below
                    </p>
                    <div className="flex gap-3">
                        <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="featured-image-upload"
                            onChange={handleImageChange}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
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
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

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
