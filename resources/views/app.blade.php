<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <title inertia>{{ config('novus.app_name', 'Novus') }}</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    {{-- Handle assets differently in production vs development --}}
    @if(app()->environment('production'))
        @php
            $manifestPath = public_path('vendor/novus/manifest.json');
            $jsAsset = 'app.js';
            $cssAsset = 'app.css';

            if (file_exists($manifestPath)) {
                $manifest = json_decode(file_get_contents($manifestPath), true);
                if ($manifest && isset($manifest['resources/js/app.tsx'])) {
                    $jsAsset = $manifest['resources/js/app.tsx']['file'] ?? $jsAsset;
                    $cssAssets = $manifest['resources/js/app.tsx']['css'] ?? [];
                    $cssAsset = $cssAssets[0] ?? $cssAsset;
                }
            }
        @endphp

        <script type="module" src="{{ asset('vendor/novus/' . $jsAsset) }}"></script>
        <link rel="stylesheet" href="{{ asset('vendor/novus/' . $cssAsset) }}">
    @else
        {{-- Development mode - use Vite dev server --}}
        @viteReactRefresh
        @vite(['resources/js/vendor/novus/app.tsx', 'resources/css/vendor/novus/app.css'])
    @endif

    @inertiaHead
    @routes
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
