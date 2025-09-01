#!/bin/bash

# Safe Start Script for AIRA Payment
# This script checks build artifacts before starting the application

set -e

PROJECT_DIR="/home/olym3/aira-payment-V2"
LOG_FILE="/var/log/aira-payment/start.log"

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

log "🚀 Starting AIRA Payment application..."

# Change to project directory
cd "$PROJECT_DIR"

# Check if build artifacts exist
log "🔍 Checking build artifacts..."

required_files=(
    ".next/prerender-manifest.json"
    ".next/BUILD_ID"
    ".next/build-manifest.json"
    ".next/routes-manifest.json"
    "backend/dist/index.js"
)

missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
        error "❌ Missing: $file"
    else
        success "✅ Found: $file"
    fi
done

# If missing files, run fix build
if [ ${#missing_files[@]} -gt 0 ]; then
    warning "⚠️ Missing build artifacts detected"
    log "🔧 Running build fix..."
    
    if [ -f "scripts/fix-build.sh" ]; then
        bash scripts/fix-build.sh
    else
        error "❌ fix-build.sh not found"
        log "🔄 Running manual build..."
        npm run build:full
    fi
fi

# Check environment file
if [ ! -f ".env.local" ]; then
    warning "⚠️ .env.local not found, creating default..."
    cat > .env.local << 'EOF'
# Production Environment Variables
NEXT_PUBLIC_API_BASE_URL=https://apiaira.olym3.xyz:7003/api/v1
NEXT_PUBLIC_FRONTEND_URL=https://airapayment.olym3.xyz
NODE_ENV=production
EOF
    warning "Created .env.local - please update with your actual values"
fi

# Check if ports are available
log "🔍 Checking port availability..."

check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        error "❌ Port $port is already in use"
        return 1
    else
        success "✅ Port $port is available"
        return 0
    fi
}

if ! check_port 7001; then
    log "🔄 Killing processes on port 7001..."
    lsof -ti:7001 | xargs kill -9 2>/dev/null || true
fi

if ! check_port 7003; then
    log "🔄 Killing processes on port 7003..."
    lsof -ti:7003 | xargs kill -9 2>/dev/null || true
fi

# Start the application
log "🚀 Starting application..."

# Use PM2 if available, otherwise use npm
if command -v pm2 &> /dev/null; then
    log "📦 Using PM2 to start application..."
    
    # Stop existing processes
    pm2 stop all 2>/dev/null || true
    pm2 delete all 2>/dev/null || true
    
    # Start with PM2
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js --env production
        success "✅ Application started with PM2"
        log "📊 PM2 Status:"
        pm2 status
    else
        warning "⚠️ ecosystem.config.js not found, using npm start"
        npm run start:full
    fi
else
    log "📦 Using npm to start application..."
    npm run start:full
fi

success "🎉 Application started successfully!"

log "📋 Application URLs:"
log "  Frontend: http://localhost:7001"
log "  Backend: http://localhost:7003"
log "  Health Check: http://localhost:7003/health"

log "📊 Monitoring:"
log "  PM2 Status: pm2 status"
log "  PM2 Logs: pm2 logs"
log "  PM2 Monitor: pm2 monit"
