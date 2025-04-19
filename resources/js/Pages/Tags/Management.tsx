import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import useRoute from "@novus/Hooks/useRoute";
import {
    Plus,
    Search,
    Tag as TagIcon,
    Hash,
    Check,
    X,
    Filter,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    AlertCircle,
    Trash2,
    FileText,
    Settings,
    Download,
    Upload,
    Edit,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@novus/Components/ui/tooltip";

import AuthLayout from "@novus/Layouts/AuthLayout";
import { Button } from "@novus/Components/ui/button";
import { Input } from "@novus/Components/ui/input";
import { Label } from "@novus/Components/ui/label";
import { Badge } from "@novus/Components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@novus/Components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@novus/Components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@novus/Components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@novus/Components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@novus/Components/ui/table";
import { Separator } from "@novus/Components/ui/separator";
import { EmptyState } from "@novus/Components/EmptyState";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@novus/Components/ui/select";
import { cn } from "@novus/lib/utils";
import { ScrollArea } from "@novus/Components/ui/scroll-area";

type Tag = {
    id: number;
    name: string;
    slug: string;
    posts_count: number;
    created_at: string;
};

type PaginationData = {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

type Props = {
    tags: PaginationData & {
        data: Tag[];
    };
    errors?: {
        [key: string]: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function TagsManagement({
    tags: paginatedTags,
    errors,
    flash,
}: Props) {
    const route = useRoute();
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPerPage, setSelectedPerPage] = useState(
        paginatedTags.per_page.toString(),
    );

    const {
        data,
        setData,
        post,
        patch,
        processing,
        reset,
        errors: formErrors,
    } = useForm({
        name: "",
        slug: "",
    });

    // Set up form data when selecting a tag to edit
    useEffect(() => {
        if (selectedTag) {
            setData({
                name: selectedTag.name,
                slug: selectedTag.slug,
            });
        } else {
            reset();
        }
    }, [selectedTag]);

    // Auto-generate slug when name changes (for new tags)
    useEffect(() => {
        if (!selectedTag && data.name && !data.slug) {
            const slug = data.name
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .trim();

            setData("slug", slug);
        }
    }, [data.name, selectedTag]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("novus.tags.index"),
            {
                search: searchQuery,
                per_page: selectedPerPage,
            },
            { preserveState: true },
        );
    };

    const handlePerPageChange = (value: string) => {
        setSelectedPerPage(value);
        router.get(
            route("novus.tags.index"),
            {
                search: searchQuery,
                per_page: value,
            },
            { preserveState: true },
        );
    };

    const handleCreateTag = () => {
        post(route("novus.tags.store"), {
            onSuccess: () => {
                setShowCreateDialog(false);
                reset();
            },
        });
    };

    const handleEditTag = (tag: Tag) => {
        setSelectedTag(tag);
        setShowEditDialog(true);
    };

    const handleUpdateTag = () => {
        if (!selectedTag) return;

        patch(route("novus.tags.update", selectedTag.id), {
            onSuccess: () => {
                setShowEditDialog(false);
                setSelectedTag(null);
            },
        });
    };

    const confirmDeleteTag = (tag: Tag) => {
        setSelectedTag(tag);
        setDeleteDialogOpen(true);
    };

    const handleDeleteTag = () => {
        if (!selectedTag) return;

        router.delete(route("novus.tags.destroy", selectedTag.id), {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setSelectedTag(null);
            },
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            route("novus.tags.index", { page }),
            {
                search: searchQuery,
                per_page: selectedPerPage,
            },
            { preserveState: true },
        );
    };

    const renderPagination = () => {
        const { current_page, last_page, links } = paginatedTags;

        // Skip the first (previous) and last (next) links
        const pageLinks = links.slice(1, -1);

        return (
            <div className="flex justify-center items-center space-x-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    disabled={current_page === 1}
                    onClick={() => handlePageChange(current_page - 1)}
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="sr-only">Previous page</span>
                </Button>

                {pageLinks.map((link, index) => {
                    if (link.label === "...") {
                        return (
                            <Button
                                key={`ellipsis-${index}`}
                                variant="outline"
                                size="icon"
                                className="w-8 h-8"
                                disabled
                            >
                                <MoreHorizontal className="w-4 h-4" />
                                <span className="sr-only">More pages</span>
                            </Button>
                        );
                    }

                    const page = parseInt(link.label);

                    return (
                        <Button
                            key={link.label}
                            variant={link.active ? "default" : "outline"}
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => handlePageChange(page)}
                        >
                            {link.label}
                        </Button>
                    );
                })}

                <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    disabled={current_page === last_page}
                    onClick={() => handlePageChange(current_page + 1)}
                >
                    <ChevronRight className="w-4 h-4" />
                    <span className="sr-only">Next page</span>
                </Button>
            </div>
        );
    };

    return (
        <>
            <Head title="Tags Management" />
            <AuthLayout>
                <div className="container py-20 max-w-7xl">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Tags
                            </h1>
                            <p className="mt-1 text-muted-foreground">
                                Manage tags to categorize and organize your
                                content
                            </p>
                        </div>

                        <div className="flex gap-2 items-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Settings className="mr-2 w-4 h-4" />
                                        <span>Options</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                >
                                    <DropdownMenuItem>
                                        <Upload className="mr-2 w-4 h-4" />
                                        <span>Import Tags</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Download className="mr-2 w-4 h-4" />
                                        <span>Export Tags</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <FileText className="mr-2 w-4 h-4" />
                                        <span>View Documentation</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button onClick={() => setShowCreateDialog(true)}>
                                <Plus className="mr-2 w-4 h-4" />
                                New Tag
                            </Button>
                        </div>
                    </div>

                    {/* Success/Error messages */}
                    {flash?.success && (
                        <div className="p-4 mb-6 bg-green-50 rounded border-l-4 border-green-400 shadow">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">
                                        {flash.success}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="p-4 mb-6 bg-red-50 rounded border-l-4 border-red-400 shadow">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        {flash.error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <Card className="h-full rounded-md shadow-xs">
                        <CardHeader className="pb-3">
                            <CardTitle>All Tags</CardTitle>
                            <CardDescription>
                                {paginatedTags.total} total tags
                            </CardDescription>
                        </CardHeader>

                        <div className="px-6 py-2 border-b">
                            <div className="flex gap-4 justify-between items-center">
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search tags..."
                                        className="pl-8 h-9"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="sm"
                                    variant="secondary"
                                >
                                    Search
                                </Button>
                            </div>
                        </div>

                        <CardContent className="p-6">
                            {paginatedTags.data.length > 0 ? (
                                <div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tag</TableHead>
                                                <TableHead>Slug</TableHead>
                                                <TableHead>Usage</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedTags.data.map((tag) => (
                                                <TableRow
                                                    key={tag.id}
                                                    className="group"
                                                >
                                                    <TableCell>
                                                        <div className="flex gap-2 items-center">
                                                            <div className="flex justify-center items-center w-7 h-7 rounded-full bg-primary/10">
                                                                <TagIcon className="w-3.5 h-3.5 text-primary" />
                                                            </div>
                                                            <span className="font-medium">
                                                                {tag.name}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
                                                            {tag.slug}
                                                        </code>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                tag.posts_count >
                                                                0
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                            className="text-xs"
                                                        >
                                                            {tag.posts_count}{" "}
                                                            {tag.posts_count ===
                                                            1
                                                                ? "post"
                                                                : "posts"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex gap-2 justify-end">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-8 h-8"
                                                                onClick={() =>
                                                                    handleEditTag(
                                                                        tag,
                                                                    )
                                                                }
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-8 h-8 text-destructive"
                                                                onClick={() =>
                                                                    confirmDeleteTag(
                                                                        tag,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    <div className="flex justify-between items-center px-6 py-4 border-t">
                                        <div className="text-sm text-muted-foreground">
                                            Showing{" "}
                                            <span className="font-medium">
                                                {paginatedTags.from}
                                            </span>{" "}
                                            to{" "}
                                            <span className="font-medium">
                                                {paginatedTags.to}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-medium">
                                                {paginatedTags.total}
                                            </span>{" "}
                                            tags
                                        </div>

                                        {renderPagination()}
                                    </div>
                                </div>
                            ) : (
                                <EmptyState
                                    icon={<TagIcon className="w-10 h-10" />}
                                    title="No tags found"
                                    description={
                                        searchQuery
                                            ? "No tags match your search criteria. Try different keywords."
                                            : "Get started by creating your first tag to categorize your content."
                                    }
                                    action={
                                        searchQuery ? (
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    router.get(
                                                        route(
                                                            "novus.tags.index",
                                                        ),
                                                    );
                                                }}
                                            >
                                                Clear Search
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() =>
                                                    setShowCreateDialog(true)
                                                }
                                            >
                                                <Plus className="mr-2 w-4 h-4" />
                                                Create Tag
                                            </Button>
                                        )
                                    }
                                    className="py-16"
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Create Tag Dialog */}
                <Dialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                >
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New Tag</DialogTitle>
                            <DialogDescription>
                                Add a new tag to help categorize and organize
                                your content.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="tag-name">
                                    Tag Name{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="tag-name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Enter tag name"
                                    className={cn(
                                        formErrors?.name &&
                                            "border-destructive",
                                    )}
                                />
                                {formErrors?.name && (
                                    <p className="text-xs text-destructive">
                                        {formErrors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tag-slug">Slug</Label>
                                <div className="flex relative items-center">
                                    <span className="absolute left-2.5 text-muted-foreground">
                                        <Hash className="h-3.5 w-3.5" />
                                    </span>
                                    <Input
                                        id="tag-slug"
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData("slug", e.target.value)
                                        }
                                        placeholder="enter-slug"
                                        className={cn(
                                            "pl-8 font-mono text-sm",
                                            formErrors?.slug &&
                                                "border-destructive",
                                        )}
                                    />
                                </div>
                                {formErrors?.slug && (
                                    <p className="text-xs text-destructive">
                                        {formErrors.slug}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Used in URLs, automatically generated from
                                    the name if left empty
                                </p>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowCreateDialog(false);
                                    reset();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateTag}
                                disabled={processing}
                            >
                                {processing ? "Creating..." : "Create Tag"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Tag Dialog */}
                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Tag</DialogTitle>
                            <DialogDescription>
                                Update this tag's name and slug.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-tag-name">
                                    Tag Name{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="edit-tag-name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className={cn(
                                        formErrors?.name &&
                                            "border-destructive",
                                    )}
                                />
                                {formErrors?.name && (
                                    <p className="text-xs text-destructive">
                                        {formErrors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-tag-slug">Slug</Label>
                                <div className="flex relative items-center">
                                    <span className="absolute left-2.5 text-muted-foreground">
                                        <Hash className="h-3.5 w-3.5" />
                                    </span>
                                    <Input
                                        id="edit-tag-slug"
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData("slug", e.target.value)
                                        }
                                        className={cn(
                                            "pl-8 font-mono text-sm",
                                            formErrors?.slug &&
                                                "border-destructive",
                                        )}
                                    />
                                </div>
                                {formErrors?.slug && (
                                    <p className="text-xs text-destructive">
                                        {formErrors.slug}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Used in URLs: /tag/{data.slug}
                                </p>
                            </div>

                            {selectedTag && selectedTag.posts_count > 0 && (
                                <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
                                    <div className="flex gap-2 items-start">
                                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                                        <p className="text-sm text-amber-800">
                                            This tag is used in{" "}
                                            {selectedTag.posts_count}{" "}
                                            {selectedTag.posts_count === 1
                                                ? "post"
                                                : "posts"}
                                            . Changes will affect all tagged
                                            content.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowEditDialog(false);
                                    setSelectedTag(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdateTag}
                                disabled={processing}
                            >
                                {processing ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
            </AuthLayout>
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the tag "
                            {selectedTag?.name}"?
                            {(selectedTag?.posts_count ?? 0) > 0 && (
                                <p className="mt-2 font-medium text-destructive">
                                    Warning: This tag is used in{" "}
                                    {selectedTag?.posts_count}{" "}
                                    {selectedTag?.posts_count === 1
                                        ? "post"
                                        : "posts"}
                                    . Deleting it will remove the tag from all
                                    posts.
                                </p>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteTag}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
