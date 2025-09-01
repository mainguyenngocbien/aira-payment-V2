#!/bin/bash

# Fix Build Issues Script for GCP
# This script fixes common build and start issues

set -e

PROJECT_DIR="/home/olym3/aira-payment-V2"
LOG_FILE="/var/log/aira-payment/fix-build.log"

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

log "🔧 Starting build fix process..."

# Change to project directory
cd "$PROJECT_DIR"

# 1. Clean everything
log "🧹 Cleaning build artifacts..."
rm -rf .next
rm -rf backend/dist
rm -rf node_modules/.cache
rm -rf .npm

# 2. Reinstall dependencies
log "📦 Reinstalling dependencies..."
npm ci --production=false

# 3. Build backend
log "🔨 Building backend..."
cd backend
npm ci --production=false
npm run build
cd ..

# 4. Build frontend
log "🔨 Building frontend..."
npm run build

# 5. Verify build artifacts
log "✅ Verifying build artifacts..."

# Check if prerender-manifest.json exists
if [ -f ".next/prerender-manifest.json" ]; then
    success "prerender-manifest.json exists"
else
    error "prerender-manifest.json missing"
    # Run the prerender fix script
    if [ -f "scripts/fix-prerender.sh" ]; then
        log "Running prerender fix script..."
        bash scripts/fix-prerender.sh
    else
        warning "fix-prerender.sh not found, creating minimal manifest"
        cat > .next/prerender-manifest.json << 'EOF'
{
  "version": 4,
  "routes": {},
  "dynamicRoutes": {},
  "notFoundRoutes": [],
  "preview": {
    "previewModeId": "development"
  }
}
EOF
    fi
fi

# Check other required files
required_files=(
    ".next/BUILD_ID"
    ".next/build-manifest.json"
    ".next/routes-manifest.json"
    "backend/dist/index.js"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        success "✅ $file exists"
    else
        error "❌ $file missing"
    fi
done

# 6. Set proper permissions
log "🔐 Setting proper permissions..."
chmod -R 755 .next
chmod -R 755 backend/dist

# 7. Create production environment file if not exists
if [ ! -f ".env.local" ]; then
    log "📝 Creating production environment file..."
    cat > .env.local << 'EOF'
# Production Environment Variables
NEXT_PUBLIC_API_BASE_URL=https://apiaira.olym3.xyz:7003/api/v1
NEXT_PUBLIC_FRONTEND_URL=https://airapayment.olym3.xyz
NODE_ENV=production
EOF
    warning "Created .env.local - please update with your actual values"
fi

# 8. Test build
log "🧪 Testing build..."
if npm run build > /dev/null 2>&1; then
    success "Build test passed"
else
    error "Build test failed"
    exit 1
fi

success "🎉 Build fix completed successfully!"

log "📋 Next steps:"
log "1. Update .env.local with your actual environment variables"
log "2. Run: npm run start:full"
log "3. Or use PM2: npm run pm2:start"
