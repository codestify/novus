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

# Setup a mock ziggy-js directory for CI
echo "Setting up mock Ziggy for CI environment..."
if [ ! -d "vendor/tightenco/ziggy" ]; then
  mkdir -p vendor/tightenco/ziggy
  echo "Created vendor/tightenco/ziggy directory"
fi

# Create a basic mock file for Ziggy
if [ -d "resources/js/__mocks__" ]; then
  cat > vendor/tightenco/ziggy/index.js <<EOL
/**
 * Mock implementation for Ziggy in CI environment
 */
module.exports = require("../../resources/js/__mocks__/ziggy-js.ts");
EOL
  echo "Created Ziggy mock file"
else
  # Create the minimal mock for Ziggy
  cat > vendor/tightenco/ziggy/index.js <<EOL
/**
 * Mock implementation for Ziggy in CI environment
 */
module.exports = {
  default: function(name, params, absolute) {
    return "/mock/" + name;
  },
  Ziggy: {
    url: "http://localhost",
    port: null,
    defaults: {},
    routes: {}
  }
};
EOL
  echo "Created minimal Ziggy mock file"
fi

echo "CI environment setup complete!"