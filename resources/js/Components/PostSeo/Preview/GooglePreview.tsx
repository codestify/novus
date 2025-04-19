import React from "react";
import { ExternalLink, Search } from "lucide-react";
import { PreviewProps } from "@novus/types/post";

const GooglePreview: React.FC<PreviewProps> = ({ data }) => {
    return (
        <div className="rounded-md border overflow-hidden shadow-sm max-w-lg mx-auto mt-3 transition-transform duration-200 hover:scale-[1.01] hover:shadow-md">
            <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 border-b flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5 text-blue-600" />
                <h3 className="text-xs font-medium">
                    Google Search Result Preview
                </h3>
            </div>
            <div className="p-4 space-y-2 bg-white dark:bg-gray-900">
                <p className="text-[#1a0dab] dark:text-[#8ab4f8] text-lg font-medium line-clamp-1 break-all hover:underline cursor-pointer">
                    {data.seo_title || data.title || "Your Post Title"}
                </p>
                <p className="text-[#006621] dark:text-[#18a157] text-xs break-all flex items-center">
                    {window.location.origin}/{data.slug || "post-url"}
                    <ExternalLink className="inline ml-1 w-3 h-3 opacity-70" />
                </p>
                <p className="text-sm leading-snug text-gray-700 dark:text-gray-300 line-clamp-2">
                    {data.seo_description ||
                        data.excerpt ||
                        "Your post description will appear here. Make sure to write a compelling meta description to improve click-through rates from search results."}
                </p>
            </div>
        </div>
    );
};

export default GooglePreview;
