<?php

namespace Shah\Novus\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class NovusDevCommand extends Command
{
    protected $signature = 'novus:dev';

    protected $description = 'Set up Novus for development';

    public function handle()
    {
        $this->info('Setting up Novus for development...');

        // Create symlinks for development
        $this->createDevLinks();

        // Check if the main app's vite config includes our paths
        $this->checkViteConfig();

        $this->info('Novus development setup complete.');
        $this->info('Make sure to run npm run dev in your main application.');
    }

    protected function createDevLinks()
    {
        // Create resources/js/vendor/novus symlink
        $packageJsPath = dirname(__DIR__, 2).'/resources/js';
        $appJsPath = resource_path('js/vendor/novus');

        if (! is_dir(resource_path('js/vendor'))) {
            File::makeDirectory(resource_path('js/vendor'), 0755, true);
        }

        if (! is_dir($appJsPath) && is_dir($packageJsPath)) {
            $this->info('Creating symlink for JS resources...');
            File::link($packageJsPath, $appJsPath);
        }

        // Create resources/css/vendor/novus symlink if needed
        $packageCssPath = dirname(__DIR__, 2).'/resources/css';
        $appCssPath = resource_path('css/vendor/novus');

        if (is_dir($packageCssPath)) {
            if (! is_dir(resource_path('css/vendor'))) {
                File::makeDirectory(resource_path('css/vendor'), 0755, true);
            }

            if (! is_dir($appCssPath)) {
                $this->info('Creating symlink for CSS resources...');
                File::link($packageCssPath, $appCssPath);
            }
        }
    }

    protected function checkViteConfig()
    {
        $viteConfigPath = base_path('vite.config.js');
        $viteConfigTsPath = base_path('vite.config.ts');

        if (File::exists($viteConfigPath) || File::exists($viteConfigTsPath)) {
            $this->info('Please make sure your Vite config includes:');
            $this->info('input: [');
            $this->info('    "resources/css/app.css",');
            $this->info('    "resources/js/app.js",');
            $this->info('    "resources/js/vendor/novus/app.tsx",');
            $this->info('    "resources/css/vendor/novus/app.css"');
            $this->info('],');
        }
    }
}
