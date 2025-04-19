import React from "react";
import { Globe, X as Twitter } from "lucide-react";
import { PreviewProps } from "@novus/types/post";

const TwitterPreview: React.FC<PreviewProps> = ({ data }) => {
    return (
        <div className="rounded-md border overflow-hidden shadow-sm max-w-md mx-auto mt-3 transition-transform duration-200 hover:scale-[1.01] hover:shadow-md">
            <div className="bg-[#f5f5f5] dark:bg-[#15202b] px-3 py-2 border-b border-[#e1e8ed] dark:border-[#38444d] flex items-center gap-1.5">
                <Twitter className="h-3.5 w-3.5 text-[#1da1f2]" />
                <h3 className="font-medium text-xs">Twitter Card Preview</h3>
            </div>
            <div className="bg-white dark:bg-[#15202b]">
                <div className="w-full">
                    {data.twitter_image || data.og_image ? (
                        <div
                            className="w-full h-48 bg-cover bg-center bg-no-repeat rounded-t transition-all duration-300"
                            style={{
                                backgroundImage: `url(${data.twitter_image || data.og_image})`,
                                backgroundSize: "cover",
                            }}
                        />
                    ) : (
                        <div className="w-full h-48 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 p-4">
                            <Twitter className="h-8 w-8 opacity-40 mb-2" />
                            <p className="text-xs text-center">
                                No image specified. <br />
                                Add a Twitter image for better sharing.
                            </p>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-[#e1e8ed] dark:border-[#38444d]">
                    <p className="font-bold text-[#0f1419] dark:text-white text-base line-clamp-1 mb-2">
                        {data.twitter_title ||
                            data.og_title ||
                            data.seo_title ||
                            data.title ||
                            "Your Post Title"}
                    </p>
                    <p className="text-sm text-[#536471] dark:text-[#8899a6] line-clamp-3 leading-snug mb-3">
                        {data.twitter_description ||
                            data.og_description ||
                            data.seo_description ||
                            data.excerpt ||
                            "Your post description will appear here when shared on Twitter. Make it compelling to increase engagement."}
                    </p>
                    <div className="flex items-center text-[#536471] dark:text-[#8899a6] text-xs">
                        <Globe className="h-3 w-3 mr-1.5" />
                        <span>{window.location.host}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwitterPreview;
