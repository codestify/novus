import { cn } from "@novus/lib/utils";

/**
 * Generate class names for the post editor layout based on distraction-free mode state
 */
export function getPostEditorClasses(
    distractionFree: boolean,
    animating: boolean,
) {
    return {
        container: cn(
            "transition-all duration-200 ease-in-out will-change-transform",
            distractionFree
                ? "fixed inset-0 z-50 bg-background"
                : "max-w-[1400px] mx-auto px-4 sm:px-6 py-20",
            animating
                ? distractionFree
                    ? "scale-95 opacity-90"
                    : "scale-105 opacity-90"
                : "scale-100 opacity-100",
        ),

        editorContainer: cn(
            "transition-all duration-200 ease-in-out",
            distractionFree ? "h-full" : "py-4",
        ),

        contentLayout: cn(
            "grid gap-6 transition-all duration-200 ease-in-out",
            distractionFree
                ? "grid-cols-1 h-full"
                : "grid-cols-1 lg:grid-cols-[1fr_340px]",
        ),

        editor: cn(
            "transition-all duration-200 ease-in-out",
            distractionFree ? "w-full h-full" : "",
        ),

        editorInner: cn(
            "transition-all duration-200 ease-in-out",
            distractionFree ? "h-full p-4" : "",
        ),

        header: cn(
            "transition-all duration-200 ease-in-out mb-6",
            distractionFree ? "hidden" : "block",
        ),

        extraSections: cn(
            "transition-all duration-200 ease-in-out",
            distractionFree ? "hidden" : "block",
        ),

        sidebar: cn(
            "transition-all duration-200 ease-in-out",
            distractionFree ? "hidden" : "block space-y-6",
        ),
    };
}
