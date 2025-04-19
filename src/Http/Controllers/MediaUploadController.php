<?php

namespace Shah\Novus\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;
use Shah\Novus\Models\Media;

class MediaUploadController extends Controller
{
    public function __invoke(Request $request)
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
            // Log the error for debugging
            logger()->error('Upload failed: '.$e->getMessage());
            logger()->error($e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Upload failed: '.$e->getMessage(),
            ], 500);
        }
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
        $thumbnailPath = "{$pathInfo['dirname']}/thumbnails/{$pathInfo['filename']}_medium.{$pathInfo['extension']}";

        if (Storage::disk($media->disk)->exists($thumbnailPath)) {
            return Storage::disk($media->disk)->url($thumbnailPath);
        }

        // Fallback to the original image if thumbnail doesn't exist
        return $this->getMediaUrl($media);
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

            // Create an Intervention Image instance
            $image = Image::read($fullPath);

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
                $thumbnail = Image::read($fullPath);

                // Resize to fit within the dimensions while maintaining aspect ratio
                $thumbnail->resize($dimensions['width'], $dimensions['height']);

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
}
