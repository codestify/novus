import React, { useState, useEffect, useRef } from "react";
import { Card } from "@novus/Components/ui/card";
import { Input } from "@novus/Components/ui/input";
import { Button } from "@novus/Components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@novus/Components/ui/tabs";
import { AlertCircle, Check, Edit2, Eye, FileEdit, Link } from "lucide-react";
import NovelEditor from "@novus/Components/NovelEditor";
import { PostEditorProps } from "@novus/types/post";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@novus/Components/ui/tooltip";
import "highlight.js/styles/github.css";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import php from "highlight.js/lib/languages/php";
import python from "highlight.js/lib/languages/python";
import json from "highlight.js/lib/languages/json";
import sql from "highlight.js/lib/languages/sql";

// Register languages
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("php", php);
hljs.registerLanguage("python", python);
hljs.registerLanguage("json", json);
hljs.registerLanguage("sql", sql);

const PostEditor = ({
    data,
    setData,
    errors,
    content,
    onContentChange,
}: PostEditorProps) => {
    const [currentTab, setCurrentTab] = useState("write");
    const [editingSlug, setEditingSlug] = useState(false);
    const previewContainerRef = useRef<HTMLDivElement>(null);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleSlugEdit = () => {
        setEditingSlug(!editingSlug);

        if (editingSlug && !data.slug) {
            // If user tries to save an empty slug, generate one from title
            const slug = generateSlug(data.title);
            setData("slug", slug);
        }
    };

    // Highlight code blocks when switching to preview tab
    useEffect(() => {
        if (currentTab === "preview" && content) {
            const timer = setTimeout(() => {
                const codeBlocks = document.querySelectorAll(
                    ".preview-content pre code",
                );
                if (codeBlocks.length > 0) {
                    codeBlocks.forEach((block) => {
                        const element = block as HTMLElement;
                        element.classList.add("hljs");

                        // Get language from class if present
                        const languageClass = Array.from(
                            element.classList,
                        ).find((cls) => cls.startsWith("language-"));
                        const language = languageClass
                            ? languageClass.replace("language-", "")
                            : null;

                        if (language) {
                            try {
                                hljs.highlightElement(element);
                            } catch (e) {
                                console.warn("Error highlighting code:", e);
                            }
                        }
                    });
                }
            }, 50);

            return () => clearTimeout(timer);
        }
    }, [currentTab, content]);

    return (
        <Card className="rounded-lg border-muted shadow-xs">
            {/* Title section with improved styling */}
            <div className="p-6 border-b border-border">
                <div>
                    <div className="flex">
                        <Input
                            placeholder="Write your title..."
                            className="w-full !text-3xl font-bold py-2 px-0 shadow-none h-auto border-none focus-visible:ring-0 placeholder:text-muted-foreground/60 placeholder:font-normal"
                            value={data.title}
                            onChange={(e) => {
                                const newTitle = e.target.value;
                                setData("title", newTitle);

                                // Only auto-generate slug when it's empty or matches previous auto-generation
                                if (
                                    !data.slug ||
                                    data.slug === generateSlug(data.title)
                                ) {
                                    const slug = generateSlug(newTitle);
                                    setData("slug", slug);
                                }
                            }}
                        />
                    </div>
                    {errors.title && (
                        <div className="flex justify-start mt-1 text-xs text-red-500">
                            <span className="flex items-center">
                                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                                {errors.title}
                            </span>
                        </div>
                    )}
                </div>

                {/* Improved permalink section */}
                <div className="flex items-center mt-4 text-sm text-muted-foreground group">
                    <div className="flex gap-1 items-center shrink-0 text-muted-foreground/80">
                        <Link className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium tracking-wide uppercase">
                            Permalink:
                        </span>
                    </div>

                    <div className="flex overflow-hidden items-center px-2 py-1 ml-2 max-w-xl rounded-md bg-muted">
                        <span className="shrink-0 text-muted-foreground/70 mr-0.5">
                            /posts/
                        </span>

                        {editingSlug ? (
                            <div className="flex-1 flex items-center w-full min-w-[250px]">
                                <Input
                                    placeholder="post-slug"
                                    className="px-2 py-0.5 h-6 text-sm shadow-none border-none bg-transparent focus-visible:ring-0 w-full min-w-[400px]"
                                    value={data.slug}
                                    autoFocus
                                    onChange={(e) => {
                                        setData("slug", e.target.value);
                                    }}
                                />
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="ml-1 w-6 h-6 shrink-0 text-muted-foreground hover:text-foreground"
                                                onClick={handleSlugEdit}
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Save permalink</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        ) : (
                            <div className="flex flex-1 items-center">
                                <span className="text-sm truncate text-foreground">
                                    {data.slug}
                                </span>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="ml-1 w-6 h-6 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-foreground"
                                                onClick={handleSlugEdit}
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit permalink</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        )}
                    </div>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="ml-1 w-7 h-7 text-muted-foreground hover:text-foreground"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const slug = generateSlug(data.title);
                                        setData("slug", slug);
                                        setEditingSlug(false);
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-3.5 h-3.5"
                                    >
                                        <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
                                        <line x1="18" y1="9" x2="12" y2="15" />
                                        <line x1="12" y1="9" x2="18" y2="15" />
                                    </svg>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Reset permalink</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {errors.slug && (
                    <div className="flex justify-start mt-1 text-xs text-red-500">
                        <span className="flex items-center">
                            <AlertCircle className="w-3.5 h-3.5 mr-1" />
                            {errors.slug}
                        </span>
                    </div>
                )}
            </div>

            {/* Content editor tabs */}
            <div className="px-6 pt-4 pb-10">
                <Tabs
                    value={currentTab}
                    onValueChange={setCurrentTab}
                    className="w-full"
                >
                    <TabsList className="grid w-[180px] grid-cols-2 mb-4">
                        <TabsTrigger
                            value="write"
                            className="text-sm font-medium cursor-pointer"
                        >
                            <FileEdit className="mr-2 w-4 h-4" />
                            Write
                        </TabsTrigger>
                        <TabsTrigger
                            value="preview"
                            className="text-sm font-medium cursor-pointer"
                        >
                            <Eye className="mr-2 w-4 h-4" />
                            Preview
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="write" className="mt-0">
                        <div className="w-full">
                            <NovelEditor
                                initialContent={content}
                                onChange={onContentChange}
                                aiEnabled={true}
                                placeholder="Start writing your post content here..."
                                className="min-h-[500px] prose prose-sm sm:prose lg:prose-lg !prose-p:max-w-none !max-w-full w-full focus:outline-none p-5"
                                error={!!errors.content}
                            />
                        </div>
                    </TabsContent>
                    {errors.content && (
                        <div className="flex justify-end mt-1 text-sm text-red-500">
                            <span className="flex items-center">
                                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                                {errors.content}
                            </span>
                        </div>
                    )}

                    <TabsContent
                        value="preview"
                        className="mt-0 rounded-lg border border-border"
                    >
                        <div
                            ref={previewContainerRef}
                            className="min-h-[500px] p-10 prose prose-sm sm:prose lg:prose-lg !prose-p:max-w-none !max-w-full w-full"
                        >
                            {content ? (
                                <div
                                    className="preview-content"
                                    dangerouslySetInnerHTML={{
                                        __html: content,
                                    }}
                                />
                            ) : (
                                <div className="flex justify-center items-center h-full text-muted-foreground">
                                    <p>No content to preview yet.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Card>
    );
};

export default PostEditor;
