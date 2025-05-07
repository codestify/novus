#!/bin/bash
set -e

# Ensure CI environment has proper case-insensitive compatibility
# This script runs in the GitHub Actions environment before the build

echo "Setting up CI environment for case-insensitive compatibility..."

# Create the lowercase hooks directory if it doesn't exist
mkdir -p resources/js/hooks

# Copy all hook files to the lowercase directory
echo "Copying hook files to lowercase directory..."
for file in resources/js/Hooks/*; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    cp "$file" "resources/js/hooks/$filename"
    echo "Copied $filename"
  fi
done

echo "CI environment setup complete!"