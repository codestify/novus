<?php

namespace Shah\Novus\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;

class NovusProdCommand extends Command
{
    protected $signature = 'novus:prod
                            {--force : Overwrite any existing assets or config}
                            {--no-build : Skip the frontend build process}
                            {--dev : Install in development mode}';

    protected $description = 'Install and set up Novus CMS';

    /**
     * The path to the package
     */
    protected string $packagePath;

    public function handle(): int
    {
        $this->info('Installing Novus CMS...');
        $this->newLine();

        $this->determinePackagePath();

        $this->publishConfiguration();

        $this->publishMigrations();

        $this->runMigrations();

        $this->setupFrontendAssets();

        if ($this->option('no-build')) {
            $this->publishCompiledAssets();
        } else {
            $this->buildFrontendAssets();
        }

        if ($this->option('dev')) {
            $this->setupDevEnvironment();
        }

        $this->displayFinalInstructions();

        return self::SUCCESS;
    }

    /**
     * Determine the package path
     */
    protected function determinePackagePath(): void
    {
        if (app()->environment('local') && File::exists(base_path('packages/novus'))) {
            $this->packagePath = base_path('packages/novus');
        } else {
            $this->packagePath = base_path('vendor/codemystify/novus');
        }

        $this->info("Using package path: {$this->packagePath}");
    }

    /**
     * Publish Novus configuration files
     */
    protected function publishConfiguration(): void
    {
        $params = ['--provider' => 'Shah\Novus\NovusServiceProvider'];

        if ($this->option('force')) {
            $params['--force'] = true;
        }

        $this->callSilently('vendor:publish', array_merge($params, [
            '--tag' => 'novus-config',
        ]));

        $this->components->task('Publishing configuration', fn () => true);

        if (! File::exists(storage_path('app/novus'))) {
            File::makeDirectory(storage_path('app/novus'), 0755, true);
        }
    }

    /**
     * Publish database migrations
     */
    protected function publishMigrations(): void
    {
        $params = ['--provider' => 'Shah\Novus\NovusServiceProvider'];

        if ($this->option('force')) {
            $params['--force'] = true;
        }

        $this->callSilently('vendor:publish', array_merge($params, [
            '--tag' => 'novus-migrations',
        ]));

        $this->components->task('Publishing migrations', fn () => true);
    }

    /**
     * Run database migrations
     */
    protected function runMigrations(): void
    {
        if ($this->confirm('Would you like to run migrations now?', true)) {
            $this->components->task('Running migrations', function () {
                return Artisan::call('migrate') === 0;
            });
        }
    }

    /**
     * Set up frontend asset symlinks
     */
    protected function setupFrontendAssets(): void
    {
        $this->components->info('Setting up frontend assets...');

        $jsVendorPath = resource_path('js/vendor/novus');
        $cssVendorPath = resource_path('css/vendor/novus');

        $jsSourcePath = $this->packagePath.'/resources/js';
        $cssSourcePath = $this->packagePath.'/resources/css';

        File::ensureDirectoryExists(dirname($jsVendorPath));
        File::ensureDirectoryExists(dirname($cssVendorPath));

        $this->cleanExistingPath($jsVendorPath);
        $this->cleanExistingPath($cssVendorPath);

        if (File::exists($jsSourcePath)) {
            File::link($jsSourcePath, $jsVendorPath);
            $this->components->info("Created JS symlink: {$jsSourcePath} -> {$jsVendorPath}");
        } else {
            $this->components->warn("JS source path not found: {$jsSourcePath}");
        }

        if (File::exists($cssSourcePath)) {
            File::link($cssSourcePath, $cssVendorPath);
            $this->components->info("Created CSS symlink: {$cssSourcePath} -> {$cssVendorPath}");
        } else {
            $this->components->warn("CSS source path not found: {$cssSourcePath}");
        }

        $this->components->task('Frontend assets setup', fn () => true);
    }

    /**
     * Clean existing path (symlink or directory)
     */
    protected function cleanExistingPath(string $path): void
    {
        if (is_link($path)) {
            File::delete($path);
        } elseif (is_dir($path)) {
            File::deleteDirectory($path);
        }
    }

