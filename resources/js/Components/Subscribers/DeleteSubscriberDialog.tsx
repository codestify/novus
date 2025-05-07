import React from "react";
import { useForm } from "@inertiajs/react";
import useRoute from "@novus/hooks/useRoute";
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
import { Subscriber } from "@novus/types/subscriber";

interface DeleteSubscriberDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    subscriber: Subscriber | null;
    onSuccess?: () => void;
}

const DeleteSubscriberDialog = ({
    isOpen,
    onOpenChange,
    subscriber,
    onSuccess,
}: DeleteSubscriberDialogProps) => {
    const route = useRoute();
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (!subscriber) return;

        destroy(route("novus.subscribers.destroy", subscriber.id), {
            onSuccess: () => {
                onOpenChange(false);
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the subscriber{" "}
                        <span className="font-medium">{subscriber?.email}</span>
                        ? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={processing}
                    >
                        {processing ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteSubscriberDialog;
