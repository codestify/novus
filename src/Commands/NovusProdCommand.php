<?php

namespace Shah\Novus\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;

class NovusProdCommand extends Command
{
    protected $signature = 'novus:install
                            {--force : Overwrite any existing assets or config}
                            {--no-build : Skip the frontend build process}
                            {--dev : Install in development mode}';

    protected $description = 'Install and set up Novus CMS';

    public function handle(): int
    {
        $this->info('Installing Novus CMS...');
        $this->newLine();

        // Check requirements first
        if (! $this->checkRequirements()) {
            return self::FAILURE;
        }

        $this->components->info('Publishing required files...');

        // Publish configuration files
        $this->publishConfiguration();

        // Publish migrations
        $this->publishMigrations();

        // Run migrations
        $this->runMigrations();

        // Set up frontend assets
        $this->setupFrontendAssets();

        // Publish or build assets based on options
        if ($this->option('no-build')) {
            $this->publishCompiledAssets();
        } else {
            $this->buildFrontendAssets();
        }

        // Add dev features if requested
        if ($this->option('dev')) {
            $this->setupDevEnvironment();
        }

        // Final steps
        $this->displayFinalInstructions();

        return self::SUCCESS;
    }

    /**
     * Check if the system meets all requirements for Novus
     */
    protected function checkRequirements(): bool
    {
        $this->components->info('Checking system requirements...');

        $requirements = [
            'PHP >= 8.1' => version_compare(PHP_VERSION, '8.1.0', '>='),
            'Laravel >= 10.0' => class_exists(\Illuminate\Foundation\Application::class) &&
                              version_compare(app()->version(), '10.0.0', '>='),
            'Inertia' => class_exists(\Inertia\Inertia::class),
        ];

        $missingRequirements = array_filter($requirements, fn ($met) => ! $met);

        if (! empty($missingRequirements)) {
            $this->components->error('Missing requirements:');
            foreach (array_keys($missingRequirements) as $requirement) {
                $this->components->error("- {$requirement}");
            }

            if (array_key_exists('Inertia', $missingRequirements)) {
                $this->components->info('Please install Inertia.js first:');
                $this->info('composer require inertiajs/inertia-laravel');
            }

            return false;
        }

        $this->components->task('System requirements check', fn () => true);

        return true;
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

        $this->components->task('Publishing configuration', function () {
            return true;
        });

        // Create storage directories if they don't exist
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

        $this->components->task('Publishing migrations', function () {
            return true;
        });
    }

    /**
     * Run database migrations
     */
    protected function runMigrations(): void
    {
        if ($this->confirm('Would you like to run migrations now?', true)) {
            $this->components->task('Running migrations', function () {
                $migrated = Artisan::call('migrate');

                return $migrated === 0;
            });
        }
    }

    /**
     * Set up frontend asset symlinks
     */
    protected function setupFrontendAssets(): void
    {
        // Create necessary directories
        $jsVendorPath = resource_path('js/vendor/novus');
        $cssVendorPath = resource_path('css/vendor/novus');

        // Ensure parent directories exist
        if (! is_dir(dirname($jsVendorPath))) {
            File::makeDirectory(dirname($jsVendorPath), 0755, true);
        }

        if (! is_dir(dirname($cssVendorPath))) {
            File::makeDirectory(dirname($cssVendorPath), 0755, true);
        }

        // Check if links already exist
        $jsExists = is_dir($jsVendorPath) || is_link($jsVendorPath);
        $cssExists = is_dir($cssVendorPath) || is_link($cssVendorPath);

        // Create links if they don't exist
        if (! $jsExists || $this->option('force')) {
            if ($jsExists) {
                if (is_link($jsVendorPath)) {
                    File::delete($jsVendorPath);
                } else {
                    File::deleteDirectory($jsVendorPath);
                }
            }

            File::link(
                base_path('vendor/shah/novus/resources/js'),
                $jsVendorPath
            );
        }

        if (! $cssExists || $this->option('force')) {
            if ($cssExists) {
                if (is_link($cssVendorPath)) {
                    File::delete($cssVendorPath);
                } else {
                    File::deleteDirectory($cssVendorPath);
                }
            }

            File::link(
                base_path('vendor/shah/novus/resources/css'),
                $cssVendorPath
            );
        }

        $this->components->task('Setting up frontend assets', function () {
            return true;
        });
    }

    /**
     * Build frontend assets using Node.js
     */
    protected function buildFrontendAssets(): void
    {
        $this->components->info('Building Novus frontend assets...');

        // Check if Node.js is installed with improved error handling
        try {
            $process = Process::run('node -v');
            $nodeInstalled = $process->successful();
            $nodeVersion = trim($process->output());
        } catch (\Exception $e) {
            $nodeInstalled = false;
            $nodeVersion = null;
        }

        if (! $nodeInstalled) {
            $this->components->error('Node.js is required to build the Novus frontend assets.');
            $this->components->warn('Please install Node.js and run this command again, or use the --no-build option.');

            if ($this->confirm('Would you like to continue with pre-compiled assets instead?', true)) {
                $this->publishCompiledAssets();

                return;
            }

            throw new \RuntimeException('Node.js is required and not installed.');
        }

        $this->components->info("Using Node.js version: $nodeVersion");

        $packagePath = base_path('vendor/shah/novus');

        // Check if package.json exists
        if (! file_exists($packagePath.'/package.json')) {
            $this->components->error('package.json not found in the Novus package directory.');
            $this->components->info('Falling back to pre-compiled assets.');
            $this->publishCompiledAssets();

            return;
        }

        // Install npm dependencies and build assets
        $this->components->task('Installing NPM dependencies', function () use ($packagePath) {
            $process = Process::path($packagePath)->run('npm install');

            if (! $process->successful()) {
                $this->components->error('Failed to install NPM dependencies:');
                $this->components->error($process->errorOutput());

                return false;
            }

            return true;
        });

        $this->components->task('Building frontend assets', function () use ($packagePath) {
            $process = Process::path($packagePath)->run('npm run build');

            if (! $process->successful()) {
                $this->components->error('Failed to build frontend assets:');
                $this->components->error($process->errorOutput());

                return false;
            }

            return true;
        });

        // Publish the built assets
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

        $this->components->task('Publishing compiled assets', function () {
            return true;
        });

        // Ensure the assets directory exists in public
        if (! File::exists(public_path('vendor/novus'))) {
            $this->components->warn('Asset directory not found. You may need to run `npm run build` in the package directory.');
        }
    }

    /**
     * Set up development environment
     */
    protected function setupDevEnvironment(): void
    {
        $this->components->info('Setting up development environment...');

        // Call the dev setup command
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

        $this->newLine();
        $this->info('For more information, visit:');
        $this->comment('https://github.com/shah/novus');

        // Add a notice about dev mode if applicable
        if ($this->option('dev')) {
            $this->newLine();
            $this->components->info('Development mode is enabled. Assets are symlinked for hot reloading.');
            $this->info('Run your Vite development server with:');
            $this->comment('npm run dev');
        }

        $this->newLine();
    }
}
