import React, { useState } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@novus/Components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@novus/Components/ui/tabs";
import {
    Code,
    Eye,
    EyeOff,
    Info,
    Loader2,
    Search,
    Share2,
    Sparkles,
    X as Twitter,
} from "lucide-react";
import { PostSeoProps } from "@novus/types/post";
import { cn } from "@novus/lib/utils";
import { Button } from "@novus/Components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@novus/Components/ui/tooltip";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@novus/Components/ui/alert";
import useRoute from "@novus/Hooks/useRoute";

import BasicSeoTab from "@novus/Components/PostSeo/Tabs/BasicSeoTab";
import OpenGraphTab from "@novus/Components/PostSeo/Tabs/OpenGraphTab";
import TwitterCardTab from "@novus/Components/PostSeo/Tabs/TwitterCardTab";
import StructuredDataTab from "@novus/Components/PostSeo/Tabs/StructuredDataTab";

import GooglePreview from "@novus/Components/PostSeo/Preview/GooglePreview";
import FacebookPreview from "@novus/Components/PostSeo/Preview/FacebookPreview";
import TwitterPreview from "@novus/Components/PostSeo/Preview/TwitterPreview";

const EnhancedPostSeo: React.FC<PostSeoProps> = ({
    data,
    setData,
    errors,
    showPreview = false,
}) => {
    const route = useRoute();
    const [activeTab, setActiveTab] = useState("basic");
    const [activePreviewTab, setActivePreviewTab] = useState("google");
    const [showPreviewPanel, setShowPreviewPanel] = useState(showPreview);
    const [isGenerating, setIsGenerating] = useState(false);
    const [notification, setNotification] = useState<{
        type: "success" | "error";
        title: string;
        message: string;
        visible: boolean;
    } | null>(null);

    const generateSeoWithAI = async () => {
        if (!data.title || !data.content) {
            setNotification({
                type: "error",
                title: "Missing content",
                message:
                    "Please add a title and content before generating SEO metadata",
                visible: true,
            });

            // Auto-hide notification after 5 seconds
            setTimeout(() => setNotification(null), 5000);
            return;
        }

        setIsGenerating(true);

        try {
            const response = await axios.post(route("novus.ai.generate-seo"), {
                title: data.title,
                content: data.content,
                excerpt: data.excerpt,
                categories: data.categories,
                tags: data.tags,
            });

            if (response.data.success && response.data.data) {
                const seoData = response.data.data;

                // Update form with AI-generated data
                setData({
                    ...data,
                    seo_title: seoData.meta_title || data.seo_title,
                    seo_description:
                        seoData.meta_description || data.seo_description,
                    seo_keywords: seoData.meta_keywords || data.seo_keywords,
                    og_title: seoData.og_title || data.og_title,
                    og_description:
                        seoData.og_description || data.og_description,
                    twitter_title: seoData.twitter_title || data.twitter_title,
                    twitter_description:
                        seoData.twitter_description || data.twitter_description,
                });

                // Switch to basic tab to show the results
                setActiveTab("basic");

                setNotification({
                    type: "success",
                    title: "SEO content generated",
                    message:
                        "AI has analyzed your content and created SEO metadata",
                    visible: true,
                });

                // Auto-hide notification after 5 seconds
                setTimeout(() => setNotification(null), 5000);
            } else {
                throw new Error(
                    response.data.message || "Failed to generate SEO content",
                );
            }
        } catch (error: any) {
            console.error("SEO generation error:", error);
            setNotification({
                type: "error",
                title: "Generation failed",
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "An error occurred",
                visible: true,
            });

            // Auto-hide notification after 5 seconds
            setTimeout(() => setNotification(null), 5000);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Card className="shadow-md border-muted/50 mb-6 overflow-hidden">
            {notification && notification.visible && (
                <Alert
                    className={cn(
                        "mx-5 mt-5 mb-0",
                        notification.type === "success"
                            ? "bg-green-50 text-green-800 border-green-200 dark:bg-green-950/20 dark:border-green-900/30 dark:text-green-400"
                            : "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400",
                    )}
                >
                    <AlertTitle className="text-sm">
                        {notification.title}
                    </AlertTitle>
                    <AlertDescription className="text-xs mt-1">
                        {notification.message}
                    </AlertDescription>
                </Alert>
            )}
            <CardHeader className="pb-3 border-b bg-card/50">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-4.5 w-4.5 text-primary/80" />
                            <span>Search Engine Optimization</span>
                        </CardTitle>
                        <CardDescription className="mt-1">
                            Optimize your post for search engines and social
                            media sharing
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={generateSeoWithAI}
                                        className="gap-1.5 h-9 px-3 transition-all duration-200"
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Sparkles className="h-4 w-4 text-amber-500" />
                                        )}
                                        <span>Generate with AI</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    Use AI to generate optimized SEO metadata
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={
                                            showPreviewPanel
                                                ? "secondary"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                            setShowPreviewPanel(
                                                !showPreviewPanel,
                                            )
                                        }
                                        className="gap-1.5 h-9 px-3 transition-all duration-200"
                                    >
                                        {showPreviewPanel ? (
                                            <>
                                                <EyeOff className="h-4 w-4" />
                                                <span>Hide Preview</span>
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="h-4 w-4" />
                                                <span>Show Preview</span>
                                            </>
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    {showPreviewPanel
                                        ? "Hide preview panels"
                                        : "See how your content will appear in search results and social media"}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="inline-flex h-10 mb-4 p-1 bg-muted/50 w-full md:w-auto">
                        <TabsTrigger
                            value="basic"
                            className={cn(
                                "px-4 text-sm transition-all",
                                activeTab === "basic"
                                    ? "text-primary font-medium"
                                    : "text-muted-foreground",
                            )}
                        >
                            <Info className="h-4 w-4 mr-2" />
                            <span>Basic SEO</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="opengraph"
                            className={cn(
                                "px-4 text-sm transition-all",
                                activeTab === "opengraph"
                                    ? "text-primary font-medium"
                                    : "text-muted-foreground",
                            )}
                        >
                            <Share2 className="h-4 w-4 mr-2" />
                            <span>Social Media</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="twitter"
                            className={cn(
                                "px-4 text-sm transition-all",
                                activeTab === "twitter"
                                    ? "text-primary font-medium"
                                    : "text-muted-foreground",
                            )}
                        >
                            <Twitter className="h-4 w-4 mr-2" />
                            <span>Twitter</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="structured"
                            className={cn(
                                "px-4 text-sm transition-all",
                                activeTab === "structured"
                                    ? "text-primary font-medium"
                                    : "text-muted-foreground",
                            )}
                        >
                            <Code className="h-4 w-4 mr-2" />
                            <span>Schema</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Basic SEO Tab */}
                    <TabsContent value="basic" className="space-y-5 pt-2">
                        <BasicSeoTab
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </TabsContent>

                    {/* Open Graph Tab */}
                    <TabsContent value="opengraph" className="space-y-5 pt-2">
                        <OpenGraphTab
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </TabsContent>

                    {/* Twitter Card Tab */}
                    <TabsContent value="twitter" className="space-y-5 pt-2">
                        <TwitterCardTab
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </TabsContent>

                    {/* Structured Data Tab */}
                    <TabsContent value="structured" className="space-y-5 pt-2">
                        <StructuredDataTab
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>

            {/* Preview Section */}
            {showPreviewPanel && (
                <div className="border-t bg-gray-50/50 dark:bg-gray-900/20">
                    <div className="px-5 py-4">
                        <h3 className="text-sm font-semibold mb-3 flex items-center text-gray-700 dark:text-gray-300">
                            <Eye className="w-4 h-4 mr-2 text-primary/70" />
                            Preview Appearances
                        </h3>

                        <Tabs
                            value={activePreviewTab}
                            onValueChange={setActivePreviewTab}
                            className="w-full"
                        >
                            <TabsList className="inline-flex h-8 mb-4 p-1 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm rounded-md w-full md:w-auto">
                                <TabsTrigger
                                    value="google"
                                    className="text-xs px-3 py-1 h-6"
                                >
                                    <Search className="h-3 w-3 mr-1.5" />
                                    <span>Google</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="facebook"
                                    className="text-xs px-3 py-1 h-6"
                                >
                                    <Share2 className="h-3 w-3 mr-1.5" />
                                    <span>Facebook</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="twitter"
                                    className="text-xs px-3 py-1 h-6"
                                >
                                    <Twitter className="h-3 w-3 mr-1.5" />
                                    <span>Twitter</span>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="google" className="mt-0">
                                <GooglePreview data={data} />
                            </TabsContent>

                            <TabsContent value="facebook" className="mt-0">
                                <FacebookPreview data={data} />
                            </TabsContent>

                            <TabsContent value="twitter" className="mt-0">
                                <TwitterPreview data={data} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default EnhancedPostSeo;
