import React, { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { ChevronRight, ExternalLink, Save, Tag, Trash2, X } from "lucide-react";
import AuthLayout from "@novus/Layouts/AuthLayout";

import { Button } from "@novus/Components/ui/button";
import { Input } from "@novus/Components/ui/input";
import { Textarea } from "@novus/Components/ui/textarea";
import { Label } from "@novus/Components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@novus/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@novus/Components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@novus/Components/ui/tabs";
import { Separator } from "@novus/Components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@novus/Components/ui/tooltip";
import { Alert, AlertDescription } from "@novus/Components/ui/alert";
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
import { cn } from "@novus/lib/utils";
import useRoute from "@novus/Hooks/useRoute";
import useTypedPage from "@novus/Hooks/useTypePage";

export default function Edit() {
    const [autoSlug, setAutoSlug] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const route = useRoute();
    const page = useTypedPage();
    const { category, parent_categories: parentCategories } = page.props;

    const {
        data,
        setData,
        patch,
        errors,
        delete: destroy,
        processing,
    } = useForm({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        parent_id: category.parent_id,
        seo: {
            meta_title: category.seo_meta?.meta_title || "",
            meta_description: category.seo_meta?.meta_description || "",
            canonical_url: category.seo_meta?.canonical_url || "",
            meta_keywords: category.seo_meta?.meta_keywords || "",
        },
    });

    // Helper function to display field errors
    const displayError = (field: string) => {
        const error = (errors as any)[field];
        if (!error) return null;

        return (
            <div className="mt-[-4px] text-sm text-destructive">{error}</div>
        );
    };

    // Helper function to check if a field has an error
    const hasError = (field: string) => {
        return !!(errors as any)[field];
    };

    // Set parent_id to null when there are no parent categories
    useEffect(() => {
        if (parentCategories?.length === 0 && data.parent_id !== null) {
            setData("parent_id", null);
        } else if (
            category.parent_category &&
            data.parent_id !== category.parent_category.id
        ) {
            // Set the parent_id to match the parent_category.id if available
            setData("parent_id", category.parent_category.id);
        }
    }, [parentCategories, category.parent_category]);

    // Generate slug from name when in auto mode
    useEffect(() => {
        if (autoSlug && data.name) {
            const slug = data.name
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .trim();

            setData("slug", slug);
        }
    }, [data.name, autoSlug]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route("novus.categories.update", category.id));
    };

    const handleDelete = () => {
        destroy(route("novus.categories.destroy", category.id));
    };

    const createdDate = new Date(category.created_at).toLocaleString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        },
    );

    const updatedDate = new Date(category.updated_at).toLocaleString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        },
    );

    return (
        <>
            <Head title={`Edit Category: ${category.name}`} />
            <AuthLayout>
                <div className="py-20 space-y-6">
                    {/* Breadcrumb and title */}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Link
                                href={route("novus.categories.index")}
                                className="transition-colors hover:text-primary"
                            >
                                Categories
                            </Link>
                            <ChevronRight className="mx-1 w-4 h-4" />
                            <span className="truncate">{category.name}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold tracking-tight">
                                Edit Category
                            </h1>

                            <div className="flex gap-2 items-center">
                                <Button variant="outline" asChild>
                                    <Link
                                        href={route("novus.categories.index")}
                                    >
                                        <X className="mr-2 w-4 h-4" />
                                        Cancel
                                    </Link>
                                </Button>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={processing}
                                >
                                    <Save className="mr-2 w-4 h-4" />
                                    {processing ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Main Content */}
                            <div className="space-y-6 lg:col-span-2">
                                <Card className="rounded-md shadow-xs">
                                    <CardHeader>
                                        <CardTitle>
                                            Category Information
                                        </CardTitle>
                                        <CardDescription>
                                            Edit the basic information for this
                                            category
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Category Name{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                className={cn(
                                                    "shadow-none h-9",
                                                    hasError("name") &&
                                                        "border-destructive",
                                                )}
                                            />
                                            {displayError("name")}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label htmlFor="slug">
                                                    Slug
                                                </Label>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 px-1.5"
                                                                onClick={() =>
                                                                    setAutoSlug(
                                                                        !autoSlug,
                                                                    )
                                                                }
                                                            >
                                                                <Tag className="h-3.5 w-3.5 mr-1" />
                                                                <span className="text-xs">
                                                                    {autoSlug
                                                                        ? "Auto"
                                                                        : "Manual"}
                                                                </span>
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                Toggle between
                                                                automatic and
                                                                manual slug
                                                                generation
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Input
                                                id="slug"
                                                value={data.slug}
                                                onChange={(e) => {
                                                    setAutoSlug(false);
                                                    setData(
                                                        "slug",
                                                        e.target.value,
                                                    );
                                                }}
                                                className={cn(
                                                    "font-mono text-sm shadow-none h-9",
                                                    autoSlug &&
                                                        "text-muted-foreground",
                                                    hasError("slug") &&
                                                        "border-destructive",
                                                )}
                                                readOnly={autoSlug}
                                            />
                                            {displayError("slug")}
                                            <Alert className="bg-muted border-muted-foreground/20">
                                                <AlertDescription className="text-xs text-muted-foreground">
                                                    <strong>Warning:</strong>{" "}
                                                    Changing the slug may break
                                                    existing links to this
                                                    category.
                                                </AlertDescription>
                                            </Alert>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value={data.description || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "description",
                                                        e.target.value,
                                                    )
                                                }
                                                className="min-h-[120px] shadow-none"
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                Briefly describe what this
                                                category is about. This may be
                                                displayed on your site.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* SEO Section */}
                                <Card className="rounded-md shadow-xs">
                                    <CardHeader>
                                        <CardTitle>
                                            Search Engine Optimization
                                        </CardTitle>
                                        <CardDescription>
                                            Customize how this category appears
                                            in search engines
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <Tabs
                                            defaultValue="basic"
                                            className="w-full"
                                        >
                                            <TabsList className="grid grid-cols-2 w-full">
                                                <TabsTrigger value="basic">
                                                    Basic SEO
                                                </TabsTrigger>
                                                <TabsTrigger value="advanced">
                                                    Advanced
                                                </TabsTrigger>
                                            </TabsList>

                                            <TabsContent
                                                value="basic"
                                                className="pt-4 space-y-4"
                                            >
                                                <div className="space-y-2">
                                                    <Label htmlFor="meta_title">
                                                        Meta Title
                                                    </Label>
                                                    <Input
                                                        id="meta_title"
                                                        value={
                                                            data.seo
                                                                .meta_title ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setData("seo", {
                                                                ...data.seo,
                                                                meta_title:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className={cn(
                                                            "h-9 font-mono text-sm shadow-none",
                                                            hasError(
                                                                "seo.meta_title",
                                                            ) &&
                                                                "border-destructive",
                                                        )}
                                                    />
                                                    {displayError(
                                                        "seo.meta_title",
                                                    )}
                                                    <p className="text-sm text-muted-foreground">
                                                        Defaults to category
                                                        name if left blank
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="meta_description">
                                                        Meta Description
                                                    </Label>
                                                    <Textarea
                                                        id="meta_description"
                                                        value={
                                                            data.seo
                                                                .meta_description ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setData("seo", {
                                                                ...data.seo,
                                                                meta_description:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className={cn(
                                                            "min-h-[80px] font-mono text-sm shadow-none",
                                                            hasError(
                                                                "seo.meta_description",
                                                            ) &&
                                                                "border-destructive",
                                                        )}
                                                    />
                                                    {displayError(
                                                        "seo.meta_description",
                                                    )}
                                                    <p className="text-sm text-muted-foreground">
                                                        A brief description of
                                                        this category for search
                                                        engines (recommended:
                                                        150-160 characters)
                                                    </p>
                                                </div>
                                            </TabsContent>

                                            <TabsContent
                                                value="advanced"
                                                className="pt-4 space-y-4"
                                            >
                                                <div className="space-y-2">
                                                    <Label htmlFor="canonical_url">
                                                        Canonical URL
                                                    </Label>
                                                    <Input
                                                        id="canonical_url"
                                                        value={
                                                            data.seo
                                                                .canonical_url ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setData("seo", {
                                                                ...data.seo,
                                                                canonical_url:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className={cn(
                                                            "h-9 font-mono text-sm shadow-none",
                                                            hasError(
                                                                "seo.canonical_url",
                                                            ) &&
                                                                "border-destructive",
                                                        )}
                                                    />
                                                    {displayError(
                                                        "seo.canonical_url",
                                                    )}
                                                    <p className="text-sm text-muted-foreground">
                                                        The preferred URL for
                                                        this category (leave
                                                        blank to use the default
                                                        URL)
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="meta_keywords">
                                                        Meta Keywords
                                                    </Label>
                                                    <Input
                                                        id="meta_keywords"
                                                        value={
                                                            data.seo
                                                                .meta_keywords ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setData("seo", {
                                                                ...data.seo,
                                                                meta_keywords:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className={cn(
                                                            "h-9 font-mono text-sm shadow-none",
                                                            hasError(
                                                                "seo.meta_keywords",
                                                            ) &&
                                                                "border-destructive",
                                                        )}
                                                    />
                                                    {displayError(
                                                        "seo.meta_keywords",
                                                    )}
                                                    <p className="text-sm text-muted-foreground">
                                                        Comma-separated keywords
                                                        (less important for
                                                        modern SEO)
                                                    </p>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <Card className="rounded-md shadow-xs">
                                    <CardHeader>
                                        <CardTitle>Category Settings</CardTitle>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="parent">
                                                Parent Category
                                            </Label>
                                            <Select
                                                value={
                                                    data.parent_id?.toString() ||
                                                    "none"
                                                }
                                                onValueChange={(value) =>
                                                    setData(
                                                        "parent_id",
                                                        value === "none"
                                                            ? null
                                                            : parseInt(
                                                                  value,
                                                                  10,
                                                              ),
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-9">
                                                    <SelectValue placeholder="Select a parent category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">
                                                        None (Top Level)
                                                    </SelectItem>
                                                    {parentCategories &&
                                                    parentCategories.length >
                                                        0 ? (
                                                        parentCategories.map(
                                                            (parentCategory) =>
                                                                parentCategory.id !==
                                                                    category.id && (
                                                                    <SelectItem
                                                                        key={
                                                                            parentCategory.id
                                                                        }
                                                                        value={parentCategory.id.toString()}
                                                                    >
                                                                        {
                                                                            parentCategory.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                        )
                                                    ) : (
                                                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                            No other categories
                                                            available
                                                        </div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-sm text-muted-foreground">
                                                {!parentCategories ||
                                                parentCategories.length === 0
                                                    ? "No other categories available. This will be a top-level category."
                                                    : "Categories can be nested to create a hierarchy"}
                                            </p>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="mb-2 text-sm font-medium">
                                                Category URL Preview
                                            </h3>
                                            <div className="p-3 rounded-md bg-muted">
                                                <div className="flex items-center">
                                                    <span className="font-mono text-xs truncate text-muted-foreground">
                                                        {window.location.origin}
                                                        /category/
                                                        {data.parent_id
                                                            ? `parent-slug/`
                                                            : ""}
                                                        <span className="font-semibold text-foreground">
                                                            {data.slug}
                                                        </span>
                                                    </span>
                                                    <ExternalLink className="flex-shrink-0 ml-1 w-3 h-3 text-muted-foreground" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-md shadow-xs">
                                    <CardHeader>
                                        <CardTitle>Publishing</CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex flex-col space-y-1">
                                                <div className="text-sm">
                                                    <span className="text-muted-foreground">
                                                        Created:{" "}
                                                    </span>
                                                    <span className="font-medium">
                                                        {createdDate}
                                                    </span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-muted-foreground">
                                                        Last modified:{" "}
                                                    </span>
                                                    <span className="font-medium">
                                                        {updatedDate}
                                                    </span>
                                                </div>
                                            </div>

                                            <Separator />

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={processing}
                                            >
                                                <Save className="mr-2 w-4 h-4" />
                                                {processing
                                                    ? "Saving..."
                                                    : "Save Changes"}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-md shadow-xs border-destructive/20">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-destructive">
                                            Danger Zone
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">
                                                Permanently delete this category
                                                and all of its data.
                                            </p>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                className="w-full"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="mr-2 w-4 h-4" />
                                                Delete Category
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
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
                            This will permanently delete the "{category.name}"
                            category. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="text-white cursor-pointer bg-destructive hover:bg-destructive/90"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
