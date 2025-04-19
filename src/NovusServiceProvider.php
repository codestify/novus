<?php

namespace Shah\Novus;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Shah\Novus\Commands\CreateAuthorCommand;
use Shah\Novus\Commands\InstallCommand;
use Shah\Novus\Commands\NovusDevCommand;
use Shah\Novus\Commands\NovusProdCommand;
use Shah\Novus\Contracts\Accessible;
use Shah\Novus\Http\Middleware\HandleInertiaRequests;
use Shah\Novus\Http\Middleware\NovusAuthenticate;
use Shah\Novus\Http\Middleware\RedirectIfNovusAuthenticated;
use Shah\Novus\Models\Author;
use Shah\Novus\Services\AI\AiService;
use Shah\Novus\Services\AI\PromptService;
use Shah\Novus\Services\Auth\AccessResolver;
use Spatie\LaravelPackageTools\Commands\InstallCommand as SpatieInstallCommand;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class NovusServiceProvider extends PackageServiceProvider
{
    public function configurePackage(Package $package): void
    {
        $package
            ->name('novus')
            ->hasConfigFile()
            ->hasRoute('web')
            ->hasViews()
            ->hasInertiaComponents()
            ->hasMigrations()
            ->hasInstallCommand(function (SpatieInstallCommand $command) {
                $command
                    ->publishConfigFile()
                    ->publishMigrations()
                    ->copyAndRegisterServiceProviderInApp()
                    ->publishAssets()
                    ->askToRunMigrations();
            })
            ->hasCommands([
                NovusDevCommand::class,
                CreateAuthorCommand::class,
                NovusProdCommand::class,
            ]);
    }

    public function packageRegistered(): void
    {
        $this->app->singleton(HandleInertiaRequests::class);
        $this->app->singleton(Accessible::class, function ($app) {
            $accessResolver = config(
                'novus.access_control',
                AccessResolver::class
            );

            return $app->make($accessResolver);
        });

        $this->registerPrismConfiguration();

        $this->registerAiServices();

        $this->registerAuthGuard();

        $this->app['router']->aliasMiddleware('novus.guest', RedirectIfNovusAuthenticated::class);
        $this->app['router']->aliasMiddleware('novus.auth', NovusAuthenticate::class);
    }

    /**
     * Register AI service classes
     */
    private function registerAiServices(): void
    {
        // Register PromptService
        $this->app->singleton(PromptService::class);

        // Register AiService
        $this->app->singleton(AiService::class, function ($app) {
            return new AiService($app->make(PromptService::class));
        });
    }

    public function packageBooted(): void
    {
        $baseMiddleware = ['web', HandleInertiaRequests::class];
        $userMiddleware = config('novus.middleware_group', []);
        $middleware = array_merge($baseMiddleware, is_array($userMiddleware) ? $userMiddleware : [$userMiddleware]);

        Route::middleware($middleware)
            ->as('novus.')
            ->domain(config('novus.domain'))
            ->prefix(config('novus.path', 'novus'))
            ->group(function () {
                require __DIR__.'/../routes/web.php';
            });

        Inertia::setRootView('novus::app');

        // Define asset directories
        $assetSrcPath = __DIR__.'/../public/build';
        $assetDestPath = public_path('vendor/novus');

        // Publish assets with versioning support
        $this->publishes([
            $assetSrcPath => $assetDestPath,
        ], ['novus-assets', 'laravel-assets']);

        // Create a direct link for development
        if (app()->environment('local')) {
            $this->createDevelopmentSymlinks();

            // Create symlinks for assets when in development
            $this->createAssetSymlinksForDevelopment($assetSrcPath, $assetDestPath);
        }
    }

    /**
     * Register Prism LLM configuration
     */
    private function registerPrismConfiguration(): void
    {
        $aiConfig = config('novus.ai', []);

        if (! ($aiConfig['enabled'] ?? false)) {
            return;
        }

        if (! config()->has('prism.providers')) {
            $provider = $aiConfig['provider'] ?? 'openai';
            $providerDetails = $aiConfig['provider_details'] ?? [];

            // Set up OpenAI provider
            if ($provider === 'openai') {
                $providerConfig = [
                    'url' => $providerDetails['url'] ?? 'https://api.openai.com/v1',
                    'api_key' => $aiConfig['api_key'] ?? $providerDetails['api_key'] ?? null,
                    'organization' => $providerDetails['organization'] ?? null,
                    'project' => $providerDetails['project'] ?? null,
                ];
            } else {
                $providerConfig = [
                    'api_key' => $aiConfig['api_key'] ?? null,
                ];
                if (isset($providerDetails['url'])) {
                    $providerConfig['url'] = $providerDetails['url'];
                }
            }

            config([
                'prism.providers.'.$provider => $providerConfig,
                'prism.prism_server.enabled' => true,
            ]);
        }
    }

    /**
     * Register the package's authentication guard.
     */
    private function registerAuthGuard(): void
    {
        // Register the auth provider
        $this->app['config']->set('auth.providers.novus_authors', [
            'driver' => 'eloquent',
            'model' => Author::class,
        ]);

        // Register the auth guard
        $this->app['config']->set('auth.guards.novus', [
            'driver' => 'session',
            'provider' => 'novus_authors',
        ]);

        // Register password reset broker
        $this->app['config']->set('auth.passwords.novus_authors', [
            'provider' => 'novus_authors',
            'table' => 'novus_password_resets',
            'expire' => 60, // minutes
            'throttle' => 60, // seconds
        ]);
    }

    /**
     * Create development symlinks for resources.
     *
     * @return void
     */
    private function createDevelopmentSymlinks()
    {
        // Create symbolic link from package resources to app resources
        $packageJsPath = realpath(__DIR__.'/../resources/js');
        $appJsPath = resource_path('js/vendor/novus');

        // Create the vendor directory if it doesn't exist
        if (! is_dir(resource_path('js/vendor'))) {
            File::makeDirectory(resource_path('js/vendor'), 0755, true);
        }

        // Create symbolic link if it doesn't exist
        if (! is_dir($appJsPath) && is_dir($packageJsPath)) {
            // Remove old symlink if it exists but points to the wrong location
            if (is_link($appJsPath)) {
                File::delete($appJsPath);
            }

            File::link($packageJsPath, $appJsPath);
        }

        // Also link CSS if needed
        $packageCssPath = realpath(__DIR__.'/../resources/css');
        $appCssPath = resource_path('css/vendor/novus');

        if (is_dir($packageCssPath)) {
            if (! is_dir(resource_path('css/vendor'))) {
                File::makeDirectory(resource_path('css/vendor'), 0755, true);
            }

            if (! is_dir($appCssPath)) {
                // Remove old symlink if it exists but points to the wrong location
                if (is_link($appCssPath)) {
                    File::delete($appCssPath);
                }

                File::link($packageCssPath, $appCssPath);
            }
        }
    }

    /**
     * Create symlinks for assets in development mode
     *
     * @param  string  $sourcePath  The source path for assets
     * @param  string  $targetPath  The target path for the symlink
     * @return void
     */
    private function createAssetSymlinksForDevelopment($sourcePath, $targetPath)
    {
        // Check if we have built assets in the package
        if (is_dir($sourcePath)) {
            $publicVendorPath = dirname($targetPath);

            // Create vendor directory if it doesn't exist
            if (! is_dir($publicVendorPath)) {
                File::makeDirectory($publicVendorPath, 0755, true);
            }

            // Create or update the symlink
            if (is_dir($targetPath) || is_link($targetPath)) {
                if (is_link($targetPath)) {
                    File::delete($targetPath);
                } else {
                    File::deleteDirectory($targetPath);
                }
            }

            File::link($sourcePath, $targetPath);
        }
    }
}
