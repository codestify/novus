#!/bin/bash

# update-hooks-imports.sh
# Purpose: Safely update all references from "@novus/Hooks" to "@novus/hooks" in TypeScript files
# Author: Claude
# Date: 2025-07-05

set -e          # Exit immediately if a command exits with a non-zero status
set -u          # Treat unset variables as an error
set -o pipefail # Exit if any command in a pipeline fails

# Print script banner
echo "============================================================="
echo "  NOVUS IMPORT PATH UPDATE SCRIPT"
echo "  Changing @novus/Hooks/ to @novus/hooks/ while preserving case"
echo "============================================================="

# Set project directory - adjust if needed
PROJECT_DIR="$(pwd)"
BACKUP_DIR="${PROJECT_DIR}/import-updates-backup-$(date +%Y%m%d_%H%M%S)"
LOG_FILE="${PROJECT_DIR}/import-updates.log"

# Initialize log file
echo "Starting import path updates at $(date)" > "${LOG_FILE}"

# Create backup directory
echo "Creating backup directory: ${BACKUP_DIR}"
mkdir -p "${BACKUP_DIR}"

# Function to print and log messages
log() {
  echo "$1"
  echo "$(date +"%Y-%m-%d %H:%M:%S") - $1" >> "${LOG_FILE}"
}

# Find all TypeScript and TSX files
log "Finding all TypeScript and TSX files..."
TS_FILES=$(find "${PROJECT_DIR}" -type f -name "*.ts" -o -name "*.tsx" | grep -v "node_modules" | grep -v "dist" | grep -v "build")

# Count total matches before making changes
MATCH_COUNT=0
for file in ${TS_FILES}; do
  if grep -q "@novus/Hooks" "${file}"; then
    MATCH_COUNT=$((MATCH_COUNT + $(grep -c "@novus/Hooks" "${file}")))
  fi
done

log "Found ${MATCH_COUNT} occurrences of '@novus/Hooks' across the project."

if [ $MATCH_COUNT -eq 0 ]; then
  log "No matches found, nothing to update."
  exit 0
fi

# Confirmation prompt
echo 
echo "This script will update ${MATCH_COUNT} references from @novus/Hooks to @novus/hooks."
echo "All affected files will be backed up to: ${BACKUP_DIR}"
echo 
read -p "Do you want to proceed? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  log "Operation cancelled by user."
  exit 1
fi

# Process each TypeScript file
UPDATED_COUNT=0
UPDATED_FILES=0

for file in ${TS_FILES}; do
  # Check if file contains the pattern we want to replace
  if grep -q "@novus/Hooks" "${file}"; then
    # Get relative path for backup
    rel_path="${file#$PROJECT_DIR/}"
    backup_file_dir="${BACKUP_DIR}/$(dirname "${rel_path}")"
    
    # Create backup directory structure if it doesn't exist
    mkdir -p "${backup_file_dir}"
    
    # Create backup of original file
    cp "${file}" "${BACKUP_DIR}/${rel_path}"
    
    # Count occurrences in this file
    file_matches=$(grep -c "@novus/Hooks" "${file}")
    
    # Perform the replacement - preserve case after the slash
    # This sed command looks for @novus/Hooks/ and replaces only the H with h
    sed -i.bak 's/@novus\/Hooks\//@novus\/hooks\//g' "${file}"
    
    # Remove temporary .bak files created by sed
    rm "${file}.bak"
    
    UPDATED_COUNT=$((UPDATED_COUNT + file_matches))
    UPDATED_FILES=$((UPDATED_FILES + 1))
    
    log "Updated ${file_matches} occurrences in ${file}"
  fi
done

log "Summary: Updated ${UPDATED_COUNT} occurrences across ${UPDATED_FILES} files."
log "All original files were backed up to: ${BACKUP_DIR}"

# Instructions for verifying and restoring if needed
cat << EOF

============================================================
                      UPDATE COMPLETE
============================================================
${UPDATED_COUNT} occurrences of '@novus/Hooks/' were updated to '@novus/hooks/'
across ${UPDATED_FILES} files.

The changes have been logged to: ${LOG_FILE}
All original files were backed up to: ${BACKUP_DIR}

To verify the changes:
  git diff

If you need to restore from backup:
  cp -R ${BACKUP_DIR}/* ${PROJECT_DIR}/

EOF

exit 0