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
 * Process a featured image for API submission.
 * Converts from MediaSelection or numeric ID to the number expected by the API.
 * File uploads are now handled by FeaturedImage component directly via the
 * media upload endpoint, so Files should never reach this function.
 */
export function processFeaturedImageForSubmission(
    featuredImage: MediaSelection | string | number | null,
): number | null {
    if (featuredImage === null) {
        return null;
    }

    if (typeof featuredImage === "object" && "id" in featuredImage) {
        return Number(featuredImage.id);
    }

    if (typeof featuredImage === "string" && !isNaN(Number(featuredImage))) {
        return Number(featuredImage);
    }

    if (typeof featuredImage === "number") {
        return featuredImage;
    }

    return null;
}
