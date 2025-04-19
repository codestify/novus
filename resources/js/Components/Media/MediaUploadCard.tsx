import React from "react";
import { CheckCircle, X, AlertTriangle } from "lucide-react";
import { cn } from "@novus/lib/utils";
import { Progress } from "@novus/Components/ui/progress";
import { Button } from "@novus/Components/ui/button";

type UploadStatus = "uploading" | "success" | "error";

type MediaUploadCardProps = {
    file: File;
    progress: number;
    status: UploadStatus;
    error?: string;
    onCancel: () => void;
    preview: string;
};

export function MediaUploadCard({
    file,
    progress,
    status,
    error,
    onCancel,
    preview,
}: MediaUploadCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-md border bg-background transition-all group hover:shadow-md",
                status === "success" && "ring-2 ring-green-500",
                status === "error" && "ring-2 ring-destructive",
            )}
        >
            {/* Preview area */}
            <div className="overflow-hidden relative aspect-square">
                <img
                    src={preview}
                    alt={file.name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />

                {/* Overlay with progress or status */}
                <div
                    className={cn(
                        "absolute inset-0 flex flex-col items-center justify-center transition-opacity",
                        status === "uploading"
                            ? "bg-black/50"
                            : status === "success"
                              ? "bg-green-500/20"
                              : "bg-destructive/20",
                        status === "success" &&
                            "opacity-0 group-hover:opacity-100",
                    )}
                >
                    {status === "uploading" && (
                        <>
                            <div className="mb-2 w-4/5">
                                <Progress value={progress} className="h-2" />
                            </div>
                            <span className="text-xs font-medium text-white">
                                {progress}%
                            </span>
                        </>
                    )}

                    {status === "success" && (
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    )}

                    {status === "error" && (
                        <AlertTriangle className="w-10 h-10 text-destructive" />
                    )}
                </div>

                {/* Cancel button */}
                {status === "uploading" && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 w-6 h-6 border-none backdrop-blur-sm bg-background/80"
                        onClick={onCancel}
                    >
                        <X className="w-4 h-4" />
                        <span className="sr-only">Cancel upload</span>
                    </Button>
                )}

                {/* Status indicator */}
                {status === "success" && (
                    <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                )}

                {status === "error" && (
                    <div className="absolute top-2 right-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                )}
            </div>

            {/* File info */}
            <div className="p-2">
                <div className="text-sm font-medium truncate">{file.name}</div>
                <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                        {Math.round(file.size / 1024)} KB
                    </div>

                    {/* Error message */}
                    {status === "error" && error && (
                        <div
                            className="text-xs truncate text-destructive"
                            title={error}
                        >
                            {error.length > 20
                                ? error.substring(0, 20) + "..."
                                : error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
