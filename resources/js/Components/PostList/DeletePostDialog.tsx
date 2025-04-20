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
import { cn } from "@novus/lib/utils";
import { buttonVariants } from "@novus/Components/ui/button";

type DeletePostDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    postTitle?: string;
};

export function DeletePostDialog({
    isOpen,
    onOpenChange,
    onConfirm,
    postTitle,
}: DeletePostDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                    <div className="text-sm text-muted-foreground">
                        <AlertDialogDescription asChild>
                            <span>
                                Are you sure you want to delete{" "}
                                {postTitle ? (
                                    <span className="font-medium">
                                        "{postTitle}"
                                    </span>
                                ) : (
                                    "this post"
                                )}
                                ?
                            </span>
                        </AlertDialogDescription>
                        <p className="mt-2">
                            This action cannot be undone. This will permanently
                            delete the post and remove it from your database.
                        </p>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={cn(
                            buttonVariants({ variant: "destructive" }),
                            "mt-2 sm:mt-0",
                        )}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
