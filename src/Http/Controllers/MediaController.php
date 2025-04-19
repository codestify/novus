<?php

namespace Shah\Novus\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image;
use Shah\Novus\Http\Requests\MediaRequest;
use Shah\Novus\Models\Media;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        // Get and validate the query parameters
        $search = $request->input('search');
        $collection = $request->input('collection');
        $mimeType = $request->input('mime_type');
        $perPage = $request->input('per_page', 24);
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_dir', 'desc');

        // Start with a base query focusing on images
        $query = Media::query()->where('type', 0); // Type 0 is for images

        // Apply filters
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('alt_text', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%");
            });
        }

        if ($collection) {
            $query->where('collection_name', $collection);
        }

        if ($mimeType && $mimeType !== 'all') {
            $query->where('mime_type', 'like', 'image/%');
        }

        // Apply sorting
        $query->orderBy($sortBy, $sortDir);

        // Get the paginated results
        $media = $query->paginate($perPage)->withQueryString();

        // Transform the media items to include URLs
        $transformedMedia = $media->through(function ($item) {
            return $this->transformMediaItem($item);
        });

        // Get collection stats for images only
        $collections = DB::table('novus_media')
            ->where('type', 0) // Only images
            ->select('collection_name', DB::raw('count(*) as count'))
            ->groupBy('collection_name')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->collection_name,
                    'count' => $item->count,
                ];
            });

        // Return the Inertia response
        return Inertia::render('Media/Index', [
            'media' => $transformedMedia,
            'collections' => $collections,
            'filters' => [
                'search' => $search,
                'collection' => $collection,
                'mime_type' => $mimeType,
                'sort_by' => $sortBy,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function upload(Request $request)
    {
        try {
            $validator = validator($request->all(), [
                'file' => 'required|file|image|max:10240', // 10MB max file size, image files only
                'collection_name' => 'nullable|string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $file = $request->file('file');
            $collectionName = $request->input('collection_name', 'default');

            $fileName = $file->getClientOriginalName();
            $sanitizedName = $this->sanitizeFileName($fileName);
            $mimeType = $file->getMimeType();
            $fileSize = $file->getSize();
            $diskName = config('novus.storage_disk', 'public');
            $path = config('novus.storage_path', 'novus-media');

            // Validate that it's an image mime type
            if (! Str::startsWith($mimeType, 'image/')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only image files are allowed',
                ], 422);
            }

            // Generate a unique path with a folder structure based on date
            $folder = date('Y/m/d');
            $storagePath = "{$path}/{$folder}";
            $uniqueName = $this->generateUniqueFileName($sanitizedName, $storagePath, $diskName);
            $fullPath = "{$storagePath}/{$uniqueName}";

            // Store the file
            $file->storeAs($storagePath, $uniqueName, $diskName);

            // Process image and create thumbnails
            $dimensions = $this->processImageAndCreateThumbnails($fullPath, $diskName);

            // Create the media record
            $media = new Media;
            $media->name = pathinfo($sanitizedName, PATHINFO_FILENAME);
            $media->path = $fullPath;
            $media->mime_type = $mimeType;
            $media->type = 0; // Image type
            $media->disk = $diskName;
            $media->collection_name = $collectionName;
            $media->size = $fileSize;

            if ($dimensions) {
                $media->custom_properties = [
                    'width' => $dimensions['width'],
                    'height' => $dimensions['height'],
                ];
            }

            $media->save();

            // Return the transformed media item for immediate display
            return response()->json([
                'success' => true,
                'message' => 'File uploaded successfully',
                'media' => $this->transformMediaItem($media),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: '.$e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        $media = Media::findOrFail($id);

        return response()->json($this->transformMediaItem($media));
    }

    /**
     * Update the specified media in storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(MediaRequest $request, $id)
    {
        $media = Media::findOrFail($id);

        $media->name = $request->input('name');
        $media->alt_text = $request->input('alt_text');
        $media->title = $request->input('title');
        $media->collection_name = $request->input('collection_name');

        // Merge custom properties to keep any existing properties not in the request

        $customProperties = is_array($media->custom_properties)
            ? $media->custom_properties
            : ($media->custom_properties instanceof \Illuminate\Contracts\Support\Arrayable
                ? $media->custom_properties->toArray()
                : (array) $media->custom_properties);
        $newProperties = $request->input('custom_properties', []);
        $media->custom_properties = array_merge($customProperties, $newProperties);

        $media->save();

        return redirect()->back()->with('success', 'Media updated successfully.');
    }

    /**
     * Remove the specified media from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $media = Media::findOrFail($id);

        // Delete the file from storage
        Storage::disk($media->disk)->delete($media->path);

        // Also delete thumbnails
        $this->deleteThumbnails($media);

        // Delete the database record
        $media->delete();

        return redirect()->back()->with('success', 'Media deleted successfully.');
    }

    /**
     * Bulk delete multiple media items.
     *
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function bulkDestroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:novus_media,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $ids = $request->input('ids');
        $mediaItems = Media::whereIn('id', $ids)->get();

        foreach ($mediaItems as $media) {
            // Delete the file from storage
            Storage::disk($media->disk)->delete($media->path);

            // Delete thumbnails
            $this->deleteThumbnails($media);
        }

        // Delete the database records
        Media::whereIn('id', $ids)->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => count($ids).' media items deleted successfully.',
            ]);
        }

        return redirect()->back()->with('success', count($ids).' media items deleted successfully.');
    }

    /**
     * Transform a media item to include URLs and other computed properties.
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
     * @return string
     */
    protected function getMediaUrl(Media $media)
    {
        return Storage::disk($media->disk)->url($media->path);
    }

    /**
     * Get the thumbnail URL for a media item.
     *
     * @return string
     */
    protected function getThumbnailUrl(Media $media)
    {
        // For images, get the thumbnail URL
        $pathInfo = pathinfo($media->path);
        $extension = $pathInfo['extension'] ?? $this->getExtensionFromMimeType($media->mime_type);
        $thumbnailPath = "{$pathInfo['dirname']}/thumbnails/{$pathInfo['filename']}_medium.{$extension}";

        if (Storage::disk($media->disk)->exists($thumbnailPath)) {
            return Storage::disk($media->disk)->url($thumbnailPath);
        }

        // Fallback to the original image if thumbnail doesn't exist
        return $this->getMediaUrl($media);
    }

    /**
     * Process an image and create thumbnails.
     *
     * @param  string  $path
     * @param  string  $disk
     * @return array|null
     */
    protected function processImageAndCreateThumbnails($path, $disk)
    {
        try {
            // Get the full storage path for the image
            $fullPath = Storage::disk($disk)->path($path);

            // Check if the file exists
            if (! file_exists($fullPath)) {
                throw new \Exception("Image file does not exist at path: {$fullPath}");
            }

            $image = Image::make($fullPath);
            // Get original dimensions
            $originalWidth = $image->width();
            $originalHeight = $image->height();

            // Create thumbnails directory if it doesn't exist
            $pathInfo = pathinfo($path);
            $thumbnailsDir = "{$pathInfo['dirname']}/thumbnails";
            if (! Storage::disk($disk)->exists($thumbnailsDir)) {
                Storage::disk($disk)->makeDirectory($thumbnailsDir);
            }

            // Create thumbnails for each configured size
            $imageSizes = config('novus.image_sizes', [
                'thumbnail' => [
                    'width' => 150,
                    'height' => 150,
                ],
                'medium' => [
                    'width' => 300,
                    'height' => 300,
                ],
                'large' => [
                    'width' => 1024,
                    'height' => 1024,
                ],
            ]);

            foreach ($imageSizes as $sizeName => $dimensions) {
                $thumbnailPath = "{$thumbnailsDir}/{$pathInfo['filename']}_{$sizeName}.{$pathInfo['extension']}";
                $fullThumbnailPath = Storage::disk($disk)->path($thumbnailPath);

                // Create a copy of the image for the thumbnail
                // We need to reload the image for each thumbnail to avoid modifying the same instance
                $thumbnail = Image::make($fullPath);

                // Resize to fit within the dimensions while maintaining aspect ratio
                $thumbnail->resize($dimensions['width'], $dimensions['height'], function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });

                // Save the thumbnail
                $thumbnail->save($fullThumbnailPath);
            }

            return [
                'width' => $originalWidth,
                'height' => $originalHeight,
            ];
        } catch (\Exception $e) {
            // Log error and continue without thumbnails
            logger()->error("Failed to process image: {$e->getMessage()}");

            return null;
        }
    }

    /**
     * Delete all thumbnails for a media item.
     *
     * @return void
     */
    protected function deleteThumbnails(Media $media)
    {
        $pathInfo = pathinfo($media->path);
        $extension = $pathInfo['extension'] ?? $this->getExtensionFromMimeType($media->mime_type);
        $thumbnailsDir = "{$pathInfo['dirname']}/thumbnails";

        // Delete all thumbnails with the same filename prefix
        $imageSizes = config('novus.image_sizes', [
            'thumbnail' => [
                'width' => 150,
                'height' => 150,
            ],
            'medium' => [
                'width' => 300,
                'height' => 300,
            ],
            'large' => [
                'width' => 1024,
                'height' => 1024,
            ],
        ]);

        foreach ($imageSizes as $sizeName => $dimensions) {
            $thumbnailPath = "{$thumbnailsDir}/{$pathInfo['filename']}_{$sizeName}.{$extension}";
            Storage::disk($media->disk)->delete($thumbnailPath);
        }

        // Try to delete the thumbnails directory if it's empty
        try {
            if (Storage::disk($media->disk)->exists($thumbnailsDir)) {
                $files = Storage::disk($media->disk)->files($thumbnailsDir);
                if (empty($files)) {
                    Storage::disk($media->disk)->deleteDirectory($thumbnailsDir);
                }
            }
        } catch (\Exception $e) {
            // Ignore errors when trying to delete the directory
            logger()->error("Failed to delete thumbnails directory: {$e->getMessage()}");
        }
    }

    /**
     * Sanitize a filename to remove special characters.
     *
     * @param  string  $fileName
     * @return string
     */
    protected function sanitizeFileName($fileName)
    {
        // Remove characters that might cause issues
        $fileName = preg_replace('/[^a-zA-Z0-9_.-]/', '-', $fileName);

        // Replace multiple consecutive dashes with a single dash
        $fileName = preg_replace('/-+/', '-', $fileName);

        return $fileName;
    }

    /**
     * Generate a unique filename to avoid overwriting existing files.
     *
     * @param  string  $fileName
     * @param  string  $path
     * @param  string  $disk
     * @return string
     */
    protected function generateUniqueFileName($fileName, $path, $disk)
    {
        $pathInfo = pathinfo($fileName);
        $baseName = $pathInfo['filename'];
        $extension = $pathInfo['extension'] ?? '';

        $counter = 0;
        $newFileName = $fileName;

        while (Storage::disk($disk)->exists("{$path}/{$newFileName}")) {
            $counter++;
            $newFileName = "{$baseName}-{$counter}.{$extension}";
        }

        return $newFileName;
    }

    private function getExtensionFromMimeType(string $mimeType): string
    {
        return match ($mimeType) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'video/mp4' => 'mp4',
            'audio/mpeg' => 'mp3',
            default => 'jpg',
        };
    }
}
