import { useState, useCallback } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseSaveStatusOptions {
    /**
     * Auto reset the status to idle after successful save (in milliseconds)
     * Set to 0 to disable auto reset
     */
    autoResetAfter?: number;
}

export function useSaveStatus(options: UseSaveStatusOptions = {}) {
    const { autoResetAfter = 3000 } = options;

    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorDialog, setShowErrorDialog] = useState(false);

    // Start saving process
    const startSaving = useCallback(() => {
        setSaveStatus("saving");
    }, []);

    // Handle successful save
    const handleSuccess = useCallback(() => {
        setSaveStatus("saved");

        // Auto reset after delay if specified
        if (autoResetAfter > 0) {
            setTimeout(() => {
                setSaveStatus("idle");
            }, autoResetAfter);
        }
    }, [autoResetAfter]);

    // Handle save error
    const handleError = useCallback((message: string) => {
        setSaveStatus("error");
        setErrorMessage(message);
        setShowErrorDialog(true);
    }, []);

    return {
        saveStatus,
        errorMessage,
        showErrorDialog,
        setShowErrorDialog,
        startSaving,
        handleSuccess,
        handleError,
    };
}