    /**
     * Build frontend assets using Node.js
     */
    protected function buildFrontendAssets(): void
    {
        $this->components->info('Building Novus frontend assets...');

        try {
            $process = Process::run('node -v');
            if (! $process->successful()) {
                throw new \RuntimeException('Node.js not found');
            }
            $nodeVersion = trim($process->output());
            $this->components->info("Using Node.js version: {$nodeVersion}");
        } catch (\Exception $e) {
            $this->components->error('Node.js is required to build the frontend assets.');

            if ($this->confirm('Would you like to continue with pre-compiled assets instead?', true)) {
                $this->publishCompiledAssets();

                return;
            }

            throw new \RuntimeException('Node.js is required and not installed.');
        }

        if (! File::exists($this->packagePath.'/package.json')) {
            $this->components->error('package.json not found in the Novus package directory.');
            $this->components->info('Falling back to pre-compiled assets.');
            $this->publishCompiledAssets();

            return;
        }

        $this->components->task('Installing NPM dependencies', function () {
            $process = Process::path($this->packagePath)->run('npm install');

            if (! $process->successful()) {
                $this->components->error('Failed to install NPM dependencies:');
                $this->components->error($process->errorOutput());

                return false;
            }

            return true;
        });

        $this->components->task('Building frontend assets', function () {
            $process = Process::path($this->packagePath)->run('npm run build');

            if (! $process->successful()) {
                $this->components->error('Failed to build frontend assets:');
                $this->components->error($process->errorOutput());

                return false;
            }

            return true;
        });

        $this->publishCompiledAssets();
    }

    /**
     * Publish pre-compiled assets
     */
    protected function publishCompiledAssets(): void
    {
        $params = ['--provider' => 'Shah\Novus\NovusServiceProvider'];

        if ($this->option('force')) {
            $params['--force'] = true;
        }

        $this->callSilently('vendor:publish', array_merge($params, [
            '--tag' => 'novus-assets',
        ]));

        $this->components->task('Publishing compiled assets', fn () => true);

        $assetPath = public_path('vendor/novus');

        if (! File::exists($assetPath)) {
            $this->components->warn('Asset directory not found in public path.');
            $this->publishAssetsManuallySuggestion($assetPath);

            return;
        }

        $jsFiles = File::glob($assetPath.'/*.js');
        $cssFiles = File::glob($assetPath.'/*.css');

        if (empty($jsFiles) && empty($cssFiles)) {
            $this->components->warn('No assets found in the published directory.');
            $this->publishAssetsManuallySuggestion($assetPath);

            return;
        }

        $this->components->info("Assets published successfully to: {$assetPath}");
        $this->components->info('Found '.count($jsFiles).' JS files and '.count($cssFiles).' CSS files.');
    }

    /**
     * Display suggestion for manual asset publishing
     */
    protected function publishAssetsManuallySuggestion(string $assetPath): void
    {
        $this->components->info('Manual steps to fix:');
        $this->info('  1. Run: php artisan vendor:publish --tag=novus-assets --force');
        $this->info('  2. Verify that assets exist in: '.$assetPath);
    }

    /**
     * Set up development environment
     */
    protected function setupDevEnvironment(): void
    {
        $this->components->info('Setting up development environment...');
        $this->call('novus:dev');
    }

    /**
     * Display final instructions
     */
    protected function displayFinalInstructions(): void
    {
        $this->newLine(2);
        $this->components->info('Novus CMS has been installed successfully!');

        $this->newLine();
        $this->info('You can now create an author account using:');
        $this->comment('php artisan novus:create-author');

        $this->newLine();
        $this->info('Access your Novus dashboard at:');
        $path = config('novus.path', 'novus');
        $this->comment(url($path));

        $this->newLine();
        $this->info('Your configuration file is located at:');
        $this->comment('config/novus.php');

        if ($this->option('dev')) {
            $this->newLine();
            $this->components->info('Development mode is enabled. Assets are symlinked for hot reloading.');
            $this->info('Run your Vite development server with:');
            $this->comment('npm run dev');
        }

        $this->newLine();
    }
}
