<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Novus Path
    |--------------------------------------------------------------------------
    |
    | This is the URI path where Novus will be accessible from. Feel free
    | to change this path to anything you like.
    |
    */
    'path' => env('NOVUS_PATH', 'novus'),

    /*
    |--------------------------------------------------------------------------
    | Novus Domain
    |--------------------------------------------------------------------------
    |
    | This is the subdomain where Novus will be accessible from. Set this to null
    | if you want to access Novus from the same domain as your application.
    |
    */
    'domain' => env('NOVUS_DOMAIN'),

    /*
    |--------------------------------------------------------------------------
    | Novus Middleware Group
    |--------------------------------------------------------------------------
    |
    | This is the middleware group that Novus will use. By default it uses the
    | 'web' middleware group, but you can change this to whatever you want.
    |
    */
    'middleware_group' => [],

    /*
    |--------------------------------------------------------------------------
    | Default Media Disk
    |--------------------------------------------------------------------------
    |
    | This is the storage disk Novus will use to store media files. This can be
    | a local disk, or one of the cloud storage disks configured by your app.
    |
    */
    'storage_disk' => env('NOVUS_STORAGE_DISK', 'public'),

    /*
    |--------------------------------------------------------------------------
    | Media Path
    |--------------------------------------------------------------------------
    |
    | This is the directory where your media files will be stored on the disk
    | specified above.
    |
    */
    'storage_path' => env('NOVUS_STORAGE_PATH', 'novus-media'),

    /*
    |--------------------------------------------------------------------------
    | Default Author Role
    |--------------------------------------------------------------------------
    |
    | This is the default role that will be assigned to newly created authors.
    | You can change this to any role that you defined in your application.
    |
    */
    'default_author_role' => env('NOVUS_DEFAULT_AUTHOR_ROLE', 'author'),

    /*
    |--------------------------------------------------------------------------
    | Access Control
    |--------------------------------------------------------------------------
    |
    | This option controls the class responsible for determining if a user
    | can access the Novus dashboard. You can replace this with
    | your own implementation of the Accessible interface.
    |
    */

    'access_control' => \Shah\Novus\Services\Auth\AccessResolver::class,

    /*
    |--------------------------------------------------------------------------
    | Media Image Sizes
    |--------------------------------------------------------------------------
    |
    | These are the image sizes that Novus will create when uploading images.
    | You can add as many sizes as you want. The key is the name, and the value
    | is an array with width and height keys.
    |
    */
    'image_sizes' => [
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
    ],

    /*
    |--------------------------------------------------------------------------
    | Novus Frontend URL
    |--------------------------------------------------------------------------
    |
    | This is the URL where your blog is accessible from. This is used to generate
    | frontend URLs for your posts and other content.
    |
    */
    'frontend_url' => env('NOVUS_FRONTEND_URL', env('APP_URL')),

    /*
    |--------------------------------------------------------------------------
    | Database Connection
    |--------------------------------------------------------------------------
    |
    | This is the database connection that Novus will use. By default it uses
    | the default connection, but you can change this to any connection defined
    | in your database config.
    |
    */
    'database_connection' => env('NOVUS_DATABASE_CONNECTION', env('DB_CONNECTION', 'mysql')),

    /*
   |--------------------------------------------------------------------------
   | Analytics Configuration
   |--------------------------------------------------------------------------
   |
   | Settings for integrating with analytics platforms like Google Analytics.
   | These settings control data fetching, caching, and display behavior.
   |
   */
    'analytics' => [

        /*
        |--------------------------------------------------------------------------
        | Google Analytics Property ID
        |--------------------------------------------------------------------------
        |
        | Your Google Analytics property ID. For GA4 properties, this will be in
        | the format of 'G-XXXXXXXXXX'. For Universal Analytics (deprecated),
        | it would be in the format 'UA-XXXXXXXX-X'.
        |
        */
        'property_id' => env('ANALYTICS_PROPERTY_ID', '485547706'),

        /*
        |--------------------------------------------------------------------------
        | Service Account Credentials JSON
        |--------------------------------------------------------------------------
        |
        | The absolute path to the service-account-credentials.json file.
        | This file contains the authentication credentials required to access
        | the Google Analytics API. You can obtain this file from the
        | Google Cloud Console when setting up your service account.
        |
        */
        'service_account_credentials_json' => storage_path('app/analytics/service-account-credentials.json'),

        /*
        |--------------------------------------------------------------------------
        | Cache Lifetime
        |--------------------------------------------------------------------------
        |
        | The amount of time (in minutes) the Google Analytics response will be cached.
        | If you set this to zero, the responses won't be cached at all.
        |
        */
        'cache_lifetime_in_minutes' => 1,

        // Data view options
        'default_period' => 30, // Default number of days to show stats for
        'available_periods' => [7, 14, 21, 30], // Period options in days

        // Dashboard widgets configuration
        'dashboard_widgets' => [
            'visitors_chart' => true,
            'top_pages' => true,
            'active_users' => true,
            'top_browsers' => true,
            'top_referrers' => true,
        ],

        // Performance metrics to track and display
        'performance_metrics' => [
            'bounce_rate' => true,
            'session_duration' => true,
            'page_load_time' => true,
            'device_categories' => true,
        ],

        // SEO metrics to track and display
        'seo_metrics' => [
            'search_visits' => true,
            'keywords' => true,
            'landing_pages' => true,
            'search_engines' => true,
            'click_through_rate' => true,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | AI Integration Configuration
    |--------------------------------------------------------------------------
    |
    | Configure the AI integration settings for Novus, using Laravel Prism
    | for LLM interactions. These settings control which AI provider to use,
    | model selection, API credentials, and feature availability.
    |
    */
    'ai' => [
        /*
        |--------------------------------------------------------------------------
        | Enable AI Features
        |--------------------------------------------------------------------------
        |
        | This option controls whether AI features are enabled throughout the
        | application. Set to false to completely disable all AI functionality.
        |
        */
        'enabled' => env('NOVUS_AI_ENABLED', false),

        /*
        |--------------------------------------------------------------------------
        | AI Provider
        |--------------------------------------------------------------------------
        |
        | The AI provider to use for AI interactions. Supported providers
        | include 'openai', 'anthropic', and 'ollama'. This should match
        | the provider configuration in your Prism setup.
        |
        */
        'provider' => env('NOVUS_AI_PROVIDER', 'openai'),

        /*
         |--------------------------------------------------------------------------
         | AI Provider Configuration
         |--------------------------------------------------------------------------
         |
         | Here you may define the details of your preferred AI provider used for
         | large language model (LLM) interactions. Supported providers include
         | "openai", "anthropic", and "ollama". Ensure this matches your Prism
         | configuration to maintain consistency across your application.
         |
         |  Read more about configuring your AI provider in the Prism documentation:
         |  https://github.com/prism-php/prism/blob/main/config/prism.php
         |
         */

        'provider_details' => [
            'url' => env('OPENAI_URL', 'https://api.openai.com/v1'),
            'api_key' => env('OPENAI_API_KEY', env('NOVUS_AI_API_KEY', '')),
            'organization' => env('OPENAI_ORGANIZATION', null),
            'project' => env('OPENAI_PROJECT', null),
        ],

        /*
        |--------------------------------------------------------------------------
        | Content Generation Features
        |--------------------------------------------------------------------------
        |
        | Configure which content generation features are available in the editor.
        | You can enable or disable specific AI assistance tools.
        |
        */
        'content_features' => [
            'title_generation' => true,
            'content_expansion' => true,
            'content_summarization' => true,
            'grammar_checking' => true,
            'seo_optimization' => true,
        ],

        /*
        |--------------------------------------------------------------------------
        | Max Token Limits
        |--------------------------------------------------------------------------
        |
        | Set maximum token limits for different AI operations to control costs
        | and performance. Adjust these based on your needs and pricing tier.
        |
        */
        'max_tokens' => [
            'title_generation' => 100,
            'content_generation' => 1000,
            'summarization' => 300,
        ],

        /*
        |--------------------------------------------------------------------------
        | Request Timeout
        |--------------------------------------------------------------------------
        |
        | The maximum time in seconds to wait for a response from the AI provider
        | before timing out. Increase this for more complex operations.
        |
        */
        'timeout' => env('NOVUS_AI_TIMEOUT', 30),

        'mock_responses' => env('NOVUS_AI_MOCK_RESPONSES', app()->environment('local', 'testing')),

    ],
];
