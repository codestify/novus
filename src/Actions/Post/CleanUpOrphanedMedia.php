<?php

namespace Shah\Novus\Actions\Post;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Shah\Novus\Models\Post;

class CleanupOrphanedMedia
{
    public function handle(Post $post, \Closure $next)
    {
        // Get the media items loaded before we started the pipeline
        $mediaItems = $post->getRelation('media');

        foreach ($mediaItems as $media) {
            // Check if media is used by other models
            $usageCount = DB::table('novus_mediables')
                ->where('media_id', $media->id)
                ->count();

            if ($usageCount === 0) {
                // Delete thumbnails first
                $pathInfo = pathinfo($media->path);
                $thumbnailsDir = "{$pathInfo['dirname']}/thumbnails";

                if (Storage::disk($media->disk)->exists($thumbnailsDir)) {
                    // Delete thumbnail variants
                    $imageSizes = config('novus.image_sizes', [
                        'thumbnail', 'medium', 'large',
                    ]);

                    foreach ($imageSizes as $sizeName => $dimensions) {
                        $size = is_array($dimensions) ? $sizeName : $dimensions;
                        $thumbnailPath = "{$thumbnailsDir}/{$pathInfo['filename']}_{$size}.{$pathInfo['extension']}";
                        Storage::disk($media->disk)->delete($thumbnailPath);
                    }

                    // Try to remove directory if empty
                    try {
                        $files = Storage::disk($media->disk)->files($thumbnailsDir);
                        if (empty($files)) {
                            Storage::disk($media->disk)->deleteDirectory($thumbnailsDir);
                        }
                    } catch (\Exception $e) {
                        Log::warning("Failed to delete thumbnails directory: {$e->getMessage()}");
                    }
                }

                // Delete the original file
                Storage::disk($media->disk)->delete($media->path);

                // Delete the media record
                $media->delete();
            }
        }

        return $next($post);
    }
}
