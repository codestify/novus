<?php

namespace Shah\Novus;

use Illuminate\Support\Facades\File;

class AssetManager
{
    /**
     * Get asset URL with proper versioning
     */
    public function asset(string $path): string
    {
        $manifestPath = public_path('vendor/novus/manifest.json');

        if (file_exists($manifestPath)) {
            $manifest = json_decode(file_get_contents($manifestPath), true);

            if (isset($manifest[$path])) {
                return asset('vendor/novus/' . $manifest[$path]);
            }
        }

        return asset('vendor/novus/' . $path);
    }

    /**
     * Render script tags for JS assets
     */
    public function scripts(): string
    {
        $manifestPath = public_path('vendor/novus/manifest.json');

        if (file_exists($manifestPath)) {
            $manifest = json_decode(file_get_contents($manifestPath), true);

            if ($manifest && isset($manifest['resources/js/app.js'])) {
                $file = $manifest['resources/js/app.js']['file'];
                return '<script type="module" src="' . asset('vendor/novus/' . $file) . '"></script>';
            }
        }

        $jsFiles = glob(public_path('vendor/novus/*.js'));
        if (count($jsFiles) > 0) {
            $jsFile = basename($jsFiles[0]);
            return '<script type="module" src="' . asset('vendor/novus/' . $jsFile) . '"></script>';
        }

        return '<!-- No JS assets found -->';
    }

    /**
     * Render link tags for CSS assets
     */
    public function styles(): string
    {
        $manifestPath = public_path('vendor/novus/manifest.json');

        if (file_exists($manifestPath)) {
            $manifest = json_decode(file_get_contents($manifestPath), true);

            if ($manifest && isset($manifest['resources/js/app.js'])) {
                $cssFiles = $manifest['resources/js/app.js']['css'] ?? [];
                $tags = [];

                foreach ($cssFiles as $file) {
                    $tags[] = '<link rel="stylesheet" href="' . asset('vendor/novus/' . $file) . '">';
                }

                return implode("\n", $tags);
            }
        }

        $cssFiles = glob(public_path('vendor/novus/*.css'));
        if (count($cssFiles) > 0) {
            $cssFile = basename($cssFiles[0]);
            return '<link rel="stylesheet" href="' . asset('vendor/novus/' . $cssFile) . '">';
        }

        return '<!-- No CSS assets found -->';
    }
}
