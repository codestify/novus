import { PostFormData, PostType } from "@novus/types/post";
import { extractFeaturedImage } from "./mediaUtils";

/**
 * Generates initial data for post form based on whether creating a new post or editing existing one
 * @param post Optional post data for editing mode
 * @returns PostFormData with appropriate initial values
 */
export function getInitialPostFormData(post?: PostType | null): PostFormData {
    // Default values for new post creation
    if (!post) {
        return {
            id: null,
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            featured_image: null,
            seo_title: "",
            seo_description: "",
            seo_keywords: "",
            is_featured: false,
            categories: [],
            tags: [],
            status: "draft",
            published_at: new Date().toISOString().split("T")[0],
            og_title: "",
            og_description: "",
            og_image: "",
            og_type: "article",
            twitter_title: "",
            twitter_description: "",
            twitter_image: "",
            twitter_card: "summary_large_image",
            robots_noindex: false,
            robots_nofollow: false,
        };
    }

    // Initialize with existing post data for editing mode
    const featuredImage = extractFeaturedImage(post);

    return {
        id: post.id,
        title: post.title || "",
        slug: post.slug || "",
        content: post.content || "",
        excerpt: post.excerpt || "",
        featured_image: featuredImage,
        seo_title: post.seo_meta?.meta_title || "",
        seo_description: post.seo_meta?.meta_description || "",
        seo_keywords: post.seo_meta?.meta_keywords || "",
        is_featured: post.featured ?? false,
        categories: post.categories || [],
        tags: post.tags || [],
        status: post.status || "draft",
        published_at:
            post.published_at || new Date().toISOString().split("T")[0],
        og_title: post.seo_meta?.og_title || "",
        og_description: post.seo_meta?.og_description || "",
        og_image: post.seo_meta?.og_image || "",
        og_type: post.seo_meta?.og_type || "article",
        twitter_title: post.seo_meta?.twitter_title || "",
        twitter_description: post.seo_meta?.twitter_description || "",
        twitter_image: post.seo_meta?.twitter_image || "",
        twitter_card: post.seo_meta?.twitter_card || "summary_large_image",
        robots_noindex: post.seo_meta?.robots_noindex || false,
        robots_nofollow: post.seo_meta?.robots_nofollow || false,
    };
}
