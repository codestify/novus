import React, { useMemo } from "react";
import { Button } from "@novus/Components/ui/button";
import { Minimize, Save, Loader2 } from "lucide-react";
import { cn } from "@novus/lib/utils";

interface FloatingActionButtonsProps {
    visible: boolean;
    onToggleDistraction: () => void;
    onSave: (e: React.MouseEvent) => void;
    saveStatus: "idle" | "saving" | "saved" | "error";
    processing: boolean;
}

const FloatingActionButtons = ({
    visible,
    onToggleDistraction,
    onSave,
    saveStatus,
    processing,
}: FloatingActionButtonsProps) => {
    // Memoize class names to avoid recalculation on each render
    const containerClasses = useMemo(
        () =>
            cn(
                "fixed right-4 z-50 transition-all duration-200 flex flex-row gap-2 ease-in-out will-change-transform",
                visible
                    ? "opacity-100 translate-y-0 top-4"
                    : "opacity-0 -translate-y-10 pointer-events-none",
            ),
        [visible],
    );

    const buttonClasses = cn(
        "w-10 h-10 rounded-full transition-all duration-200 ease-in-out",
        "hover:scale-110",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
    );

    const isSaving = saveStatus === "saving" || processing;

    return (
        <div className={containerClasses}>
            <Button
                type="button"
                variant="secondary"
                onClick={onToggleDistraction}
                className={buttonClasses}
            >
                <Minimize className="w-5 h-5" />
            </Button>

            <Button
                type="button"
                size="icon"
                onClick={onSave}
                disabled={isSaving}
                className={buttonClasses}
            >
                {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Save className="w-5 h-5" />
                )}
            </Button>
        </div>
    );
};

export default FloatingActionButtons;
