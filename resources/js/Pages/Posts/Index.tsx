import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthLayout from "@novus/Layouts/AuthLayout";
import { Plus } from "lucide-react";
import { Button } from "@novus/Components/ui/button";
import useTypedPage from "@novus/Hooks/useTypePage";
import PostsFilters from "@novus/Components/PostList/PostsFilters";
import PostsList from "@novus/Components/PostList/PostsList";
import PostsGrid from "@novus/Components/PostList/PostsGrid";
import useRoute from "@novus/Hooks/useRoute";
import { DeletePostDialog } from "@novus/Components/PostList/DeletePostDialog";
import { PostListItem } from "@novus/types/post";
import { PaginationWrapper } from "@novus/Components/PaginationWrapper";

export default function PostsIndex() {
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState<PostListItem | null>(null);

    const route = useRoute();
    const page = useTypedPage();
    const { data: posts, meta } = page.props.posts;

    const handleSelectAll = () => {
        if (selectedPosts.length === posts.length) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts(
                posts
                    .map((post) => post.id)
                    .filter((id): id is number => id !== null),
            );
        }
    };

    const handleSelectPost = (postId: number) => {
        if (selectedPosts.includes(postId)) {
            setSelectedPosts(selectedPosts.filter((id) => id !== postId));
        } else {
            setSelectedPosts([...selectedPosts, postId]);
        }
    };

    const handleBulkAction = (action: string) => {
        router.post(
            route("novus.posts.bulk.action"),
            {
                action,
                post_ids: selectedPosts,
            },
            {
                onSuccess: () => {
                    setSelectedPosts([]);
                    router.reload({ only: ["posts"] });
                },
                preserveScroll: true,
            },
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("novus.posts.index"),
            {
                search: searchQuery || undefined,
                status: statusFilter !== "all" ? statusFilter : undefined,
            },
            { preserveState: true },
        );
    };

    const handleFilterChange = (status: string) => {
        setStatusFilter(status);
        router.get(
            route("novus.posts.index"),
            {
                search: searchQuery || undefined,
                status: status !== "all" ? status : undefined,
            },
            { preserveState: true },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route("novus.posts.index", { page }),
            {
                search: searchQuery || undefined,
                status: statusFilter !== "all" ? statusFilter : undefined,
            },
            { preserveState: true },
        );
    };

    const openDeleteDialog = (post: PostListItem) => {
        setCurrentPost(post);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!currentPost) {
            return;
        }

        router.delete(route("novus.posts.destroy", { post: currentPost.id }), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setCurrentPost(null);
            },
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Posts" />
            <AuthLayout title="All Posts">
                <div className="max-w-[1400px] mx-auto px-4 py-20 sm:px-6 py-8">
                    {/* Header */}
                    <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-semibold">Posts</h1>
                            <p className="mt-1 text-muted-foreground">
                                Manage your blog posts and articles
                            </p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <Button asChild>
                                <a href={route("novus.posts.create")}>
                                    <Plus className="mr-2 w-4 h-4" />
                                    New Post
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Filters & View Mode */}
                    <PostsFilters
                        posts={posts}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        selectedPosts={selectedPosts}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter}
                        handleSearch={handleSearch}
                        handleFilterChange={handleFilterChange}
                        handleBulkAction={handleBulkAction}
                        total={meta.total}
                    />

                    {/* Content View (Grid or List) */}
                    {viewMode === "list" ? (
                        <PostsList
                            posts={posts}
                            selectedPosts={selectedPosts}
                            handleSelectAll={handleSelectAll}
                            handleSelectPost={handleSelectPost}
                            searchQuery={searchQuery}
                            onDeletePost={openDeleteDialog}
                        />
                    ) : (
                        <PostsGrid
                            posts={posts}
                            selectedPosts={selectedPosts}
                            handleSelectPost={handleSelectPost}
                            searchQuery={searchQuery}
                            onDeletePost={openDeleteDialog}
                        />
                    )}

                    {/* Pagination */}
                    {meta.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t">
                            <div className="mr-auto text-sm whitespace-nowrap text-muted-foreground">
                                Showing{" "}
                                <span className="font-medium">{meta.from}</span>{" "}
                                to{" "}
                                <span className="font-medium">{meta.to}</span>{" "}
                                of{" "}
                                <span className="font-medium">
                                    {meta.total}
                                </span>{" "}
                                posts
                            </div>

                            <PaginationWrapper
                                currentPage={meta.current_page}
                                lastPage={meta.last_page}
                                links={meta.links}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </AuthLayout>

            <DeletePostDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                postTitle={currentPost?.title}
            />
        </>
    );
}
