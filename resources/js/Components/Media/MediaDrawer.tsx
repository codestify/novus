import React from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@novus/Components/ui/drawer";
import { Button } from "@novus/Components/ui/button";
import { ScrollArea } from "@novus/Components/ui/scroll-area";
import { Save, X } from "lucide-react";
import { MediaCollection, MediaItem } from "@novus/types/media";
import { MediaPreview } from "./MediaPreview";
import { MediaForm } from "./MediaForm";

type MediaDrawerProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedMedia: MediaItem | null;
    collections: MediaCollection[];
    onUpdate: () => void;
    onDelete: () => void;
    formData: {
        name: string;
        alt_text: string;
        title: string;
        collection_name: string;
        custom_properties: Record<string, any>;
    };
    setData: (key: string, value: any) => void;
    processing: boolean;
    errors?: Record<string, string>;
};

export function MediaDrawer({
    isOpen,
    onOpenChange,
    selectedMedia,
    collections,
    onUpdate,
    onDelete,
    formData,
    setData,
    processing,
    errors = {},
}: MediaDrawerProps) {
    if (!selectedMedia) return null;

    const handleUpdate = () => {
        onUpdate();
    };

    return (
        <Drawer
            open={isOpen}
            onOpenChange={(open) => {
                // Prevent closing the drawer during processing
                if (processing && !open) return;
                onOpenChange(open);
            }}
        >
            <DrawerContent className="max-h-[95vh]">
                <div className="mx-auto w-full max-w-5xl flex flex-col h-[90vh]">
                    <DrawerHeader className="flex justify-between items-center">
                        <div>
                            <DrawerTitle>Media Details</DrawerTitle>
                            <DrawerDescription>
                                View and edit information for this media item
                            </DrawerDescription>
                        </div>
                        <DrawerClose asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                disabled={processing}
                            >
                                <X className="w-4 h-4" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </DrawerClose>
                    </DrawerHeader>

                    <div className="overflow-hidden flex-1">
                        <ScrollArea className="px-6 h-full">
                            <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-5">
                                {/* Preview */}
                                <div className="md:col-span-2">
                                    <MediaPreview
                                        media={selectedMedia}
                                        altText={formData.alt_text}
                                        title={formData.title}
                                        onDelete={onDelete}
                                        disabled={processing}
                                    />
                                </div>

                                {/* Edit Form */}
                                <div className="md:col-span-3">
                                    <MediaForm
                                        media={selectedMedia}
                                        collections={collections}
                                        formData={formData}
                                        setData={setData}
                                        errors={errors}
                                        disabled={processing}
                                    />
                                </div>
                            </div>
                        </ScrollArea>
                    </div>

                    <DrawerFooter className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="flex gap-2 justify-end">
                            <DrawerClose asChild>
                                <Button variant="outline" disabled={processing}>
                                    Close
                                </Button>
                            </DrawerClose>

                            <Button
                                onClick={handleUpdate}
                                disabled={processing}
                            >
                                <Save className="mr-2 w-4 h-4" />
                                {processing ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
