<?php

namespace Shah\Novus\Services;

use Carbon\Carbon;
use DOMDocument;
use DOMXPath;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Shah\Novus\Enums\PostStatus;
use Shah\Novus\Models\Category;
use Shah\Novus\Models\Post;
use Shah\Novus\Models\Tag;

class PostService
{
    /**
     * Create a new post with the provided data.
     */
    public function createPost(array $data): Post
    {
        $providedStatus = $this->resolvePostStatus($data['status'] ?? null);
        $providedDate = $data['published_at'] ?? null;

        $final = $this->determineFinalStatusAndDate($providedStatus, $providedDate);

        $post = Post::create([
            'title' => $data['title'],
            'slug' => $data['slug'],
            'excerpt' => $data['excerpt'] ?? null,
            'content' => $this->sanitizeContent($data['content']),
            'content_html' => $data['content'],
            'status' => $final['status'],
            'is_featured' => $data['is_featured'] ?? false,
            'published_at' => $final['published_at'],
            'author_id' => Auth::guard('novus')->id(),
        ]);

        $this->handlePostRelationships($post, $data);

        return $post->fresh(['categories', 'tags', 'author', 'seoMeta', 'media']);
    }

    /**
     * Update an existing post with the provided data.
     */
    public function updatePost(Post $post, array $data): Post
    {
        $providedStatus = $this->resolvePostStatus($data['status'] ?? $post->status->value);
        $providedDate = $data['published_at'] ?? $post->published_at;

        $final = $this->determineFinalStatusAndDate($providedStatus, $providedDate);

        $post->update([
            'title' => $data['title'],
            'slug' => $data['slug'],
            'excerpt' => $data['excerpt'] ?? null,
            'content' => $data['content'],
            'content_html' => $this->sanitizeContent($data['content']),
            'status' => $final['status'],
            'is_featured' => $data['is_featured'] ?? $post->is_featured,
            'published_at' => $final['published_at'],
        ]);

        $this->handlePostRelationships($post, $data);

        return $post->fresh(['categories', 'tags', 'author', 'seoMeta', 'media']);
    }

    /**
     * Resolve the post status from various input formats.
     */
    private function resolvePostStatus($status, $default = null): int
    {
        if (is_null($status)) {
            return $default ?? PostStatus::Draft->value;
        }

        if (is_numeric($status)) {
            return (int) $status;
        }

        return PostStatus::fromName($status)?->value ?? ($default ?? PostStatus::Draft->value);
    }

    private function determineFinalStatusAndDate($providedStatus, $providedDate): array
    {
        $now = now();
        $date = $providedDate ? Carbon::parse($providedDate) : null;

        if ($date === null) {
            return [
                'status' => PostStatus::Draft->value,
                'published_at' => null,
            ];
        }

        if ($date->isFuture()) {
            return [
                'status' => PostStatus::Scheduled->value,
                'published_at' => $date->toDateTimeLocalString(),
            ];
        }

        if ($date->isToday()) {
            return [
                'status' => PostStatus::Draft->value,
                'published_at' => $now->toDateTimeLocalString(),
            ];
        }

        if ($date->isPast()) {
            if ($providedStatus === PostStatus::Draft->value) {
                return [
                    'status' => PostStatus::Draft->value,
                    'published_at' => $date->toDateTimeLocalString(),
                ];
            } elseif ($providedStatus === PostStatus::Scheduled->value) {
                return [
                    'status' => PostStatus::Published->value,
                    'published_at' => $now->toDateTimeLocalString(),
                ];
            }

            return [
                'status' => PostStatus::Published->value,
                'published_at' => $now->toDateTimeLocalString(),
            ];

        }

        return [
            'status' => PostStatus::Draft->value,
            'published_at' => null,
        ];
    }

    /**
     * Handle post relationships and media.
     */
    private function handlePostRelationships(Post $post, array $data): void
    {
        $this->handleFeaturedImage($post, $data);

        if (isset($data['categories'])) {
            $this->syncCategories($post, $data['categories']);
        }

        if (isset($data['tags'])) {
            $this->syncTags($post, $data['tags']);
        }

        $this->updateSeoMetadata($post, $data);
    }

