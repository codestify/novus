import React from "react";
import { FileCheck, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@novus/lib/utils";

interface PostStatusBarProps {
    saveStatus: "idle" | "saving" | "saved" | "error";
}

const PostStatusBar = ({ saveStatus }: PostStatusBarProps) => {
    if (saveStatus === "idle") return null;

    const saveStatusClasses = cn(
        "fixed bottom-4 right-4 z-50 transition-all duration-200 bg-card shadow-lg rounded-lg px-4 py-2 border flex items-center gap-2 will-change-transform will-change-opacity save-indicator",
        saveStatus === "saving"
            ? "opacity-100"
            : saveStatus === "saved"
              ? "opacity-100"
              : saveStatus === "error"
                ? "opacity-100 bg-red-50 border-red-200"
                : "opacity-0 pointer-events-none",
    );

    return (
        <div className={saveStatusClasses}>
            {saveStatus === "saving" ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Saving changes...</span>
                </>
            ) : saveStatus === "saved" ? (
                <>
                    <FileCheck className="w-4 h-4 text-green-600" />
                    <span className="text-sm">All changes saved</span>
                </>
            ) : saveStatus === "error" ? (
                <>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm">Failed to save</span>
                </>
            ) : null}
        </div>
    );
};

export default PostStatusBar;
