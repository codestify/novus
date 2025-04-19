import React from "react";
import { Alert, AlertDescription } from "@novus/Components/ui/alert";
import { Info } from "lucide-react";
import { TabProps } from "@novus/types/post";
import FieldWithCount from "@novus/Components/FieldWithCount";

const BasicSeoTab: React.FC<TabProps> = ({ data, setData, errors }) => {
    return (
        <>
            <FieldWithCount
                label="Meta Title"
                fieldName="seo_title"
                placeholder="Enter SEO title"
                maxLength={60}
                description="Defaults to post title if left blank. Recommended length: 50-60 characters for optimal display in search results."
                data={data}
                setData={setData}
                errors={errors}
            />

            <FieldWithCount
                label="Meta Description"
                fieldName="seo_description"
                placeholder="Enter SEO description..."
                maxLength={160}
                description="Brief description for search engines. Recommended length: 150-160 characters for optimal display in search results."
                isTextarea={true}
                data={data}
                setData={setData}
                errors={errors}
            />

            <FieldWithCount
                label="Meta Keywords"
                fieldName="seo_keywords"
                placeholder="keyword1, keyword2, keyword3"
                description="Comma-separated keywords (less important for modern SEO but still used by some search engines)"
                data={data}
                setData={setData}
                errors={errors}
            />

            <Alert className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mt-4 py-3 px-4">
                <div className="flex gap-2 items-start">
                    <Info className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" />
                    <div>
                        <h4 className="font-medium text-sm mb-1">
                            SEO Best Practices
                        </h4>
                        <AlertDescription className="text-xs leading-relaxed text-muted-foreground">
                            Well-crafted meta titles and descriptions
                            significantly improve click-through rates from
                            search results. Include primary keywords naturally
                            and create compelling descriptions that entice users
                            to click.
                        </AlertDescription>
                    </div>
                </div>
            </Alert>
        </>
    );
};

export default BasicSeoTab;
