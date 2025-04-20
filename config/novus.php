<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Novus Path
    |--------------------------------------------------------------------------
    |
    | This is the URI path where Novus will be accessible from. For example,
    | if set to 'admin', the dashboard will be available at '/admin'. You may
    | change this path to anything you like.
    |
    */
    'path' => env('NOVUS_PATH', 'novus'),

    /*
    |--------------------------------------------------------------------------
    | Novus Domain
    |--------------------------------------------------------------------------
    |
    | This is the subdomain where Novus will be accessible from. If you want
    | to use a dedicated subdomain like 'admin.example.com', set this value
    | accordingly. Set to null to use your application's primary domain.
    |
    */
    'domain' => env('NOVUS_DOMAIN'),

    /*
    |--------------------------------------------------------------------------
    | Logo Provider
    |--------------------------------------------------------------------------
    |
    | You may provide your own custom logo provider by implementing the
    | \Shah\Novus\Contracts\LogoProvider interface. Novus will automatically
    | use your class instead of the default, allowing full control over how
    | logos are resolved and displayed throughout the application.
    |
    */

    'logo_provider' => \Shah\Novus\Services\DefaultLogoProvider::class,

    /*
    |--------------------------------------------------------------------------
    | Novus Middleware Group
    |--------------------------------------------------------------------------
    |
    | This option defines the middleware group that Novus will use. By default,
    | Novus uses the 'web' middleware group. You may change this to a custom
    | middleware group if your application requires special middleware setup.
    |
    */
    'middleware_group' => [],

    /*
    |--------------------------------------------------------------------------
    | Default Media Disk
    |--------------------------------------------------------------------------
    |
    | This option controls which storage disk Novus will use for media files.
    | By default, Novus uses the 'public' disk. You may use any storage disk
    | that's configured in your application's filesystems configuration.
    |
    */
    'storage_disk' => env('NOVUS_STORAGE_DISK', 'public'),

    /*
    |--------------------------------------------------------------------------
    | Media Path
    |--------------------------------------------------------------------------
    |
    | This option defines the directory path where your media files will be
    | stored on the selected disk. This path is relative to the disk's root.
    | For example, if set to 'novus-media', files will be in '/storage/novus-media'.
    |
    */
    'storage_path' => env('NOVUS_STORAGE_PATH', 'novus-media'),

    /*
    |--------------------------------------------------------------------------
    | Access Control
    |--------------------------------------------------------------------------
    |
    | This configuration controls which class is responsible for determining
    | user access to the Novus dashboard. You may replace this with your own
    | implementation of the Accessible interface to customize authorization.
    |
    */
    'access_control' => \Shah\Novus\Services\Auth\AccessResolver::class,

    /*
    |--------------------------------------------------------------------------
    | Media Image Sizes
    |--------------------------------------------------------------------------
    |
    | When images are uploaded, Novus will automatically create resized versions
    | according to these configurations. Each key defines a size name, with a
    | configuration array specifying the width and height in pixels.
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
    | Items Per Page
    |--------------------------------------------------------------------------
    |
    | This value determines the default number of items to display per page
    | in paginated lists throughout the Novus dashboard. Users can override
    | this setting in the UI if the feature is available.
    |
    */
    'items_per_page' => env('NOVUS_PER_PAGE', 10),

    /*
    |--------------------------------------------------------------------------
    | Novus Frontend URL
    |--------------------------------------------------------------------------
    |
    | This URL is used to generate frontend links to your content. It should
    | point to where your blog or site is publicly accessible. This is used
    | when creating share links or generating SEO preview cards.
    |
    */
    'frontend_url' => env('NOVUS_FRONTEND_URL', env('APP_URL')),

    /*
    |--------------------------------------------------------------------------
    | Database Connection
    |--------------------------------------------------------------------------
    |
    | This option controls which database connection Novus will use. By default,
    | it uses your application's default connection. You may specify any
    | connection from your database configuration if you want to use a
    | separate database for Novus content.
    |
    */
    'database_connection' => env('NOVUS_DATABASE_CONNECTION', env('DB_CONNECTION', 'mysql')),

    /*
    |--------------------------------------------------------------------------
    | Analytics Configuration
    |--------------------------------------------------------------------------
    |
    | These settings control the integration with analytics platforms like
    | Google Analytics. You can configure data collection, caching behavior,
    | and which analytics features are displayed in the dashboard.
    |
    */
    'analytics' => [

        /*
        |--------------------------------------------------------------------------
        | Google Analytics Property ID
        |--------------------------------------------------------------------------
        |
        | Your Google Analytics property identifier. For GA4 properties, this will
        | be in the format of 'G-XXXXXXXXXX'. For Universal Analytics (deprecated),
        | it would be in the format 'UA-XXXXXXXX-X'.
        |
        */
        'property_id' => env('ANALYTICS_PROPERTY_ID', '485547706'),

        /*
        |--------------------------------------------------------------------------
        | Service Account Credentials JSON
        |--------------------------------------------------------------------------
        |
        | The absolute file path to your service-account-credentials.json file.
        | This file contains the necessary authentication credentials to access
        | the Google Analytics API. You can generate this file in the Google
        | Cloud Console when setting up a service account.
        |
        */
        'service_account_credentials_json' => storage_path('app/analytics/service-account-credentials.json'),

        /*
        |--------------------------------------------------------------------------
        | Cache Lifetime
        |--------------------------------------------------------------------------
        |
        | To improve performance, analytics data is cached. This value determines
        | how long (in minutes) to cache the responses from Google Analytics.
        | Setting this to zero will disable caching entirely.
        |
        */
        'cache_lifetime_in_minutes' => 60,

        /*
        |--------------------------------------------------------------------------
        | Data View Options
        |--------------------------------------------------------------------------
        |
        | These settings control how analytics data is displayed in the dashboard.
        | You can set the default time period and which periods are available
        | for users to select in the dashboard interface.
        |
        */
        'default_period' => 30, // Default number of days to show stats for
        'available_periods' => [30, 60, 90, 180], // Period options in days

        /*
        |--------------------------------------------------------------------------
        | Dashboard Widgets
        |--------------------------------------------------------------------------
        |
        | Control which analytics widgets are displayed on the dashboard.
        | Each widget can be individually enabled or disabled based on
        | your preferences and reporting needs.
        |
        */
        'dashboard_widgets' => [
            'visitors_chart' => true,
            'top_pages' => true,
            'active_users' => true,
            'top_browsers' => true,
            'top_referrers' => true,
        ],

        /*
        |--------------------------------------------------------------------------
        | Performance Metrics
        |--------------------------------------------------------------------------
        |
        | Control which performance metrics are tracked and displayed in reports.
        | These metrics provide insights into how users interact with your site
        | and how well your site performs for visitors.
        |
        */
        'performance_metrics' => [
            'bounce_rate' => true,
            'session_duration' => true,
            'page_load_time' => true,
            'device_categories' => true,
        ],

        /*
        |--------------------------------------------------------------------------
        | SEO Metrics
        |--------------------------------------------------------------------------
        |
        | Control which SEO-related metrics are tracked and displayed in reports.
        | These metrics help you understand your site's visibility in search
        | engines and how users find your content.
        |
        */
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
    | Configure integration with AI services for content enhancement.
    | Novus uses Laravel Prism for LLM interactions. These settings control
    | provider configuration, model selection, and feature availability.
    |
    */
    'ai' => [
        /*
        |--------------------------------------------------------------------------
        | Enable AI Features
        |--------------------------------------------------------------------------
        |
        | This global toggle controls whether AI features are enabled throughout
        | the application. Set to false to completely disable all AI functionality,
        | regardless of other AI configuration settings.
        |
        */
        'enabled' => env('NOVUS_AI_ENABLED', false),

        /*
        |--------------------------------------------------------------------------
        | AI Provider
        |--------------------------------------------------------------------------
        |
        | Specify which AI provider to use for language model interactions.
        | Supported providers include 'openai', 'anthropic', and 'ollama'.
        | This should match the provider configuration in your Prism setup.
        |
        */
        'provider' => env('NOVUS_AI_PROVIDER', 'openai'),

        /*
        |--------------------------------------------------------------------------
        | AI Provider Configuration
        |--------------------------------------------------------------------------
        |
        | Provider-specific configuration settings. This includes API endpoints,
        | authentication credentials, and organization details required by the
        | AI provider to authenticate and process your requests.
        |
        | For more details, see: https://github.com/prism-php/prism/blob/main/config/prism.php
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
        | Control which AI assistance features are available in the content editor.
        | Each feature can be individually enabled or disabled. These toggles
        | affect the editor UI and available AI commands.
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
        | and performance. Higher limits allow more complex outputs but may
        | increase API costs and response times.
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
        | The maximum time (in seconds) to wait for a response from the AI provider
        | before timing out. Complex operations may require longer timeouts,
        | especially when generating substantial content.
        |
        */
        'timeout' => env('NOVUS_AI_TIMEOUT', 30),

        /*
        |--------------------------------------------------------------------------
        | Mock Responses
        |--------------------------------------------------------------------------
        |
        | When true, AI requests will return predefined mock responses instead of
        | calling the actual AI provider API. This is useful for development and
        | testing environments where you want to avoid API costs.
        |
        */
        'mock_responses' => env('NOVUS_AI_MOCK_RESPONSES', false),
    ],
];
