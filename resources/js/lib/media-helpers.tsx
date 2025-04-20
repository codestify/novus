import React from "react";
import {
    File as FilePdf,
    File,
    FileArchive,
    FileSpreadsheet,
    FileText,
    Image,
    Music,
    Video,
} from "lucide-react";

/**
 * Determine if a mime type is an image.
 */
export function isImageType(mimeType: string): boolean {
    return mimeType.startsWith("image/");
}

/**
 * Get appropriate icon for a media file based on mime type.
 */
export function getMediaIcon(mimeType: string): React.ReactNode {
    if (mimeType.startsWith("image/")) {
        return <Image className="w-10 h-10 text-muted-foreground" />;
    }

    if (mimeType.startsWith("video/")) {
        return <Video className="w-10 h-10 text-muted-foreground" />;
    }

    if (mimeType.startsWith("audio/")) {
        return <Music className="w-10 h-10 text-muted-foreground" />;
    }

    if (mimeType === "application/pdf") {
        return <FilePdf className="w-10 h-10 text-muted-foreground" />;
    }

    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
        return <FileSpreadsheet className="w-10 h-10 text-muted-foreground" />;
    }

    if (mimeType.includes("word") || mimeType.startsWith("text/")) {
        return <FileText className="w-10 h-10 text-muted-foreground" />;
    }

    if (mimeType.includes("zip") || mimeType.includes("compressed")) {
        return <FileArchive className="w-10 h-10 text-muted-foreground" />;
    }

    return <File className="w-10 h-10 text-muted-foreground" />;
}

/**
 * Format file size in bytes to human-readable format.
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Copy text to clipboard.
 */
export function copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text);
}

/**
 * File type options for filtering.
 */
export const fileTypeOptions = [
    { value: "all", label: "All Files" },
    { value: "image", label: "Images" },
    { value: "video", label: "Videos" },
    { value: "audio", label: "Audio" },
    { value: "document", label: "Documents" },
];

/**
 * Create a blob URL from a File object.
 */
export function createFilePreview(file: File): string {
    return URL.createObjectURL(file);
}

/**
 * Revoke a blob URL to free up memory.
 */
export function revokeFilePreview(url: string): void {
    URL.revokeObjectURL(url);
}

/**
 * Validate if a file is an image.
 */
export function validateImageFile(file: File): boolean {
    return file.type.startsWith("image/");
}

/**
 * Get image dimensions from a file.
 */
export function getImageDimensions(
    file: File,
): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        // Use the global HTMLImageElement constructor explicitly
        const img = document.createElement("img");

        img.onload = () => {
            // Clean up the object URL to prevent memory leaks
            URL.revokeObjectURL(img.src);

            resolve({
                width: img.width,
                height: img.height,
            });
        };

        img.onerror = () => {
            // Clean up the object URL even if there's an error
            URL.revokeObjectURL(img.src);
            reject(new Error("Failed to load image"));
        };

        // Create an object URL for the file
        img.src = URL.createObjectURL(file);
    });
}
