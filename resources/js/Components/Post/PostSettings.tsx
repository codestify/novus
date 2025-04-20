import React from "react";
import { Cog } from "lucide-react";
import { Card } from "@novus/Components/ui/card";
import { Switch } from "@novus/Components/ui/switch";
import { Label } from "@novus/Components/ui/label";
import { Separator } from "@novus/Components/ui/separator";
import { PostSettingsProps } from "@novus/types/post";
import PostDatePicker from "./PostDatePicker";
import FeaturedImage from "./FeaturedImage";
import CategoryInput from "./CategoryInput";
import TagInput from "./TagInput";

const PostSettings = ({
    data,
    setData,
    errors,
    postStatus,
}: PostSettingsProps) => {
    return (
        <div className="space-y-6">
            <Card className="p-5 rounded-md border shadow-xs border-muted bg-card">
                <div className="flex items-center mb-4">
                    <Cog className="mr-2 w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Post Settings</h2>
                </div>
                <div className="space-y-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <Label
                                htmlFor="is_featured"
                                className="text-sm font-medium"
                            >
                                Featured Post
                            </Label>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Display this post in featured sections
                            </p>
                        </div>
                        <Switch
                            id="is_featured"
                            checked={data.is_featured}
                            onCheckedChange={(value) =>
                                setData("is_featured", value)
                            }
                        />
                    </div>
                    <Separator />
                    <PostDatePicker
                        date={data.published_at}
                        onChange={(date) => setData("published_at", date)}
                        error={errors.published_at}
                        postStatus={postStatus} // Pass status
                    />
                </div>
            </Card>
            <FeaturedImage
                //@ts-ignore
                featuredImage={data.featured_image}
                onChange={(file) => setData("featured_image", file)}
                error={errors.featured_image}
            />
            <CategoryInput
                categories={data.categories}
                onCategoriesChange={(categories) =>
                    setData("categories", categories)
                }
                error={errors.categories}
            />
            <TagInput
                tags={data.tags}
                onTagsChange={(tags) => setData("tags", tags)}
                error={errors.tags}
            />
        </div>
    );
};

export default PostSettings;
