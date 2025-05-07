import React, { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ChevronRight,
    ExternalLink,
    Info,
    Lightbulb,
    Save,
    Tag,
    X,
} from "lucide-react";
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
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@novus/Components/ui/accordion";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@novus/Components/ui/tooltip";
import { Alert, AlertDescription } from "@novus/Components/ui/alert";
import { cn } from "@novus/lib/utils";
import useRoute from "@novus/hooks/useRoute";

type ParentCategory = {
    id: number;
    name: string;
};

type Props = {
    parentCategories: ParentCategory[];
    errors?: {
        [key: string]: string;
    };
};

export default function Create({ parentCategories, errors }: Props) {
    const [autoSlug, setAutoSlug] = useState(true);
    const route = useRoute();

    const { data, setData, post, processing } = useForm({
        name: "",
        slug: "",
        description: "",
        parent_id: null as number | null,
        seo: {
            meta_title: "",
            meta_description: "",
            canonical_url: "",
            meta_keywords: "",
        },
    });

    // Generate slug from name
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
        post(route("novus.categories.store"));
    };

    return (
        <>
            <Head title="Create Category" />

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
                            <span>Create</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold tracking-tight">
                                Create Category
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
                                    {processing ? "Saving..." : "Save Category"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Main Content */}
                            <div className="space-y-6 lg:col-span-2">
                                <Card className="shadow-xs rounded-md border-muted">
                                    <CardHeader>
                                        <CardTitle>
                                            Category Information
                                        </CardTitle>
                                        <CardDescription>
                                            Enter the basic information for your
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
                                                    errors?.name &&
                                                        "border-destructive",
                                                )}
                                            />
                                            {errors?.name && (
                                                <div className="text-sm text-destructive">
                                                    {errors.name}
                                                </div>
                                            )}
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
                                                    errors?.slug &&
                                                        "border-destructive",
                                                )}
                                                readOnly={autoSlug}
                                            />
                                            {errors?.slug && (
                                                <div className="text-sm text-destructive">
                                                    {errors.slug}
                                                </div>
                                            )}
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
                                <Card className="shadow-xs rounded-md border-muted">
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
                                                        className="font-mono text-sm shadow-none h-9"
                                                    />
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
                                                        className="min-h-[80px] font-mono text-sm shadow-none"
                                                    />
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
                                                        className="font-mono text-sm shadow-none h-9"
                                                    />
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
                                                        className="font-mono text-sm shadow-none h-9"
                                                    />
                                                    <p className="text-sm text-muted-foreground">
                                                        Comma-separated keywords
                                                        (less important for
                                                        modern SEO)
                                                    </p>
                                                </div>
                                            </TabsContent>
                                        </Tabs>

                                        <Alert className="bg-primary/5 border-primary/20">
                                            <div className="flex gap-2 items-center">
                                                <Info className="w-4 h-4" />
                                                <AlertDescription>
                                                    Good SEO practices help your
                                                    content rank better in
                                                    search results
                                                </AlertDescription>
                                            </div>
                                        </Alert>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <Card className="shadow-xs rounded-md border-muted">
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
                                                    {parentCategories.map(
                                                        (category) => (
                                                            <SelectItem
                                                                key={
                                                                    category.id
                                                                }
                                                                value={category.id.toString()}
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-sm text-muted-foreground">
                                                Categories can be nested to
                                                create a hierarchy
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
                                                            {data.slug ||
                                                                "category-slug"}
                                                        </span>
                                                    </span>
                                                    <ExternalLink className="flex-shrink-0 ml-1 w-3 h-3 text-muted-foreground" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-xs rounded-md border-muted">
                                    <CardHeader>
                                        <CardTitle>Publishing</CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-4">
                                            <p className="text-sm text-muted-foreground">
                                                This category will be available
                                                immediately after creation.
                                            </p>

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={processing}
                                            >
                                                <Save className="mr-2 w-4 h-4" />
                                                {processing
                                                    ? "Saving..."
                                                    : "Save Category"}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-xs rounded-md border-muted">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2">
                                            <Lightbulb className="w-4 h-4 text-primary" />
                                            Tips
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="space-y-4 text-sm">
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger className="text-sm">
                                                    Organizing Categories
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <ul className="pl-5 space-y-1 list-disc text-muted-foreground">
                                                        <li>
                                                            Keep category names
                                                            short and
                                                            descriptive
                                                        </li>
                                                        <li>
                                                            Use a logical
                                                            hierarchy with
                                                            parent/child
                                                            relationships
                                                        </li>
                                                        <li>
                                                            Don't create too
                                                            many top-level
                                                            categories
                                                        </li>
                                                        <li>
                                                            Categories should be
                                                            broad enough to
                                                            contain multiple
                                                            posts
                                                        </li>
                                                    </ul>
                                                </AccordionContent>
                                            </AccordionItem>

                                            <AccordionItem value="item-2">
                                                <AccordionTrigger className="text-sm">
                                                    SEO Best Practices
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <ul className="pl-5 space-y-1 list-disc text-muted-foreground">
                                                        <li>
                                                            Use relevant
                                                            keywords in your
                                                            category name and
                                                            description
                                                        </li>
                                                        <li>
                                                            Create unique meta
                                                            titles and
                                                            descriptions
                                                        </li>
                                                        <li>
                                                            Keep URLs clean and
                                                            readable
                                                        </li>
                                                        <li>
                                                            Avoid duplicate
                                                            categories that
                                                            serve the same
                                                            purpose
                                                        </li>
                                                    </ul>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </AuthLayout>
        </>
    );
}
