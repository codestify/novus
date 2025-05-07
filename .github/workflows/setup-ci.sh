#!/bin/bash
set -ex

# Ensure CI environment has proper case-insensitive compatibility
# This script runs in the GitHub Actions environment before the build

echo "Setting up CI environment for case-insensitive compatibility..."

# Create the hooks directory structure
if [ ! -d "resources/js/hooks" ]; then
  mkdir -p resources/js/hooks
  echo "Created resources/js/hooks directory"
fi

# Handle both uppercase and lowercase directory names
if [ -d "resources/js/Hooks" ]; then
  # Copy all hook files to the lowercase directory
  echo "Copying hook files to lowercase directory..."
  for file in resources/js/Hooks/*; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")
      cp -f "$file" "resources/js/hooks/$filename"
      echo "Copied $filename"
    fi
  done
else
  echo "resources/js/Hooks directory not found"
fi

# Create a basic Prettier config if needed
if [ ! -f ".prettierrc" ]; then
  echo "Creating basic .prettierrc file..."
  cat > .prettierrc <<EOL
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 4,
  "trailingComma": "all",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always"
}
EOL
  echo "Created .prettierrc file"
fi

# Setup a mock ziggy-js directory for CI
echo "Setting up mock Ziggy for CI environment..."
if [ ! -d "vendor/tightenco/ziggy" ]; then
  mkdir -p vendor/tightenco/ziggy
  echo "Created vendor/tightenco/ziggy directory"
fi

# Create the mock directory for ziggy-js.ts if it doesn't exist
mkdir -p resources/js/__mocks__

# Create a basic mock file for Ziggy JS
cat > resources/js/__mocks__/ziggy-js.ts <<EOL
/**
 * Mock implementation for ziggy-js
 * Used in testing and CI build environments when the real Ziggy package is not available
 */

// Named export for the route function (for imports like \`import { route } from "ziggy-js"\`)
export function route(name: string, params: any = {}, absolute: boolean = true): string {
  // Basic implementation that returns a mock route URL
  if (params && typeof params === 'object') {
    const paramString = Object.entries(params)
      .map(([key, value]) => \`\${key}=\${encodeURIComponent(String(value))}\`)
      .join('&');
    return paramString ? \`/mock/\${name}?\${paramString}\` : \`/mock/\${name}\`;
  }
  return \`/mock/\${name}\`;
}

// Default export (for imports like \`import route from "ziggy-js"\`)
export default route;

// Export Ziggy configuration
export const Ziggy = {
  // Mock routes configuration
  url: "http://localhost",
  port: null,
  defaults: {},
  routes: {
    "novus.posts.index": { uri: "novus/posts", methods: ["GET"] },
    "novus.posts.create": { uri: "novus/posts/create", methods: ["GET"] },
    "novus.posts.store": { uri: "novus/posts", methods: ["POST"] },
    "novus.posts.update": { uri: "novus/posts/{post}", methods: ["PATCH"] },
    "novus.posts.destroy": { uri: "novus/posts/{post}", methods: ["DELETE"] },
    "novus.media.index": { uri: "novus/media", methods: ["GET"] },
    "novus.subscribers.index": { uri: "novus/subscribers", methods: ["GET"] },
    "novus.auth.logout": { uri: "novus/auth/logout", methods: ["POST"] },
    "novus.performance.index": { uri: "novus/performance", methods: ["GET"] },
  },
};
EOL
echo "Created ziggy-js.ts mock file"

# Create ziggy index.js file with CommonJS compatibility
cat > vendor/tightenco/ziggy/index.js <<EOL
/**
 * Mock implementation for Ziggy in CI environment
 */
const route = function(name, params, absolute) {
  // Basic implementation that returns a mock route URL
  return "/mock/" + name;
};

const Ziggy = {
  url: "http://localhost",
  port: null,
  defaults: {},
  routes: {
    "novus.performance.index": { uri: "novus/performance", methods: ["GET"] },
  }
};

// Support both default and named exports
module.exports = route;
module.exports.default = route;
module.exports.route = route;
module.exports.Ziggy = Ziggy;
EOL
echo "Created Ziggy mock file"

echo "CI environment setup complete!"