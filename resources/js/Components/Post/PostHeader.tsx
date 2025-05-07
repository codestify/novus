import React from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@novus/Components/ui/button";
import { ChevronRight, Maximize, Save, Loader2 } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@novus/Components/ui/tooltip";
import useRoute from "@novus/hooks/useRoute";

interface PostHeaderProps {
    title: string;
    onToggleDistraction: () => void;
    onSave: (e: React.MouseEvent) => void;
    saveStatus: "idle" | "saving" | "saved" | "error";
    processing: boolean;
    post_action: "create" | "update";
    className?: string;
}

const PostHeader = ({
    title,
    onToggleDistraction,
    onSave,
    saveStatus,
    processing,
    post_action,
    className = "",
}: PostHeaderProps) => {
    const route = useRoute();

    return (
        <div className={className}>
            {/* Breadcrumb */}
            <div className="flex items-center mb-2 text-sm text-muted-foreground">
                <Link
                    href={route("novus.posts.index")}
                    className="transition-colors hover:text-primary"
                >
                    Posts
                </Link>
                <ChevronRight className="mx-1 w-4 h-4" />
                <span className="font-medium text-foreground">
                    {post_action === "create" ? "Create Post" : "Edit Post"}
                </span>
            </div>

            {/* Header */}
            <div className="flex flex-col gap-4 justify-between md:flex-row md:items-center">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {post_action === "create" ? "Create Post" : "Edit Post"}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {post_action === "create"
                            ? "Plan and create your content"
                            : "Update and refine your content"}
                    </p>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-wrap gap-3 items-center">
                    {/* Preview Button */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" asChild>
                                    preview
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Preview how this post will look on your site
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* Full-Screen Button */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={onToggleDistraction}
                                    className="w-9 h-9"
                                >
                                    <Maximize className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Toggle distraction-free mode</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* Publish / Save button */}
                    <Button
                        className="min-w-[120px] h-9"
                        onClick={onSave}
                        disabled={processing || saveStatus === "saving"}
                    >
                        {saveStatus === "saving" ? (
                            <>
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 w-4 h-4" />
                                {saveStatus === "saved"
                                    ? "Saved"
                                    : "Save Changes"}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PostHeader;
