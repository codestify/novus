import React from "react";
import { Maximize } from "lucide-react";
import { Button } from "@novus/Components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@novus/Components/ui/tooltip";
import { useDistractionFreeMode } from "@novus/Hooks/useDistractionFreeMode";

interface DistractionFreeToggleProps {
    onToggle?: (isDistracted: boolean) => void;
    className?: string;
}

const DistractionFreeToggle: React.FC<DistractionFreeToggleProps> = ({
    onToggle,
    className = "",
}) => {
    // Use the hook instead of reimplementing logic
    const { distractionFree, toggleDistraction } = useDistractionFreeMode();

    // Call the parent callback if provided
    const handleToggle = () => {
        toggleDistraction();
        if (onToggle) {
            onToggle(!distractionFree);
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleToggle}
                        className={`w-9 h-9 ${className}`}
                    >
                        <Maximize className="w-4 h-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Toggle distraction-free mode</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default DistractionFreeToggle;
