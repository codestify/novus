import React from "react";
import { Badge, BadgeProps } from "@novus/Components/ui/badge";
import { Switch } from "@novus/Components/ui/switch";
import { format } from "date-fns";
import { PostStatus } from "@novus/types/post";

interface PostVisibilityProps {
    post: {
        status: string;
        created_at: string;
        updated_at: string;
    };
    publishStatus: PostStatus;
    onPublishStatusChange: (status: PostStatus) => void;
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const PostVisibility = ({
    post,
    publishStatus,
    onPublishStatusChange,
}: PostVisibilityProps) => {
    const getStatusProps = (
        status: string,
    ): { variant: BadgeVariant; label: string } => {
        switch (status) {
            case "published":
                return { variant: "default", label: "Published" };
            case "draft":
                return { variant: "secondary", label: "Draft" };
            default:
                return { variant: "outline", label: "Scheduled" };
        }
    };

    const { variant, label } = getStatusProps(post.status);

    return (
        <div className="overflow-hidden rounded-lg border border-muted shadow-xs bg-card">
            <div className="flex justify-between items-center px-5 py-4 border-b">
                <h3 className="font-medium">Post Visibility</h3>
                <Badge variant={variant} className="text-sm">
                    {label}
                </Badge>
            </div>

            <div className="p-5 space-y-4">
                {/* Status toggle */}
                <div className="flex justify-between items-center">
                    <div>
                        <div className="font-medium">Publish Post</div>
                        <div className="text-sm text-muted-foreground">
                            {publishStatus === "published"
                                ? "Visible to readers"
                                : "Saved but not published"}
                        </div>
                    </div>
                    <Switch
                        checked={publishStatus === "published"}
                        onCheckedChange={(checked) => {
                            onPublishStatusChange(
                                checked ? "published" : "draft",
                            );
                        }}
                    />
                </div>

                {/* Creation info */}
                <div className="pt-3 mt-2 space-y-1 text-sm border-t text-muted-foreground">
                    <div className="flex items-center space-x-2">
                        <span> Created:</span>
                        <span>
                            {format(new Date(post.created_at), "MMM d, yyyy")}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span>Last modified:</span>
                        <span>
                            {format(new Date(post.updated_at), "MMM d, yyyy")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostVisibility;
