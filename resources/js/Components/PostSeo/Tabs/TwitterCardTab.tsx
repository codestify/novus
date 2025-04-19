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
import { X as Twitter } from "lucide-react";
import { TabProps, TwitterCardType } from "@novus/types/post";
import { MediaSelection } from "@novus/types/media";
import FieldWithCount from "@novus/Components/FieldWithCount";
import { MediaSelector } from "@novus/Components/Media/MediaSelector";

const TwitterCardTab: React.FC<TabProps> = ({ data, setData, errors }) => {
    // State to track the selected media ID
    const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null);

    // Effect to extract media ID from URL if it exists when component mounts
    useEffect(() => {
        if (data.twitter_image) {
            // If you store the media ID directly, you could use it here
            // For now, we'll just set it to a non-null value to show the checkmark
            setSelectedMediaId(1); // Placeholder ID
        }
    }, []);

    const handleTwitterImageSelect = (media: MediaSelection | null) => {
        if (media) {
            setData("twitter_image", media.url);
            setSelectedMediaId(media.id || null);
        } else {
            setData("twitter_image", "");
            setSelectedMediaId(null);
        }
    };

    return (
        <>
            <FieldWithCount
                label="Twitter Title"
                fieldName="twitter_title"
                placeholder="Enter Twitter title"
                maxLength={70}
                description="Title displayed when sharing on Twitter. Defaults to OG Title or Meta Title if blank."
                data={data}
                setData={setData}
                errors={errors}
            />

            <FieldWithCount
                label="Twitter Description"
                fieldName="twitter_description"
                placeholder="Enter Twitter description..."
                maxLength={200}
                description="Description shown when sharing on Twitter. Recommended length: up to 200 characters for optimal display."
                isTextarea={true}
                data={data}
                setData={setData}
                errors={errors}
            />

            <div className="space-y-2">
                <Label htmlFor="twitter-card" className="font-medium text-sm">
                    Twitter Card Type
                </Label>
                <Select
                    value={data.twitter_card || "summary_large_image"}
                    onValueChange={(value) =>
                        setData("twitter_card", value as TwitterCardType)
                    }
                >
                    <SelectTrigger
                        id="twitter-card"
                        className="h-9 focus:ring-primary/20"
                    >
                        <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="summary_large_image">
                            Summary with Large Image
                        </SelectItem>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="app">App</SelectItem>
                        <SelectItem value="player">Player</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Type of Twitter card. 'Summary with Large Image' is
                    recommended for most content.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="twitter-image" className="font-medium text-sm">
                    Twitter Image
                </Label>
                <div className="flex gap-2 items-start">
                    <div className="flex-grow">
                        <Input
                            id="twitter-image"
                            value={data.twitter_image || ""}
                            onChange={(e) => {
                                setData("twitter_image", e.target.value);
                                // If user manually clears the input
                                if (!e.target.value) {
                                    setSelectedMediaId(null);
                                }
                            }}
                            placeholder="URL to image or select from media library"
                            className="font-mono text-sm shadow-sm h-9 focus:ring-primary/20"
                        />
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 shadow-sm"
                            >
                                <Twitter className="mr-2 h-4 w-4" />
                                Select Image
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[600px] p-0" align="end">
                            <MediaSelector
                                onSelect={handleTwitterImageSelect}
                                selectedId={selectedMediaId}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    For 'Summary with Large Image': minimum 300×157 pixels. Will
                    use OG image if blank.
                </p>
            </div>

            <Alert className="bg-[#1da1f233]/10 dark:bg-[#1da1f2]/10 border-[#1da1f2]/20 dark:border-[#1da1f2]/30 mt-2 py-3 px-4">
                <div className="flex gap-2 items-start">
                    <Twitter className="w-4 h-4 text-[#1da1f2] flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-sm text-[#1da1f2] dark:text-[#1da1f2] mb-1">
                            Twitter Card Tips
                        </h4>
                        <AlertDescription className="text-xs leading-relaxed text-sky-600/80 dark:text-sky-400/80">
                            Twitter Cards make your tweets stand out with rich
                            media attachments. Summary cards with large images
                            typically see higher engagement rates and more
                            retweets than standard tweets.
                        </AlertDescription>
                    </div>
                </div>
            </Alert>
        </>
    );
};

export default TwitterCardTab;
