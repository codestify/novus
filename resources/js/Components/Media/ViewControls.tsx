import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@novus/Components/ui/button";

type ViewControlsProps = {
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    gridSize: "sm" | "md" | "lg";
    setGridSize: (size: "sm" | "md" | "lg") => void;
    totalItems: number;
};

export function ViewControls({
    viewMode,
    setViewMode,
    gridSize,
    setGridSize,
    totalItems,
}: ViewControlsProps) {
    return (
        <div className="flex justify-between items-center p-2 rounded-t-md border bg-background">
            <div className="flex items-center">
                <div className="flex mr-4 space-x-1">
                    <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        className="p-0 w-8 h-8"
                        onClick={() => setViewMode("grid")}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        <span className="sr-only">Grid view</span>
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        className="p-0 w-8 h-8"
                        onClick={() => setViewMode("list")}
                    >
                        <List className="w-4 h-4" />
                        <span className="sr-only">List view</span>
                    </Button>
                </div>

                {viewMode === "grid" && (
                    <div className="hidden space-x-1 sm:flex">
                        <Button
                            variant={gridSize === "sm" ? "default" : "outline"}
                            size="sm"
                            className="px-2 h-7 text-xs"
                            onClick={() => setGridSize("sm")}
                        >
                            Small
                        </Button>
                        <Button
                            variant={gridSize === "md" ? "default" : "outline"}
                            size="sm"
                            className="px-2 h-7 text-xs"
                            onClick={() => setGridSize("md")}
                        >
                            Medium
                        </Button>
                        <Button
                            variant={gridSize === "lg" ? "default" : "outline"}
                            size="sm"
                            className="px-2 h-7 text-xs"
                            onClick={() => setGridSize("lg")}
                        >
                            Large
                        </Button>
                    </div>
                )}
            </div>

            <div className="text-sm text-muted-foreground">
                {totalItems} {totalItems === 1 ? "item" : "items"}
            </div>
        </div>
    );
}
