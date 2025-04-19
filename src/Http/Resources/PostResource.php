<?php

namespace Shah\Novus\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PostResource extends JsonResource
{
    public function toArray(Request $request)
    {
        // Get featured image if it exists
        $featuredImage = null;
        if ($this->whenLoaded('media')) {
            $featuredImage = $this->resource->media->first(function ($media) {
                return $media->pivot->collection_name === 'featured_image';
            });
        }

        CategoryResource::withoutWrapping();
        TagResource::withoutWrapping();

        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'slug' => $this->resource->slug,
            'excerpt' => $this->resource->excerpt,
            'content' => $this->resource->content,
            'content_html' => $this->resource->content_html,
            'published_at' => $this->resource->published_at ? $this->resource->published_at->format('Y-m-d H:i:s') : null,
            'featured' => $this->resource->is_featured,
            'status' => $this->resource->status->label(),
            $this->mergeWhen($this->whenLoaded('author'), [
                'author' => new AuthorResource($this->whenLoaded('author')),
            ]),
            $this->mergeWhen($this->whenLoaded('seoMeta'), [
                'seo_meta' => SeoMetaResource::make($this->resource->seoMeta),
            ]),
            $this->mergeWhen($this->whenLoaded('categories'), [
                'categories' => $this->extractNamesFromRelatedResource($this->categories),
            ]),
            $this->mergeWhen($this->whenLoaded('tags'), [
                'tags' => $this->extractNamesFromRelatedResource($this->tags),
            ]),
            $this->mergeWhen($featuredImage, [
                'featured_image' => [
                    'id' => $featuredImage?->id,
                    'url' => $featuredImage ? $this->getMediaUrl($featuredImage) : null,
                    'thumbnail_url' => $featuredImage ? $this->getThumbnailUrl($featuredImage) : null,
                    'name' => $featuredImage?->name,
                    'mime_type' => $featuredImage?->mime_type,
                ],
            ]),
            'author_id' => $this->resource->author_id,
            'post_type' => $this->resource->post_type,
            'template' => $this->resource->template,
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,
            'deleted_at' => $this->resource->deleted_at,
        ];
    }

    /**
     * Get the URL for a media item
     */
    protected function getMediaUrl($media)
    {
        // Use a simpler approach to generate URLs
        // This assumes that the files are stored in the public disk or symlinked to public
        return asset('storage/'.$media->path);
    }

    /**
     * Get the thumbnail URL for a media item
     */
    protected function getThumbnailUrl($media)
    {
        $disk = $media->disk ?? 'public';
        $thumbnailPath = str_replace(
            basename($media->path),
            'thumbnails/'.pathinfo($media->path, PATHINFO_FILENAME).'_medium.'.pathinfo($media->path, PATHINFO_EXTENSION),
            $media->path
        );

        // Check if thumbnail exists
        if (Storage::disk($disk)->exists($thumbnailPath)) {
            return asset('storage/'.$thumbnailPath);
        }

        // Fallback to original
        return $this->getMediaUrl($media);
    }

    private function extractNamesFromRelatedResource(mixed $entries)
    {
        if ($entries->isEmpty()) {
            return [];
        }

        return $entries->map(function ($entry) {
            return $entry->name;
        });
    }
}
