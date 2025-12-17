#!/bin/bash

################################################################################
# Appian Data Update Script
#
# This script automatically copies and validates function data from the
# appian-docs-scraper project to this extension project.
#
# ELI5: This script is like a smart copy machine that:
#       1. Finds the files you need
#       2. Copies them to the right place
#       3. Checks they copied correctly
#       4. Tells you if anything went wrong
#
# Usage:
#   ./scripts/update-from-docscraper.sh
#   ./scripts/update-from-docscraper.sh --source /path/to/scraper
#   ./scripts/update-from-docscraper.sh --check-only
#   ./scripts/update-from-docscraper.sh --help
################################################################################

set -e  # Exit on any error

# Colors for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory and paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="$SCRIPT_DIR/config.json"

# Files to copy
FILES_TO_COPY=(
  "appian-functions-complete.json"
  "appian-functions-docs.json"
)

################################################################################
# Helper Functions
################################################################################

print_header() {
  echo -e "${BLUE}================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}================================${NC}"
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

show_help() {
  cat << EOF
${BLUE}Appian Data Update Script${NC}

${GREEN}What does this script do?${NC}
This script copies the Appian function data files from the scraper project
to this extension project and validates them.

Think of it like a smart delivery service:
  📦 It picks up the files from the scraper
  🚚 Delivers them to the extension
  ✓ Checks they arrived safely and intact

${GREEN}Usage:${NC}
  ./scripts/update-from-docscraper.sh [OPTIONS]

${GREEN}Options:${NC}
  --source PATH       Override source directory (where scraper files are)
  --dest PATH         Override destination directory (where to copy files)
  --check-only        Only validate files, don't copy
  --rebuild           Also rebuild the .vsix after copying
  --help              Show this help message

${GREEN}Examples:${NC}
  # Normal use (uses config.json paths)
  ./scripts/update-from-docscraper.sh

  # One-time override of source path
  ./scripts/update-from-docscraper.sh --source ~/Downloads/docScraper

  # Just check if current files are valid
  ./scripts/update-from-docscraper.sh --check-only

  # Copy AND rebuild the extension
  ./scripts/update-from-docscraper.sh --rebuild

${GREEN}First Time Setup:${NC}
If config.json doesn't exist, the script will:
  1. Ask where your docScraper folder is
  2. Save that location for next time
  3. You only need to do this once!

${GREEN}Configuration:${NC}
Config file location: scripts/config.json
Example config file:  scripts/config.json.example

To change paths later, either:
  - Edit scripts/config.json directly
  - Delete it and run the script again (it will re-prompt)
  - Use --source flag to override temporarily
EOF
}

setup_config() {
  print_header "First Time Setup"

  echo ""
  echo "This script needs to know where your appian-docs-scraper folder is."
  echo ""
  echo -e "${YELLOW}ELI5: Where did you put the scraper project?${NC}"
  echo ""

  # Try to find it automatically
  print_info "Searching for appian-docs-scraper..."
  FOUND_PATHS=$(find ~ -maxdepth 3 -name "docScraper" -o -name "appian-docs-scraper" 2>/dev/null | head -5)

  if [ -n "$FOUND_PATHS" ]; then
    echo ""
    echo "Found these possible locations:"
    echo "$FOUND_PATHS" | nl
    echo ""
    echo "Enter the number of the correct path, or type a custom path:"
  else
    echo ""
    echo "Couldn't auto-detect. Please enter the full path:"
  fi

  read -r USER_INPUT

  # If user entered a number, use that line from found paths
  if [[ "$USER_INPUT" =~ ^[0-9]+$ ]]; then
    SCRAPER_PATH=$(echo "$FOUND_PATHS" | sed -n "${USER_INPUT}p")
  else
    SCRAPER_PATH="$USER_INPUT"
  fi

  # Validate the path
  if [ ! -d "$SCRAPER_PATH" ]; then
    print_error "Directory doesn't exist: $SCRAPER_PATH"
    exit 1
  fi

  if [ ! -f "$SCRAPER_PATH/appian-functions-complete.json" ]; then
    print_error "This doesn't look like the scraper directory (missing appian-functions-complete.json)"
    echo ""
    echo "Make sure you:"
    echo "  1. Have already run the scraper scripts"
    echo "  2. The JSON files were generated"
    exit 1
  fi

  # Create config
  cat > "$CONFIG_FILE" << EOF
{
  "docScraperPath": "$SCRAPER_PATH",
  "extensionDataPath": "$PROJECT_ROOT/unpacked-extension/extension"
}
EOF

  print_success "Configuration saved to $CONFIG_FILE"
  echo ""
  SOURCE_DIR="$SCRAPER_PATH"
  DEST_DIR="$PROJECT_ROOT/unpacked-extension/extension"
}

load_config() {
  if [ ! -f "$CONFIG_FILE" ]; then
    setup_config
    return
  fi

  # Read config using Python (more reliable than jq which might not be installed)
  SOURCE_DIR=$(python3 -c "import json; print(json.load(open('$CONFIG_FILE'))['docScraperPath'])" 2>/dev/null || echo "")
  DEST_DIR=$(python3 -c "import json; print(json.load(open('$CONFIG_FILE'))['extensionDataPath'])" 2>/dev/null || echo "")

  if [ -z "$SOURCE_DIR" ] || [ -z "$DEST_DIR" ]; then
    print_error "Config file is invalid or unreadable"
    echo ""
    echo "Try deleting $CONFIG_FILE and running the script again"
    exit 1
  fi
}

validate_json_file() {
  local file="$1"
  local filepath="$2"

  # Check file exists
  if [ ! -f "$filepath" ]; then
    print_error "$file: File not found"
    return 1
  fi

  # Check file size (should be at least 100KB)
  local size=$(stat -f%z "$filepath" 2>/dev/null || stat -c%s "$filepath" 2>/dev/null)
  if [ "$size" -lt 102400 ]; then
    print_warning "$file: File is suspiciously small (${size} bytes)"
  fi

  # Validate JSON syntax
  if ! python3 -c "import json; json.load(open('$filepath'))" 2>/dev/null; then
    print_error "$file: Invalid JSON syntax"
    return 1
  fi

  # Check for error indicators
  if grep -qi "error\|failed" "$filepath"; then
    print_warning "$file: Contains 'error' or 'failed' text (check manually)"
  fi

  # For functions-complete, count functions
  if [[ "$file" == *"complete"* ]]; then
    local count=$(grep -c '"Appian ' "$filepath" || echo "0")
    if [ "$count" -lt 700 ]; then
      print_warning "$file: Only $count functions found (expected ~713+)"
    else
      print_info "$file: $count functions found"
    fi
  fi

  print_success "$file: Valid"
  return 0
}

copy_and_validate() {
  print_header "Copying Files"

  local errors=0

  for file in "${FILES_TO_COPY[@]}"; do
    echo ""
    print_info "Processing: $file"

    local src="$SOURCE_DIR/$file"
    local dest="$DEST_DIR/$file"

    # Validate source file first
    if ! validate_json_file "$file" "$src"; then
      errors=$((errors + 1))
      continue
    fi

    # Copy file
    if cp "$src" "$dest"; then
      print_success "Copied to: $dest"

      # Validate destination
      if ! validate_json_file "$file" "$dest"; then
        errors=$((errors + 1))
      fi
    else
      print_error "Failed to copy $file"
      errors=$((errors + 1))
    fi
  done

  return $errors
}

check_only() {
  print_header "Validation Check Only"

  local errors=0

  for file in "${FILES_TO_COPY[@]}"; do
    echo ""
    local filepath="$DEST_DIR/$file"
    if ! validate_json_file "$file" "$filepath"; then
      errors=$((errors + 1))
    fi
  done

  return $errors
}

rebuild_extension() {
  print_header "Rebuilding Extension"

  cd "$DEST_DIR"

  if command -v vsce &> /dev/null; then
    print_info "Running: vsce package --no-dependencies"
    if vsce package --no-dependencies; then
      print_success "Extension rebuilt successfully"
      print_info "VSIX location: $DEST_DIR/*.vsix"
    else
      print_error "Build failed"
      return 1
    fi
  else
    print_error "vsce not found. Install with: npm install -g @vscode/vsce"
    return 1
  fi
}

################################################################################
# Main Script
################################################################################

# Parse command line arguments
CHECK_ONLY=false
REBUILD=false
OVERRIDE_SOURCE=""
OVERRIDE_DEST=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --help)
      show_help
      exit 0
      ;;
    --check-only)
      CHECK_ONLY=true
      shift
      ;;
    --rebuild)
      REBUILD=true
      shift
      ;;
    --source)
      OVERRIDE_SOURCE="$2"
      shift 2
      ;;
    --dest)
      OVERRIDE_DEST="$2"
      shift 2
      ;;
    *)
      print_error "Unknown option: $1"
      echo ""
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Load configuration
load_config

