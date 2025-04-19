import React from "react";
import { PostListItem } from "@novus/types/post";
import { AlertCircle, FileEdit, Star, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@novus/Components/ui/table";
import { Checkbox } from "@novus/Components/ui/checkbox";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@novus/Components/ui/avatar";
import { Button } from "@novus/Components/ui/button";
import PostStatusBadge from "./PostStatusBadge";
import useRoute from "@novus/Hooks/useRoute";
import { Link } from "@inertiajs/react";

interface PostsListProps {
    posts: PostListItem[];
    selectedPosts: number[];
    handleSelectAll: () => void;
    handleSelectPost: (id: number) => void;
    searchQuery: string;
    onDeletePost: (post: PostListItem) => void;
}

export default function PostsList({
    posts,
    selectedPosts,
    handleSelectAll,
    handleSelectPost,
    searchQuery,
    onDeletePost,
}: PostsListProps) {
    const route = useRoute();

    return (
        <div className="mb-10">
            <div className="overflow-hidden rounded-md border border-muted bg-card">
                <div className="px-4 py-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10">
                                    <Checkbox
                                        checked={
                                            selectedPosts.length ===
                                                posts.length && posts.length > 0
                                        }
                                        onCheckedChange={handleSelectAll}
                                        aria-label="Select all posts"
                                    />
                                </TableHead>
                                <TableHead className="min-w-[300px]">
                                    <div className="flex items-center cursor-pointer">
                                        Title
                                    </div>
                                </TableHead>
                                <TableHead className="w-14 text-center">
                                    Author
                                </TableHead>
                                <TableHead className="w-40 text-center">
                                    Status
                                </TableHead>
                                <TableHead className="w-32 text-center">
                                    <div className="flex items-center cursor-pointer">
                                        Date
                                    </div>
                                </TableHead>
                                <TableHead className="w-24 text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <TableRow key={post.id} className="h-16">
                                        <TableCell className="align-middle">
                                            <Checkbox
                                                checked={selectedPosts.includes(
                                                    post.id as number,
                                                )}
                                                onCheckedChange={() =>
                                                    handleSelectPost(
                                                        post.id as number,
                                                    )
                                                }
                                                aria-label={`Select post ${post.title}`}
                                            />
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <div className="flex flex-col">
                                                <div className="flex gap-2 items-center font-medium">
                                                    {post.title}
                                                    {post.featured && (
                                                        <span
                                                            className="inline-flex justify-center items-center w-4 h-4 text-amber-600 bg-amber-100 rounded-full"
                                                            title="Featured"
                                                        >
                                                            <Star className="w-3 h-3 fill-current" />
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-1 max-w-md text-xs text-muted-foreground line-clamp-1">
                                                    {post.excerpt}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Avatar className="inline-flex w-8 h-8">
                                                <AvatarImage
                                                    src={
                                                        post.author.avatar || ""
                                                    }
                                                    alt={post.author.name}
                                                />
                                                <AvatarFallback className="text-xs">
                                                    {post.author.initials}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="w-40 text-center">
                                            <PostStatusBadge
                                                status={post.status}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs text-muted-foreground">
                                                {post.created_at}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end items-center space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8"
                                                    asChild
                                                >
                                                    <Link
                                                        href={route(
                                                            "novus.posts.edit",
                                                            { post: post.id },
                                                        )}
                                                        target="_blank"
                                                    >
                                                        <FileEdit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() =>
                                                        onDeletePost(post)
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="h-24 text-center"
                                    >
                                        <div className="flex flex-col justify-center items-center text-muted-foreground">
                                            <AlertCircle className="mb-2 w-8 h-8" />
                                            <h3 className="text-lg font-medium">
                                                No posts found
                                            </h3>
                                            <p className="text-sm">
                                                {searchQuery
                                                    ? "Try adjusting your search or filter to find what you're looking for."
                                                    : "Get started by creating your first post."}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
