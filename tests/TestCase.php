<?php

namespace Shah\Novus\Tests;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
// Remove the Vite facade import
use Inertia\Inertia;
use Inertia\ServiceProvider as InertiaServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;
use Shah\Novus\Models\Author;
use Shah\Novus\NovusServiceProvider;

class TestCase extends Orchestra
{
    // Keep using RefreshDatabase
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Factory::guessFactoryNamesUsing(function (string $modelName) {
            return 'Shah\\Novus\\Database\\Factories\\'.class_basename($modelName).'Factory';
        });

        // Configure Inertia
        Inertia::setRootView('novus::app');
    }

    /**
     * Define database migrations.
     */
    protected function defineDatabaseMigrations()
    {
        // This method will be called by the RefreshDatabase trait
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
    }

    /**
     * Get package providers.
     *
     * @param  \Illuminate\Foundation\Application  $app
     * @return array
     */
    protected function getPackageProviders($app)
    {
        return [
            NovusServiceProvider::class,
            InertiaServiceProvider::class,
        ];
    }

    /**
     * Define environment setup.
     *
     * @param  \Illuminate\Foundation\Application  $app
     * @return void
     */
    protected function getEnvironmentSetUp($app)
    {
        // Use SQLite in-memory database
        $app['config']->set('database.default', 'sqlite');
        $app['config']->set('database.connections.sqlite', [
            'driver' => 'sqlite',
            'database' => ':memory:',
            'prefix' => '',
        ]);

        // Set app key
        $app['config']->set('app.key', 'base64:'.base64_encode(random_bytes(32)));

        // Configure storage for testing
        Storage::fake('public');
        $app['config']->set('novus.storage_disk', 'public');
        $app['config']->set('novus.storage_path', 'novus-media');

        // Configure Inertia
        $app['config']->set('inertia.testing.enabled', true);
        $app['config']->set('inertia.testing.page_paths', [
            __DIR__.'/../resources/js/Pages',
        ]);

        // Add views path
        $app['config']->set('view.paths', [
            __DIR__.'/../resources/views',
        ]);

        // Add this to handle Vite in tests
        $app['config']->set('app.asset_url', '/');
    }

    /**
     * Create and authenticate an author for testing
     */
    protected function actingAsAuthor($author = null)
    {
        $author = $author ?: Author::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        Auth::guard('novus')->login($author);

        $this->actingAs($author, 'novus');

        return $author;
    }

    /**
     * Create a test image file
     */
    protected function createTestImage($name = 'test.jpg', $kilobytes = 100)
    {
        return \Illuminate\Http\UploadedFile::fake()->image($name)->size($kilobytes);
    }

    /**
     * Assert that the response is an Inertia response
     */
    protected function assertInertia($response, $component, $callback = null)
    {
        $response->assertStatus(200);

        $response->assertJson([
            'component' => $component,
            'props' => [],
        ]);

        if ($callback) {
            $page = json_decode($response->getContent(), true);
            $callback($page['props']);
        }

        return $this;
    }
}