# Apply overrides
if [ -n "$OVERRIDE_SOURCE" ]; then
  SOURCE_DIR="$OVERRIDE_SOURCE"
  print_info "Using override source: $SOURCE_DIR"
fi

if [ -n "$OVERRIDE_DEST" ]; then
  DEST_DIR="$OVERRIDE_DEST"
  print_info "Using override destination: $DEST_DIR"
fi

# Verify directories exist
if [ ! -d "$SOURCE_DIR" ]; then
  print_error "Source directory not found: $SOURCE_DIR"
  echo ""
  echo "Update your config: $CONFIG_FILE"
  exit 1
fi

if [ ! -d "$DEST_DIR" ]; then
  print_error "Destination directory not found: $DEST_DIR"
  exit 1
fi

# Show paths
echo ""
print_info "Source: $SOURCE_DIR"
print_info "Destination: $DEST_DIR"
echo ""

# Execute
if [ "$CHECK_ONLY" = true ]; then
  if check_only; then
    print_header "✓ All Checks Passed"
    exit 0
  else
    print_header "✗ Validation Failed"
    exit 1
  fi
else
  if copy_and_validate; then
    echo ""
    print_header "✓ Update Complete"

    if [ "$REBUILD" = true ]; then
      echo ""
      rebuild_extension
    else
      echo ""
      print_info "Next step: Rebuild the extension"
      echo "  cd $DEST_DIR"
      echo "  vsce package --no-dependencies"
      echo ""
      print_info "Or run this script with --rebuild flag"
    fi

    exit 0
  else
    echo ""
    print_header "✗ Update Failed"
    echo ""
    print_error "Some files had errors (see above)"
    exit 1
  fi
fi
