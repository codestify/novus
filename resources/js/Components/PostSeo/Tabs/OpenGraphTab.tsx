import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@novus/Components/ui/alert";
import { Input } from "@novus/Components/ui/input";
import { Label } from "@novus/Components/ui/label";
import { Button } from "@novus/Components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@novus/Components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@novus/Components/ui/select";
import { Share2 } from "lucide-react";
import { OpenGraphType, TabProps } from "@novus/types/post";
import { MediaSelection } from "@novus/types/media";
import FieldWithCount from "@novus/Components/FieldWithCount";
import { MediaSelector } from "@novus/Components/Media/MediaSelector";

const OpenGraphTab = ({ data, setData, errors }: TabProps) => {
    // State to track the selected media ID
    const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null);

    // Effect to extract media ID from URL if it exists when component mounts
    useEffect(() => {
        // Try to extract the ID if we have media info in the URL
        // This is a simplified approach - you might need a proper method to extract the ID from your URLs
        if (data.og_image) {
            // If you store the media ID directly, you could use it here
            // For now, we'll just set it to a non-null value to show the checkmark
            setSelectedMediaId(1); // Placeholder ID
        }
    }, []);

    // Handle OG image selection
    const handleOgImageSelect = (media: MediaSelection | null) => {
        if (media) {
            setData("og_image", media.url);
            // Ensure the id is a number
            setSelectedMediaId(media.id || null);
        } else {
            setData("og_image", "");
            setSelectedMediaId(null);
        }
    };

    return (
        <>
            <FieldWithCount
                label="Open Graph Title"
                fieldName="og_title"
                placeholder="Enter Open Graph title"
                maxLength={70}
                description="Title displayed when sharing on Facebook and other platforms. Defaults to Meta Title or Post Title if blank."
                data={data}
                setData={setData}
                errors={errors}
            />

            <FieldWithCount
                label="Open Graph Description"
                fieldName="og_description"
                placeholder="Enter Open Graph description..."
                maxLength={200}
                description="Description shown when sharing on social media. Recommended length: up to 200 characters for optimal display."
                isTextarea={true}
                data={data}
                setData={setData}
                errors={errors}
            />

            <div className="space-y-2">
                <Label htmlFor="og-type" className="text-sm font-medium">
                    OG Type
                </Label>
                <Select
                    value={data.og_type || "article"}
                    onValueChange={(value) =>
                        setData("og_type", value as OpenGraphType)
                    }
                >
                    <SelectTrigger
                        id="og-type"
                        className="h-9 focus:ring-primary/20"
                    >
                        <SelectValue placeholder="Select OG type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="book">Book</SelectItem>
                        <SelectItem value="profile">Profile</SelectItem>
                        <SelectItem value="video.movie">Video</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs leading-relaxed text-muted-foreground">
                    Type of content being shared. 'Article' is recommended for
                    blog posts.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="og-image" className="text-sm font-medium">
                    Open Graph Image
                </Label>
                <div className="flex gap-2 items-start">
                    <div className="flex-grow">
                        <Input
                            id="og-image"
                            value={data.og_image || ""}
                            onChange={(e) => {
                                setData("og_image", e.target.value);
                                // If user manually clears the input
                                if (!e.target.value) {
                                    setSelectedMediaId(null);
                                }
                            }}
                            placeholder="URL to image or select from media library"
                            className="h-9 font-mono text-sm shadow-sm focus:ring-primary/20"
                        />
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 shadow-sm"
                            >
                                <Share2 className="mr-2 w-4 h-4" />
                                Select Image
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[600px] p-0" align="end">
                            <MediaSelector
                                onSelect={handleOgImageSelect}
                                selectedId={selectedMediaId}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                    Recommended size: 1200×630 pixels (ratio 1.91:1). Will
                    default to featured image if blank.
                </p>
            </div>

            <Alert className="px-4 py-3 mt-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900/50">
                <div className="flex gap-2 items-start">
                    <Share2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="mb-1 text-sm font-medium text-blue-700 dark:text-blue-300">
                            Social Media Best Practices
                        </h4>
                        <AlertDescription className="text-xs leading-relaxed text-blue-600/80 dark:text-blue-300/80">
                            Open Graph tags significantly enhance your content's
                            appearance when shared on Facebook, LinkedIn, and
                            other social platforms. High-quality images with the
                            right dimensions will maximize engagement.
                        </AlertDescription>
                    </div>
                </div>
            </Alert>
        </>
    );
};

export default OpenGraphTab;
