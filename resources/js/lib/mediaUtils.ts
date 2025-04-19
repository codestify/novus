import { MediaSelection } from "@novus/types/post";

/**
 * Extract a featured image from a post API response
 * Handles both direct featured_image property and media collection
 */
export function extractFeaturedImage(post: any): MediaSelection | null {
    if (!post) return null;

    // First check if the API directly provides featured_image
    if (post.featured_image) {
        return {
            id: post.featured_image.id,
            url: post.featured_image.url || post.featured_image.thumbnail_url,
            fromLibrary: true,
        } as MediaSelection;
    }

    // Otherwise look through the media collection (older API version)
    if (post.media && Array.isArray(post.media) && post.media.length > 0) {
        // Find the featured image in the media collection
        const featuredImage = post.media.find((media: any) => {
            return (
                media.collection_name === "featured_image" ||
                (media.pivot &&
                    media.pivot.collection_name === "featured_image")
            );
        });

        if (featuredImage) {
            return {
                id: featuredImage.id,
                url: featuredImage.url || featuredImage.thumbnail_url,
                fromLibrary: true,
            } as MediaSelection;
        }
    }

    return null;
}

/**
 * Process a featured image for API submission
 * Converts from various types (MediaSelection, File, string, null) to the format expected by the API
 */
export function processFeaturedImageForSubmission(
    featuredImage: MediaSelection | File | string | number | null,
): number | null {
    if (featuredImage === null) {
        return null;
    }

    // Handle different types of featuredImage
    if (typeof featuredImage === "object") {
        if (featuredImage instanceof File) {
            // File objects are handled by FormData, return as is
            return featuredImage as any;
        } else if ("id" in featuredImage) {
            // Convert MediaSelection to just the ID number
            return Number(featuredImage.id);
        }
    } else if (typeof featuredImage === "string") {
        // Convert string IDs to numbers if they're numeric
        if (!isNaN(Number(featuredImage))) {
            return Number(featuredImage);
        }
    } else if (typeof featuredImage === "number") {
        // If it's already a number, return it directly
        return featuredImage;
    }

    // If we couldn't process it, return null
    return null;
}
