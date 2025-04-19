import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@novus/Components/ui/alert";
import { Textarea } from "@novus/Components/ui/textarea";
import { Label } from "@novus/Components/ui/label";
import { Button } from "@novus/Components/ui/button";
import { AlertTriangle, ArrowRight, Check, Code, Sparkles } from "lucide-react";
import { TabProps } from "@novus/types/post";
import { cn } from "@novus/lib/utils";

const StructuredDataTab: React.FC<TabProps> = ({ data, setData, errors }) => {
    const [jsonLdError, setJsonLdError] = useState<string | null>(null);
    const [jsonLdParsed, setJsonLdParsed] = useState<any>(null);

    // Validate JSON-LD whenever structured_data changes
    useEffect(() => {
        const validateJsonLd = (value: string) => {
            if (!value) {
                setJsonLdError(null);
                setJsonLdParsed(null);
                return;
            }

            try {
                const parsed = JSON.parse(value);
                setJsonLdParsed(parsed);
                setJsonLdError(null);
            } catch (error) {
                setJsonLdError("Invalid JSON-LD format");
                setJsonLdParsed(null);
            }
        };

        validateJsonLd(data.structured_data || "");
    }, [data.structured_data]);

    // Handle JSON-LD validation and updating
    const handleJsonLdChange = (value: string) => {
        setData("structured_data", value);
    };

    // Generate a default JSON-LD template for blog posts
    const generateBlogPostJsonLd = () => {
        const template = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: data.title || "Post title",
            description: data.excerpt || data.seo_description || "",
            author: {
                "@type": "Person",
                name: "Author Name",
            },
            datePublished: data.published_at || new Date().toISOString(),
            dateModified: new Date().toISOString(),
            image: data.og_image || "",
            publisher: {
                "@type": "Organization",
                name: "Your Organization",
                logo: {
                    "@type": "ImageObject",
                    url: "https://yourdomain.com/logo.png",
                },
            },
            mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://yourdomain.com/${data.slug}`,
            },
        };

        setData("structured_data", JSON.stringify(template, null, 2));
    };

    return (
        <>
            <div className="flex justify-between items-center mb-2">
                <Label
                    htmlFor="structured-data"
                    className="font-medium text-sm"
                >
                    JSON-LD Schema Markup
                </Label>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={generateBlogPostJsonLd}
                    className="h-8 gap-1.5 shadow-sm"
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span className="text-xs">Generate Template</span>
                </Button>
            </div>

            <Textarea
                id="structured-data"
                value={data.structured_data || ""}
                onChange={(e) => handleJsonLdChange(e.target.value)}
                placeholder="Paste or write your schema markup here..."
                className={cn(
                    "min-h-[200px] font-mono text-xs shadow-sm leading-relaxed focus:ring-primary/20",
                    jsonLdError &&
                        "border-red-300 dark:border-red-800 focus-visible:ring-red-500/20",
                    data.structured_data &&
                        !jsonLdError &&
                        "border-green-300 dark:border-green-800 focus-visible:ring-green-500/20",
                )}
            />

            {jsonLdError ? (
                <Alert className="bg-red-50/50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 py-2.5 px-4">
                    <div className="flex gap-1.5 items-center">
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <AlertDescription className="text-sm text-red-600 dark:text-red-400 font-medium">
                            {jsonLdError}
                        </AlertDescription>
                    </div>
                </Alert>
            ) : data.structured_data ? (
                <Alert className="bg-green-50/50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50 py-2.5 px-4">
                    <div className="flex gap-1.5 items-center">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <AlertDescription className="text-sm text-green-600 dark:text-green-400 font-medium">
                            Valid JSON-LD structure detected
                        </AlertDescription>
                    </div>
                </Alert>
            ) : null}

            <Alert className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/30 dark:to-gray-900/30 border-gray-200/80 dark:border-gray-700/50 mt-4 py-3 px-4">
                <div className="flex gap-2 items-start">
                    <Code className="w-4 h-4 flex-shrink-0 text-gray-600 dark:text-gray-400 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">
                            Structured Data Benefits
                        </h4>
                        <AlertDescription className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                            Structured data helps search engines understand your
                            content and can enable rich results in search
                            listings, such as star ratings, recipe information,
                            or event details.{" "}
                            <a
                                href="https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary inline-flex items-center hover:underline"
                            >
                                Learn more
                                <ArrowRight className="ml-1 h-2.5 w-2.5" />
                            </a>
                        </AlertDescription>
                    </div>
                </div>
            </Alert>
        </>
    );
};

export default StructuredDataTab;
