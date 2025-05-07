import React from "react";
import { PostListItem } from "@novus/types/post";
import { AlertCircle, Calendar, PenLine } from "lucide-react";
import { Card } from "@novus/Components/ui/card";
import { Checkbox } from "@novus/Components/ui/checkbox";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@novus/Components/ui/avatar";
import { Button } from "@novus/Components/ui/button";
import PostStatusBadge from "./PostStatusBadge";
import useRoute from "@novus/hooks/useRoute";

interface PostsGridProps {
    posts: PostListItem[];
    selectedPosts: number[];
    handleSelectPost: (id: number) => void;
    searchQuery: string;
    onDeletePost: (post: PostListItem) => void;
}

export default function PostsGrid({
    posts,
    selectedPosts,
    handleSelectPost,
    searchQuery,
}: PostsGridProps) {
    const route = useRoute();

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-10">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <Card
                        key={post.id}
                        className="flex overflow-hidden flex-col"
                    >
                        {/* Top row with checkbox and status */}
                        <div className="flex justify-between items-center p-4 pb-2 border-b">
                            <Checkbox
                                checked={selectedPosts.includes(
                                    post.id as number,
                                )}
                                onCheckedChange={() =>
                                    handleSelectPost(post.id as number)
                                }
                                aria-label={`Select post ${post.title}`}
                            />
                            <PostStatusBadge status={post.status} />
                        </div>

                        {/* Title and excerpt section */}
                        <div className="flex-1 p-4">
                            <h3 className="mb-2 text-base font-medium line-clamp-2">
                                {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {post.excerpt}
                            </p>
                        </div>

                        {/* Author and categories section */}
                        <div className="px-4 pt-2 border-t">
                            <div className="flex items-center mb-3 text-sm text-muted-foreground">
                                <Avatar className="mr-2 w-6 h-6">
                                    <AvatarImage
                                        src={post.author.avatar || ""}
                                        alt={post.author.name}
                                    />
                                    <AvatarFallback>
                                        {post.author.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <span>{post.author.name}</span>
                            </div>
                        </div>

                        {/* Footer with date and actions */}
                        <div className="flex justify-between items-center p-4 pt-2 border-t">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 w-3 h-3" />
                                {post.created_at}
                            </div>
                        </div>
                    </Card>
                ))
            ) : (
                <div className="col-span-full p-8 text-center rounded-lg border bg-card">
                    <div className="flex flex-col justify-center items-center text-muted-foreground">
                        <AlertCircle className="mb-2 w-8 h-8" />
                        <h3 className="text-lg font-medium">No posts found</h3>
                        <p className="text-sm">
                            {searchQuery
                                ? "Try adjusting your search or filter to find what you're looking for."
                                : "Get started by creating your first post."}
                        </p>
                        {!searchQuery && (
                            <Button asChild className="mt-4">
                                <a href={route("novus.posts.create")}>
                                    <PenLine className="mr-2 w-4 h-4" />
                                    Create a new post
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
