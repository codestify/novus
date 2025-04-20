import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import useRoute from "@novus/Hooks/useRoute";
import AuthLayout from "@novus/Layouts/AuthLayout";
import { MediaLibraryProps, MediaItem } from "@novus/types/media";
import { useToast } from "@novus/Hooks/use-toast";
import { ToastAction } from "@novus/Components/ui/toast";
import { RefreshCw, Trash2, Upload } from "lucide-react";
import { PageHeader } from "@novus/Components/Media/PageHeader";
import { FlashMessages } from "@novus/Components/Media/FlashMessages";
import { MediaFilters } from "@novus/Components/Media/MediaFilters";
import { ViewControls } from "@novus/Components/Media/ViewControls";
import { MediaDisplay } from "@novus/Components/Media/MediaDisplay";
import { MediaDrawer } from "@novus/Components/Media/MediaDrawer";
import { DeleteDialog } from "@novus/Components/Media/DeleteDialog";
import { UploadManager } from "@novus/Components/Media/UploadManager";

export default function MediaLibrary({
    media,
    collections,
    filters = {},
    flash,
}: MediaLibraryProps) {
    const route = useRoute();
    const { toast } = useToast();

    // UI State
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [gridSize, setGridSize] = useState<"sm" | "md" | "lg">("md");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isUploadManagerOpen, setIsUploadManagerOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedMimeType, setSelectedMimeType] = useState(
        filters.mime_type || "all",
    );
    const [selectedCollection, setSelectedCollection] = useState(
        filters.collection || "all",
    );
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [recentlyUploadedItems, setRecentlyUploadedItems] = useState<
        MediaItem[]
    >([]);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Form state
    const {
        data,
        setData,
        patch,
        delete: destroy,
        processing,
        reset,
    } = useForm({
        name: "",
        alt_text: "",
        title: "",
        collection_name: "default",
        custom_properties: {} as Record<string, any>,
    });

    // Set form data when media is selected
    useEffect(() => {
        if (selectedMedia) {
            setData({
                name: selectedMedia.name,
                alt_text: selectedMedia.alt_text || "",
                title: selectedMedia.title || "",
                collection_name: selectedMedia.collection_name,
                custom_properties: selectedMedia.custom_properties || {},
            });
        } else {
            reset();
        }
    }, [selectedMedia]);

    // Handle file upload completion
    const handleFileUploaded = (newMedia: MediaItem) => {
        setUploadError(null);
        // Add to recently uploaded media and ensure it's visible
        setRecentlyUploadedItems((prev) => [newMedia, ...prev]);
        // Reset filters to show the new item
        setSelectedCollection("all");
        setSelectedMimeType("all");
        setSearchQuery("");

        toast({
            title: "Upload Complete",
            description: `${newMedia.name} has been uploaded successfully`,
            action: (
                <ToastAction
                    altText="Upload more"
                    onClick={() => setIsUploadManagerOpen(true)}
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload More
                </ToastAction>
            ),
        });
    };

    // Handle upload error
    const handleUploadError = (error: string) => {
        setUploadError(error);
        toast({
            variant: "destructive",
            title: "Upload Failed",
            description: error,
            action: (
                <ToastAction
                    altText="Try again"
                    onClick={() => setIsUploadManagerOpen(true)}
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </ToastAction>
            ),
        });
    };

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("novus.media.index"),
            {
                search: searchQuery,
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

    // Handle collection change
    const handleCollectionChange = (value: string) => {
        setSelectedCollection(value);
        router.get(
            route("novus.media.index"),
            {
                search: searchQuery,
                collection: value !== "all" ? value : undefined,
                mime_type:
                    selectedMimeType !== "all" ? selectedMimeType : undefined,
            },
            { preserveState: true },
        );
    };

    // Handle mime type change
    const handleMimeTypeChange = (value: string) => {
        setSelectedMimeType(value);
        router.get(
            route("novus.media.index"),
            {
                search: searchQuery,
                collection:
                    selectedCollection !== "all"
                        ? selectedCollection
                        : undefined,
                mime_type: value !== "all" ? value : undefined,
            },
            { preserveState: true },
        );
    };

    // Toggle item selection
    const toggleItemSelection = (id: number) => {
        setSelectedItems((prev) => {
            if (prev.includes(id)) {
                return prev.filter((itemId) => itemId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    // Handle media click
    const handleMediaClick = (media: MediaItem) => {
        setSelectedMedia(media);
        setIsDrawerOpen(true);
    };

    // Update media
    const handleUpdateMedia = () => {
        if (!selectedMedia) return;

        patch(route("novus.media.update", selectedMedia.id), {
            data,
            onSuccess: () => {
                toast({
                    title: "Changes Saved",
                    description: "Your changes have been saved successfully",
                });
            },
            onError: (errors) => {
                toast({
                    variant: "destructive",
                    title: "Update Failed",
                    description: Object.values(errors).join(", "),
                    action: (
                        <ToastAction
                            altText="Try again"
                            onClick={handleUpdateMedia}
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </ToastAction>
                    ),
                });
            },
        });
    };

    // Confirm delete media
    const confirmDeleteMedia = () => {
        setIsDeleteDialogOpen(true);
    };

    // Delete media
    const handleDeleteMedia = () => {
        if (!selectedMedia) return;

        destroy(route("novus.media.destroy", selectedMedia.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setIsDrawerOpen(false);
                setSelectedMedia(null);

                // Remove from recently uploaded media if present
                setRecentlyUploadedItems((prev) =>
                    prev.filter((item) => item.id !== selectedMedia.id),
                );

                toast({
                    title: "Media Deleted",
                    description: `${selectedMedia.name} has been deleted`,
                });
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Delete Failed",
                    description: "Failed to delete the media item",
                    action: (
                        <ToastAction
                            altText="Try again"
                            onClick={handleDeleteMedia}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Try Again
                        </ToastAction>
                    ),
                });
            },
        });
    };

    // Bulk delete
    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return;

        setIsBulkDeleting(true);
        router.post(
            route("novus.media.bulk-destroy"),
            {
                ids: selectedItems,
            },
            {
                onSuccess: () => {
                    setSelectedItems([]);
                    setIsBulkDeleting(false);

                    // Remove any recently uploaded media that was deleted
                    setRecentlyUploadedItems((prev) =>
                        prev.filter((item) => !selectedItems.includes(item.id)),
                    );

                    toast({
                        title: "Bulk Delete Complete",
                        description: `${selectedItems.length} items have been deleted`,
                    });
                },
                onError: () => {
                    setIsBulkDeleting(false);
                    toast({
                        variant: "destructive",
                        title: "Bulk Delete Failed",
                        description: "Failed to delete the selected items",
                        action: (
                            <ToastAction
                                altText="Try again"
                                onClick={handleBulkDelete}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Try Again
                            </ToastAction>
                        ),
                    });
                },
            },
        );
    };

    // Get IDs of recently uploaded items
    const recentlyUploadedIds = recentlyUploadedItems.map((item) => item.id);

    // Combine recent uploads with fetched media for display
    const combinedMedia = {
        ...media,
        data: [
            ...recentlyUploadedItems.filter((item) => {
                // Filter based on current search/collection/mime criteria
                if (
                    selectedCollection !== "all" &&
                    item.collection_name !== selectedCollection
                ) {
                    return false;
                }

                if (selectedMimeType !== "all") {
                    if (
                        selectedMimeType === "image" &&
                        !item.mime_type.startsWith("image/")
                    ) {
                        return false;
                    }
                }

                if (
                    searchQuery &&
                    !item.name.toLowerCase().includes(searchQuery.toLowerCase())
                ) {
                    return false;
                }

                // Don't include if it's already in the fetched media
                return !media.data.some((m) => m.id === item.id);
            }),
            ...media.data,
        ],
    };

    return (
        <AuthLayout title="Media Library">
            <Head title="Image Library" />

            <div className="container py-20 max-w-7xl">
                {/* Header */}
                <PageHeader
                    selectedItems={selectedItems}
                    isUploading={isUploadManagerOpen}
                    setSelectedItems={setSelectedItems}
                    handleBulkDelete={handleBulkDelete}
                    onUploadClick={() => setIsUploadManagerOpen(true)}
                    isBulkDeleting={isBulkDeleting}
                />

                {/* Success/Error messages */}
                <FlashMessages
                    success={flash?.success}
                    error={flash?.error || uploadError}
                    autoClose={true}
                />

                {/* Filters and search */}
                <MediaFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCollection={selectedCollection}
                    handleCollectionChange={handleCollectionChange}
                    selectedMimeType={selectedMimeType}
                    handleMimeTypeChange={handleMimeTypeChange}
                    handleSearch={handleSearch}
                    collections={collections}
                />

                {/* View controls */}
                <ViewControls
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    gridSize={gridSize}
                    setGridSize={setGridSize}
                    totalItems={combinedMedia.data.length}
                />

                {/* Media Display */}
                <MediaDisplay
                    media={combinedMedia}
                    viewMode={viewMode}
                    gridSize={gridSize}
                    selectedItems={selectedItems}
                    toggleItemSelection={toggleItemSelection}
                    handleMediaClick={handleMediaClick}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCollection={selectedCollection}
                    setSelectedCollection={setSelectedCollection}
                    selectedMimeType={selectedMimeType}
                    setSelectedMimeType={setSelectedMimeType}
                    onUploadClick={() => setIsUploadManagerOpen(true)}
                    recentlyUploadedIds={recentlyUploadedIds}
                />

                {/* Media Edit Drawer */}
                <MediaDrawer
                    isOpen={isDrawerOpen}
                    onOpenChange={setIsDrawerOpen}
                    selectedMedia={selectedMedia}
                    collections={collections}
                    onUpdate={handleUpdateMedia}
                    onDelete={confirmDeleteMedia}
                    formData={data}
                    setData={setData}
                    processing={processing}
                />

                {/* Delete Confirmation Dialog */}
                <DeleteDialog
                    isOpen={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onConfirm={handleDeleteMedia}
                    media={selectedMedia}
                    processing={processing}
                />

                {/* Upload Manager */}
                <UploadManager
                    selectedCollection={selectedCollection}
                    onFileUploaded={handleFileUploaded}
                    onError={handleUploadError}
                    isOpen={isUploadManagerOpen}
                    onClose={() => setIsUploadManagerOpen(false)}
                />
            </div>
        </AuthLayout>
    );
}
