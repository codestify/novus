<?php

namespace Shah\Novus;

class AssetManager
{
    /**
     * Render all required asset tags
     */
    public function renderAssetTags(): string
    {
        return $this->getPreloadImportMap()."\n".$this->scripts()."\n".$this->styles();
    }

    /**
     * Render preload/import map for dynamically loaded modules
     */
    protected function getPreloadImportMap(): string
    {
        $manifestInfo = $this->getManifestInfo();
        $manifestPath = $manifestInfo['path'];
        $isVite = $manifestInfo['isVite'];

        if (! $manifestPath || ! file_exists($manifestPath)) {
            return '';
        }

        $manifest = json_decode(file_get_contents($manifestPath), true);
        if (! $manifest) {
            return '';
        }

        $importMapEntries = [];

        // Process all entries in the manifest
        foreach ($manifest as $key => $entry) {
            if (is_array($entry) && isset($entry['file'])) {
                $path = $this->fixAssetPath($entry['file'], $isVite);
                $importMapEntries['/build/assets/'.basename($entry['file'])] = $path;
            }
        }

        if (empty($importMapEntries)) {
            return '';
        }

        // Create import map script
        return "<script type=\"importmap\">\n".
               json_encode(['imports' => $importMapEntries], JSON_PRETTY_PRINT).
               "\n</script>\n";
    }

    /**
     * Determine if we're using a Vite manifest and adjust paths accordingly
     */
    protected function getManifestInfo(): array
    {
        $paths = [
            // Standard manifest location
            public_path('vendor/novus/manifest.json') => false,
            // Vite manifest location
            public_path('vendor/novus/.vite/manifest.json') => true,
        ];

        foreach ($paths as $path => $isVite) {
            if (file_exists($path)) {
                return [
                    'path' => $path,
                    'isVite' => $isVite,
                ];
            }
        }

        return ['path' => null, 'isVite' => false];
    }

    /**
     * Fix asset path based on manifest type
     */
    protected function fixAssetPath(string $file, bool $isVite): string
    {
        if ($isVite) {
            // Actual asset path is in /vendor/novus/assets, not /vendor/novus/.vite/assets/assets
            return asset('vendor/novus/assets/'.basename($file));
        }

        return asset('vendor/novus/'.$file);
    }

    /**
     * Render script tags for JS assets
     */
    public function scripts(): string
    {
        $manifestInfo = $this->getManifestInfo();
        $manifestPath = $manifestInfo['path'];
        $isVite = $manifestInfo['isVite'];

        if ($manifestPath && file_exists($manifestPath)) {
            $manifest = json_decode(file_get_contents($manifestPath), true);

            if ($manifest) {
                // Check for entry point in different possible locations
                $entryPoint = null;
                foreach (['resources/js/app.js', 'resources/js/app.tsx', 'app.js', 'app.tsx'] as $possible) {
                    if (isset($manifest[$possible])) {
                        $entryPoint = $possible;
                        break;
                    }
                }

                if ($entryPoint) {
                    $file = is_string($manifest[$entryPoint])
                        ? $manifest[$entryPoint]
                        : ($manifest[$entryPoint]['file'] ?? null);

                    if ($file) {
                        return '<script type="module" src="'.$this->fixAssetPath($file, $isVite).'"></script>';
                    }
                }
            }
        }

        // Fallback: search for JS files directly
        $jsFiles = glob(public_path('vendor/novus/assets/*.js'));
        if (empty($jsFiles)) {
            $jsFiles = glob(public_path('vendor/novus/*.js'));
        }

        if (! empty($jsFiles)) {
            $jsFile = basename($jsFiles[0]);
            if (strpos($jsFiles[0], '/assets/') !== false) {
                return '<script type="module" src="'.asset('vendor/novus/assets/'.$jsFile).'"></script>';
            }

            return '<script type="module" src="'.asset('vendor/novus/'.$jsFile).'"></script>';
        }

        return '<!-- No JS assets found -->';
    }

    /**
     * Render link tags for CSS assets
     */
    public function styles(): string
    {
        $manifestInfo = $this->getManifestInfo();
        $manifestPath = $manifestInfo['path'];
        $isVite = $manifestInfo['isVite'];

        if ($manifestPath && file_exists($manifestPath)) {
            $manifest = json_decode(file_get_contents($manifestPath), true);

            if ($manifest) {
                // Check for entry point
                $entryPoint = null;
                foreach (['resources/js/app.js', 'resources/js/app.tsx', 'app.js', 'app.tsx'] as $possible) {
                    if (isset($manifest[$possible])) {
                        $entryPoint = $possible;
                        break;
                    }
                }

                if ($entryPoint) {
                    // Get CSS files for this entry
                    $cssFiles = [];

                    if (isset($manifest[$entryPoint]['css'])) {
                        $cssFiles = $manifest[$entryPoint]['css'];
                    } elseif (isset($manifest[$entryPoint]['imports'])) {
                        // Check imports for CSS
                        foreach ($manifest[$entryPoint]['imports'] as $import) {
                            if (isset($manifest[$import]['css'])) {
                                $cssFiles = array_merge($cssFiles, $manifest[$import]['css']);
                            }
                        }
                    }

                    if (! empty($cssFiles)) {
                        $tags = [];
                        foreach ($cssFiles as $file) {
                            $tags[] = '<link rel="stylesheet" href="'.$this->fixAssetPath($file, $isVite).'">';
                        }

                        return implode("\n", $tags);
                    }
                }
            }
        }

        // Fallback: search for CSS files directly
        $cssFiles = glob(public_path('vendor/novus/assets/*.css'));
        if (empty($cssFiles)) {
            $cssFiles = glob(public_path('vendor/novus/*.css'));
        }

        if (! empty($cssFiles)) {
            $tags = [];
            foreach ($cssFiles as $file) {
                $cssFile = basename($file);
                if (strpos($file, '/assets/') !== false) {
                    $tags[] = '<link rel="stylesheet" href="'.asset('vendor/novus/assets/'.$cssFile).'">';
                } else {
                    $tags[] = '<link rel="stylesheet" href="'.asset('vendor/novus/'.$cssFile).'">';
                }
            }

            return implode("\n", $tags);
        }

        return '<!-- No CSS assets found -->';
    }
}
