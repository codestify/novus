import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@novus/Components/ui/button";
import { MediaUploadCard } from "./MediaUploadCard";
import { FilePondUploader } from "./FilePondUploader";
import { cn } from "@novus/lib/utils";
import { MediaItem } from "@novus/types/media";

type UploadStatus = "uploading" | "success" | "error";

type UploadingFile = {
    id: string;
    file: File;
    progress: number;
    status: UploadStatus;
    error?: string;
    preview: string;
};

type UploadManagerProps = {
    selectedCollection: string;
    onFileUploaded: (media: MediaItem) => void;
    onError?: (error: string) => void;
    isOpen: boolean;
    onClose: () => void;
};

export function UploadManager({
    selectedCollection,
    onFileUploaded,
    onError,
    isOpen,
    onClose,
}: UploadManagerProps) {
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

    // Handle file upload completion
    const handleFileUploaded = (media: MediaItem) => {
        // Update the status of the uploaded file
        setUploadingFiles((prevFiles) =>
            prevFiles.map((file) => {
                if (
                    file.file.name === media.name ||
                    file.file.name.startsWith(media.name) ||
                    media.name.startsWith(
                        file.file.name.replace(/\.[^/.]+$/, ""),
                    )
                ) {
                    return { ...file, status: "success", progress: 100 };
                }
                return file;
            }),
        );

        // Notify parent component
        onFileUploaded(media);
    };

    // Cancel a specific file upload
    const cancelUpload = (fileId: string) => {
        setUploadingFiles((prevFiles) =>
            prevFiles.filter((file) => file.id !== fileId),
        );
    };

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity",
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
        >
            <div className="fixed inset-x-0 top-0 z-50 sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-2xl w-full sm:h-auto max-h-[90vh] overflow-y-auto bg-background p-6 shadow-lg rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Upload Images</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>

                {/* FilePond Uploader */}
                <FilePondUploader
                    selectedCollection={selectedCollection}
                    onFileUploaded={handleFileUploaded}
                    onError={onError}
                />

                {/* Upload Grid - shows images being processed */}
                {uploadingFiles.length > 0 && (
                    <div className="mt-6">
                        <h3 className="font-medium mb-3">Upload Progress</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {uploadingFiles.map((file) => (
                                <MediaUploadCard
                                    key={file.id}
                                    file={file.file}
                                    progress={file.progress}
                                    status={file.status}
                                    error={file.error}
                                    onCancel={() => cancelUpload(file.id)}
                                    preview={file.preview}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onClose}
                        disabled={uploadingFiles.some(
                            (file) => file.status === "uploading",
                        )}
                    >
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
}
