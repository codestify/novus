import React from "react";
import { Upload, Trash2, Download, Image } from "lucide-react";
import { Button } from "@novus/Components/ui/button";
import { Badge } from "@novus/Components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@novus/Components/ui/dropdown-menu";

type PageHeaderProps = {
    selectedItems: number[];
    isUploading: boolean;
    setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
    handleBulkDelete: () => void;
    onUploadClick: () => void;
    isBulkDeleting?: boolean;
};

export function PageHeader({
    selectedItems,
    isUploading,
    setSelectedItems,
    handleBulkDelete,
    onUploadClick,
    isBulkDeleting = false,
}: PageHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Image Library
                </h1>
                <p className="mt-1 text-muted-foreground">
                    Manage your images for use across your site
                </p>
            </div>

            <div className="flex gap-2 items-center">
                {selectedItems.length > 0 ? (
                    <div className="flex gap-2 items-center">
                        <Badge variant="secondary" className="px-2 py-1">
                            {selectedItems.length} selected
                        </Badge>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    disabled={isBulkDeleting}
                                >
                                    Bulk Actions
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={handleBulkDelete}
                                    disabled={isBulkDeleting}
                                >
                                    <Trash2 className="mr-2 w-4 h-4" />
                                    {isBulkDeleting
                                        ? "Deleting..."
                                        : "Delete Selected"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Download className="mr-2 w-4 h-4" />
                                    Download Selected
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedItems([])}
                            disabled={isBulkDeleting}
                        >
                            Clear Selection
                        </Button>
                    </div>
                ) : (
                    <Button onClick={onUploadClick} disabled={isUploading}>
                        <Upload className="mr-2 w-4 h-4" />
                        Upload Images
                    </Button>
                )}
            </div>
        </div>
    );
}
