import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@novus/Components/ui/alert-dialog";
import { MediaItem } from "@novus/types/media";
import { cn } from "@novus/lib/utils";
import { buttonVariants } from "@novus/Components/ui/button";
import { Loader2 } from "lucide-react";

type DeleteDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    media: MediaItem | null;
    processing?: boolean;
};

export function DeleteDialog({
    isOpen,
    onOpenChange,
    onConfirm,
    media,
    processing = false,
}: DeleteDialogProps) {
    return (
        <AlertDialog
            open={isOpen}
            onOpenChange={(open) => {
                // Don't close during processing
                if (processing && !open) return;
                onOpenChange(open);
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Media</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this media item?
                        {media?.model_id && (
                            <div className="mt-2 font-medium text-destructive">
                                Warning: This media is currently in use.
                                Deleting it may affect content that references
                                it.
                            </div>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={processing}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={cn(
                            buttonVariants({ variant: "destructive" }),
                            "mt-2 sm:mt-0",
                        )}
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
