# Novus CMS

Novus is a modern content management system (CMS) built specifically for Laravel applications. It combines the power of Laravel's backend with a sleek React-based admin interface for a seamless content management experience.

## Features

- **Modern Admin Interface** - Built with React, TypeScript, and Tailwind CSS
- **Headless Architecture** - Separate your content management from presentation
- **Rich Content Editor** - Create stunning posts with a powerful editor
- **Media Management** - Comprehensive asset management with image optimization
- **Categories & Tags** - Flexible content organization system
- **SEO Tools** - Built-in tools for optimizing content visibility
- **Google Analytics Integration** - Track traffic and user behavior
- **AI-Powered Assistance** - Optional content enhancement tools
- **API-First Design** - Easy access to your content via API

## Quick Install

```bash
# Require the package
composer require shah/novus

# Run the installation command
php artisan novus:prod

# Create an admin user
php artisan novus:create-author

# Link storage
php artisan storage:link
```

After installation, access your CMS at: `https://your-site.com/novus`

## Requirements

- PHP 8.2+
- Laravel 11+
- MySQL 8 or PostgreSQL 10+
- Node.js & NPM (for development)

## Documentation

For complete documentation, visit:
[https://novus.codemystify.com](https://novus.codemystify.com)

The documentation covers:
- Detailed installation instructions
- Configuration options
- Content management features
- Google Analytics integration
- AI features setup
- Customization options
- API usage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Novus CMS is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).
