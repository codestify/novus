import React from "react";
import { Label } from "@novus/Components/ui/label";
import { Input } from "@novus/Components/ui/input";
import { Textarea } from "@novus/Components/ui/textarea";
import { Switch } from "@novus/Components/ui/switch";
import { Separator } from "@novus/Components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@novus/Components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@novus/Components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@novus/Components/ui/tooltip";
import { Info } from "lucide-react";
import { MediaCollection, MediaItem } from "@novus/types/media";
import { cn } from "@novus/lib/utils";
import { isImageType } from "@novus/lib/media-helpers";

type MediaFormProps = {
    media: MediaItem;
    collections: MediaCollection[];
    formData: {
        name: string;
        alt_text: string;
        title: string;
        collection_name: string;
        custom_properties: Record<string, any>;
    };
    setData: (key: string, value: any) => void;
    errors?: Record<string, string>;
    disabled?: boolean;
};

export function MediaForm({
    media,
    collections,
    formData,
    setData,
    errors = {},
    disabled = false,
}: MediaFormProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>Media Information</CardTitle>
                <CardDescription>
                    Edit details and properties for this media item
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
                {/* Essential information first */}
                <div className="space-y-2">
                    <Label
                        htmlFor="media-name"
                        className="text-base font-medium"
                    >
                        File Name
                    </Label>
                    <Input
                        id="media-name"
                        value={formData.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className={cn(errors.name && "border-destructive")}
                        disabled={disabled}
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Make collection selection more prominent */}
                <div className="space-y-2">
                    <Label
                        htmlFor="media-collection"
                        className="text-base font-medium"
                    >
                        Collection
                    </Label>
                    <Select
                        value={formData.collection_name}
                        onValueChange={(value) =>
                            setData("collection_name", value)
                        }
                        disabled={disabled}
                    >
                        <SelectTrigger id="media-collection">
                            <SelectValue placeholder="Select a collection" />
                        </SelectTrigger>
                        <SelectContent>
                            {collections.map((collection) => (
                                <SelectItem
                                    key={collection.name}
                                    value={collection.name}
                                >
                                    {collection.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Image-specific fields */}
                {isImageType(media.mime_type) && (
                    <div className="p-4 space-y-4 rounded-md bg-muted/30">
                        <h3 className="text-sm font-medium">
                            Image Properties
                        </h3>

                        <div className="space-y-2">
                            <Label
                                htmlFor="media-alt-text"
                                className="flex items-center"
                            >
                                Alt Text
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-3.5 w-3.5 ml-1.5 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="right"
                                            className="max-w-80"
                                        >
                                            <p>
                                                Alternative text describes an
                                                image and helps with
                                                accessibility and SEO. It should
                                                be descriptive of what appears
                                                in the image.
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <Textarea
                                id="media-alt-text"
                                value={formData.alt_text}
                                onChange={(e) =>
                                    setData("alt_text", e.target.value)
                                }
                                placeholder="Describe this image for screen readers and SEO"
                                className="resize-none"
                                rows={2}
                                disabled={disabled}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="media-title">Title Attribute</Label>
                            <Input
                                id="media-title"
                                value={formData.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                placeholder="Optional title shown on hover"
                                disabled={disabled}
                            />
                        </div>
                    </div>
                )}

                <Separator />

                {/* Advanced options */}
                <div className="flex justify-between items-center">
                    <div>
                        <Label htmlFor="media-public" className="block mb-1">
                            Public Access
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Allow access without authentication
                        </p>
                    </div>
                    <Switch
                        id="media-public"
                        checked={formData.custom_properties?.public === true}
                        onCheckedChange={(checked) =>
                            setData("custom_properties", {
                                ...formData.custom_properties,
                                public: checked,
                            })
                        }
                        disabled={disabled}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
