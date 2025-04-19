// resources/js/Components/Post/PostExcerpt.tsx
import React from "react";
import { Card } from "@novus/Components/ui/card";
import { Textarea } from "@novus/Components/ui/textarea";
import { Info } from "lucide-react";
import { PostExcerptProps } from "@novus/types/post";

const PostExcerpt: React.FC<PostExcerptProps> = ({
    excerpt,
    onChange,
    error,
}) => {
    return (
        <Card className="p-5 mt-6 rounded-md border border-muted shadow-xs bg-card">
            <div className="flex items-center mb-3">
                <Info className="mr-2 w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Excerpt</h2>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
                Write a brief summary of your post to be displayed on the blog
                index page
            </p>
            <Textarea
                placeholder="Write a brief excerpt..."
                className="min-h-[100px] resize-none shadow-none"
                value={excerpt}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
        </Card>
    );
};

export default PostExcerpt;
