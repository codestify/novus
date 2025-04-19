import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthLayout from "@novus/Layouts/AuthLayout";
import {
    ChevronRight,
    Plus,
    Search,
    Edit,
    Trash2,
    Filter,
    ArrowUpDown,
    Layers,
    FolderTree,
} from "lucide-react";

import { Button } from "@novus/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@novus/Components/ui/card";
import { Input } from "@novus/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@novus/Components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@novus/Components/ui/dropdown-menu";
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
import { Badge } from "@novus/Components/ui/badge";
import { PaginationWrapper } from "@novus/Components/PaginationWrapper";
import { EmptyState } from "@novus/Components/EmptyState";
import useRoute from "@novus/Hooks/useRoute";

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parent_id: number | null;
    parent?: {
        id: number;
        name: string;
    };
    posts_count: number;
    children_count: number;
    created_at: string;
};

type PaginationData = {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    from: number;
    to: number;
};

type Props = {
    categories: {
        data: Category[];
    } & PaginationData;
    errors?: {
        [key: string]: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function Index({ categories, errors, flash }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
        null,
    );
    const route = useRoute();

    const confirmDelete = (category: Category) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (categoryToDelete) {
            router.delete(
                route("novus.categories.destroy", categoryToDelete.id),
                {
                    onSuccess: () => {
                        setDeleteDialogOpen(false);
                        setCategoryToDelete(null);
                    },
                },
            );
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("novus.categories.index"),
            { search: searchQuery },
            { preserveState: true },
        );
    };

    return (
        <>
            <Head title="Categories" />

            <AuthLayout>
                <div className="py-20">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Categories
                            </h1>
                            <p className="mt-1 text-muted-foreground">
                                Manage the categories for your content
                            </p>
                        </div>
                        <Button asChild>
                            <Link href={route("novus.categories.create")}>
                                <Plus className="mr-2 w-4 h-4" />
                                New Category
                            </Link>
                        </Button>
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

                    <Card className="shadow-xs rounded-md border-muted">
                        <CardHeader className="pb-3">
                            <CardTitle>All Categories</CardTitle>
                            <CardDescription>
                                Create and manage categories to organize your
                                content
                            </CardDescription>
                        </CardHeader>

                        <div className="px-6 pt-2 pb-5 border-b">
                            <div className="flex justify-between items-center">
                                <form
                                    onSubmit={handleSearchSubmit}
                                    className="relative w-72"
                                >
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search categories..."
                                        className="pl-8 h-9"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </form>

                                <div className="flex gap-2 items-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1 h-8"
                                            >
                                                <Filter className="h-3.5 w-3.5" />
                                                <span>Filter</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-[200px]"
                                        >
                                            <DropdownMenuItem>
                                                All Categories
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Has Children
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Without Parent
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                With Posts
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                                                <span>Sort by Name</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                                                <span>Sort by Created</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>

                        <CardContent className="px-6">
                            {categories.data.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Parent</TableHead>
                                            <TableHead>Posts</TableHead>
                                            <TableHead>Children</TableHead>
                                            <TableHead>Slug</TableHead>
                                            <TableHead className="w-[100px] text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {categories.data.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center">
                                                        <FolderTree className="mr-2 w-4 h-4 text-primary/70" />
                                                        {category.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {category.parent ? (
                                                        <div className="flex items-center">
                                                            <Layers className="mr-1 w-4 h-4 text-muted-foreground" />
                                                            <span className="text-sm">
                                                                {
                                                                    category
                                                                        .parent
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className="font-normal bg-secondary/30"
                                                        >
                                                            None
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {category.posts_count}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {
                                                            category.children_count
                                                        }
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {category.slug}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                            className="w-8 h-8"
                                                        >
                                                            <Link
                                                                href={route(
                                                                    "novus.categories.edit",
                                                                    category.id,
                                                                )}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                                <span className="sr-only">
                                                                    Edit
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="w-8 h-8 text-destructive"
                                                            onClick={() =>
                                                                confirmDelete(
                                                                    category,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            <span className="sr-only">
                                                                Delete
                                                            </span>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <EmptyState
                                    icon={<FolderTree className="w-10 h-10" />}
                                    title="No categories found"
                                    description="Get started by creating your first category."
                                    action={
                                        <Button asChild>
                                            <Link
                                                href={route(
                                                    "novus.categories.create",
                                                )}
                                            >
                                                <Plus className="mr-2 w-4 h-4" />
                                                Create Category
                                            </Link>
                                        </Button>
                                    }
                                    className="py-12"
                                />
                            )}
                        </CardContent>

                        {categories.data.length > 0 &&
                            categories.last_page > 1 && (
                                <CardFooter className="flex justify-between items-center px-6 py-4 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        Showing{" "}
                                        <strong>{categories.from}</strong> to{" "}
                                        <strong>{categories.to}</strong> of{" "}
                                        <strong>{categories.total}</strong>{" "}
                                        categories
                                    </div>

                                    <PaginationWrapper
                                        currentPage={categories.current_page}
                                        lastPage={categories.last_page}
                                        links={categories.links}
                                        onPageChange={(page: number) =>
                                            router.get(
                                                route(
                                                    "novus.categories.index",
                                                    { page },
                                                ),
                                                {},
                                                { preserveState: true },
                                            )
                                        }
                                    />
                                </CardFooter>
                            )}
                    </Card>
                </div>
            </AuthLayout>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the category "
                            {categoryToDelete?.name}".
                            {((categoryToDelete?.posts_count ?? 0) > 0 ||
                                (categoryToDelete?.children_count ?? 0) >
                                    0) && (
                                <div className="mt-2 text-destructive">
                                    Warning: This category has associated posts
                                    or child categories. Deleting it may affect
                                    your content structure.
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
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
