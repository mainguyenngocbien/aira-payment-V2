#!/bin/bash

# Fix Prerender Manifest Script
# This script fixes the missing prerender-manifest.json issue in Next.js 14

set -e

PROJECT_DIR="/home/olym3/aira-payment-V2"
LOG_FILE="/var/log/aira-payment/fix-prerender.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Create log directory
mkdir -p /var/log/aira-payment

log "🔧 Starting prerender manifest fix..."

# Change to project directory
cd "$PROJECT_DIR"

# Check if .next directory exists
if [ ! -d ".next" ]; then
    error "❌ .next directory not found. Please run build first."
    exit 1
fi

# Check if prerender-manifest.json exists
if [ -f ".next/prerender-manifest.json" ]; then
    success "✅ prerender-manifest.json already exists"
    exit 0
fi

log "🔍 Creating prerender-manifest.json..."

# Create a proper prerender-manifest.json for Next.js 14
cat > .next/prerender-manifest.json << 'EOF'
{
  "version": 4,
  "routes": {
    "/": {
      "initialRevalidateSeconds": false,
      "srcRoute": null,
      "dataRoute": null
    },
    "/dashboard": {
      "initialRevalidateSeconds": false,
      "srcRoute": null,
      "dataRoute": null
    },
    "/verify-email": {
      "initialRevalidateSeconds": false,
      "srcRoute": null,
      "dataRoute": null
    },
    "/test": {
      "initialRevalidateSeconds": false,
      "srcRoute": null,
      "dataRoute": null
    },
    "/receive/aptos": {
      "initialRevalidateSeconds": false,
      "srcRoute": null,
      "dataRoute": null
    },
    "/receive/celestia": {
      "initialRevalidateSeconds": false,
      "srcRoute": null,
      "dataRoute": null
    },
    "/receive/on-chain": {
      "initialRevalidateSeconds": false,
      "srcRoute": null,
      "dataRoute": null
    },
    "/receive/solana": {
      "initialRevalidateSeconds": false,
      "srcRoute": null,
      "dataRoute": null
    },
    "/receive/sui": {
      "initialRevalidateSeconds": false,
      "srcRoute": null,
      "dataRoute": null
    },
    "/receive/system": {
      "initialRevalidateSeconds": false,
      "srcRoute": null,
      "dataRoute": null
    }
  },
  "dynamicRoutes": {},
  "notFoundRoutes": [],
  "preview": {
    "previewModeId": "development"
  }
}
EOF

success "✅ prerender-manifest.json created successfully"

# Set proper permissions
chmod 644 .next/prerender-manifest.json

# Verify the file was created
if [ -f ".next/prerender-manifest.json" ]; then
    success "✅ prerender-manifest.json verified"
    log "📄 File size: $(ls -lh .next/prerender-manifest.json | awk '{print $5}')"
else
    error "❌ Failed to create prerender-manifest.json"
    exit 1
fi

log "🎉 Prerender manifest fix completed!"