    /**
     * Handle featured image attachment or upload.
     */
    private function handleFeaturedImage(Post $post, array $data): void
    {
        if (array_key_exists('featured_image', $data) && $data['featured_image'] === null) {
            $post->media()->wherePivot('collection_name', 'featured_image')->detach();

            return;
        }

        $featuredImage = $data['featured_image'] ?? null;
        if (empty($featuredImage)) {
            return;
        }

        if (is_numeric($featuredImage)) {
            $this->attachExistingMedia($post, (int) $featuredImage);

            return;
        }

        if ($featuredImage instanceof UploadedFile) {
            $this->uploadAndAttachMedia($post, $featuredImage);
        }
    }

    /**
     * Attach an existing media item as featured image.
     */
    private function attachExistingMedia(Post $post, int $mediaId): void
    {
        $post->media()->wherePivot('collection_name', 'featured_image')
            ->wherePivot('media_id', '!=', $mediaId)
            ->detach();

        $post->media()->syncWithPivotValues([$mediaId], [
            'collection_name' => 'featured_image',
        ]);
    }

    /**
     * Upload and attach a new media item.
     */
    private function uploadAndAttachMedia(Post $post, UploadedFile $file): void
    {
        $disk = config('novus.storage_disk', 'public');
        $path = config('novus.storage_path', 'novus-media');

        $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
        $imagePath = $file->storeAs("$path/posts/{$post->id}", $filename, $disk);

        $media = $post->media()->create([
            'name' => $file->getClientOriginalName(),
            'path' => $imagePath,
            'mime_type' => $file->getMimeType(),
            'type' => 0, // Image type
            'disk' => $disk,
            'collection_name' => 'featured_image',
            'size' => $file->getSize(),
            'alt_text' => $post->title,
            'title' => $post->title,
        ]);

        $post->media()->wherePivot('collection_name', 'featured_image')
            ->wherePivot('media_id', '!=', $media->id)
            ->detach();
    }

    /**
     * Sync categories with the post.
     */
    private function syncCategories(Post $post, array $categories): void
    {
        $categoryIds = collect($categories)->map(function ($category) {
            if (is_numeric($category)) {
                return (int) $category;
            }

            return Category::firstOrCreate(
                ['slug' => Str::slug($category)],
                ['name' => $category]
            )->id;
        })->toArray();

        $post->categories()->sync($categoryIds);
    }

    /**
     * Sync tags with the post.
     */
    private function syncTags(Post $post, array $tags): void
    {
        $tagIds = collect($tags)->map(function ($tag) {
            if (is_numeric($tag)) {
                return (int) $tag;
            }

            return Tag::firstOrCreate(
                ['slug' => Str::slug($tag)],
                ['name' => $tag]
            )->id;
        })->toArray();

        $post->tags()->sync($tagIds);
    }

    /**
     * Update SEO metadata for the post.
     */
    private function updateSeoMetadata(Post $post, array $data): void
    {
        $seoData = [
            'meta_title' => $data['seo_title'] ?? $data['title'],
            'meta_description' => $data['seo_description'] ?? $data['excerpt'] ?? null,
            'meta_keywords' => $data['seo_keywords'] ?? null,
            'og_title' => $data['og_title'] ?? null,
            'og_description' => $data['og_description'] ?? null,
            'og_type' => $data['og_type'] ?? null,
            'og_image' => $data['og_image'] ?? null,
            'twitter_card' => $data['twitter_card'] ?? null,
            'twitter_title' => $data['twitter_title'] ?? null,
            'twitter_description' => $data['twitter_description'] ?? null,
            'twitter_image' => $data['twitter_image'] ?? $data['og_image'] ?? null,
            'robots_noindex' => $data['robots_noindex'] ?? false,
            'robots_nofollow' => $data['robots_nofollow'] ?? false,
        ];

        $post->seoMeta()->updateOrCreate(
            ['metable_id' => $post->id, 'metable_type' => Post::class],
            $seoData
        );
    }

    /**
     * Clean HTML content by removing empty paragraphs.
     */
    private function sanitizeContent(string $html): string
    {
        libxml_use_internal_errors(true);

        $dom = new DOMDocument;
        $dom->loadHTML('<?xml encoding="utf-8" ?>'.$html);

        $xpath = new DOMXPath($dom);
        foreach ($xpath->query('//p[not(normalize-space())]') as $emptyP) {
            $emptyP->parentNode->removeChild($emptyP);
        }

        $body = $dom->getElementsByTagName('body')->item(0);
        $content = '';
        foreach ($body->childNodes as $node) {
            $content .= $dom->saveHTML($node);
        }

        return $content;
    }
}
