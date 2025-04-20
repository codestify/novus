<?php

namespace Shah\Novus\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Shah\Novus\Models\Media;

class MediaGalleryController extends Controller
{
    public function __invoke(Request $request)
    {
        $query = Media::query();

        // Filter media by type (we want images only)
        $query->where('type', 0); // 0 = image

        // Apply search filter if provided
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('alt_text', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%");
            });
        }

        if ($request->has('collection') && $request->input('collection') !== 'all') {
            $query->where('collection_name', $request->input('collection'));
        }

        if ($request->input('filter') === 'recent') {
            $query->orderBy('created_at', 'desc')->limit(20);
        } else {
            // Default sorting
            $query->orderBy('created_at', 'desc');
        }

        // Paginate the results
        $perPage = $request->input('per_page', 24);
        $media = $query->paginate($perPage);

        // Transform the media items to include URLs
        $transformedMedia = $media->through(function ($item) {
            return $this->transformMediaItem($item);
        });

        return response()->json($transformedMedia);
    }

    /**
     * Transform a media item to include URLs and other computed properties.
     *
     *
     * @return array
     */
    protected function transformMediaItem(Media $media)
    {
        $item = $media->toArray();

        // Add URLs
        $item['url'] = $this->getMediaUrl($media);
        $item['thumbnail_url'] = $this->getThumbnailUrl($media);

        // Add dimensions from custom properties if available
        if (isset($media->custom_properties['width']) && isset($media->custom_properties['height'])) {
            $item['width'] = $media->custom_properties['width'];
            $item['height'] = $media->custom_properties['height'];
        }

        return $item;
    }

    /**
     * Get the public URL for a media item.
     *
     *
     * @return string
     */
    protected function getMediaUrl(Media $media)
    {
        return Storage::disk($media->disk)->url($media->path);
    }

    /**
     * Get the thumbnail URL for a media item.
     *
     *
     * @return string
     */
    protected function getThumbnailUrl(Media $media)
    {
        // For images, get the thumbnail URL
        $pathInfo = pathinfo($media->path);
        $thumbnailPath = "{$pathInfo['dirname']}/thumbnails/{$pathInfo['filename']}_medium.{$pathInfo['extension']}";

        if (Storage::disk($media->disk)->exists($thumbnailPath)) {
            return Storage::disk($media->disk)->url($thumbnailPath);
        }

        // Fallback to the original image if thumbnail doesn't exist
        return $this->getMediaUrl($media);
    }
}
