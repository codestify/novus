import React from "react";
import { Share2 } from "lucide-react";
import { PreviewProps } from "@novus/types/post";

const FacebookPreview: React.FC<PreviewProps> = ({ data }) => {
    return (
        <div className="rounded-md border overflow-hidden shadow-sm max-w-md mx-auto mt-3 transition-transform duration-200 hover:scale-[1.01] hover:shadow-md">
            <div className="bg-[#f5f5f5] dark:bg-[#242526] px-3 py-2 border-b border-[#dddfe2] dark:border-[#3e4042] flex items-center gap-1.5">
                <Share2 className="h-3.5 w-3.5 text-[#3b5998] dark:text-[#4267B2]" />
                <h3 className="font-medium text-xs">Facebook Share Preview</h3>
            </div>
            <div className="bg-white dark:bg-[#242526]">
                <div className="w-full bg-[#f2f3f5] dark:bg-[#18191a]">
                    {data.og_image || data.twitter_image ? (
                        <div
                            className="w-full h-48 bg-cover bg-center bg-no-repeat transition-all duration-300"
                            style={{
                                backgroundImage: `url(${data.og_image || data.twitter_image})`,
                                backgroundSize: "cover",
                            }}
                        />
                    ) : (
                        <div className="w-full h-48 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 p-4">
                            <Share2 className="h-8 w-8 opacity-40 mb-2" />
                            <p className="text-xs text-center">
                                No image specified. <br />
                                Add an Open Graph image for better sharing.
                            </p>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-[#dddfe2] dark:border-[#3e4042]">
                    <p className="text-[#385898] dark:text-[#4267B2] text-xs font-medium mb-1">
                        {window.location.host}
                    </p>
                    <p className="font-bold text-[#1c1e21] dark:text-[#e4e6eb] text-base line-clamp-1 mb-2">
                        {data.og_title ||
                            data.seo_title ||
                            data.title ||
                            "Your Post Title"}
                    </p>
                    <p className="text-sm text-[#606770] dark:text-[#b0b3b8] line-clamp-3 leading-snug">
                        {data.og_description ||
                            data.seo_description ||
                            data.excerpt ||
                            "Your post description will appear here when shared on Facebook. A compelling description helps increase engagement."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FacebookPreview;
