import { useState, useEffect, useCallback } from "react";

/**
 * Hook to manage distraction-free mode functionality
 * Handles toggling, animation states, and body class management
 */
export function useDistractionFreeMode() {
    const [distractionFree, setDistractionFree] = useState(false);
    const [animating, setAnimating] = useState(false);

    // Toggle with animation delay to ensure smooth transitions
    const toggleDistraction = useCallback(() => {
        setAnimating(true);
        setTimeout(() => {
            setDistractionFree((current) => !current);
        }, 50);
    }, []);

    // Handle animation completion
    useEffect(() => {
        if (animating) {
            const timeout = setTimeout(() => {
                setAnimating(false);
            }, 200);
            return () => clearTimeout(timeout);
        }
    }, [animating]);

    // Manage body overflow to prevent scrolling in distraction-free mode
    useEffect(() => {
        if (distractionFree) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        // Clean up on unmount
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [distractionFree]);

    return {
        distractionFree,
        animating,
        toggleDistraction,
    };
}
