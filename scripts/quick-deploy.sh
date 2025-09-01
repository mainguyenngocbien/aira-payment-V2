#!/bin/bash

# Quick Deploy Script for AIRA Payment
# This script performs a quick deployment without full setup

set -e

PROJECT_DIR="/var/www/aira-payment"
LOG_FILE="/var/log/aira-payment/quick-deploy.log"

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

# Quick deployment function
quick_deploy() {
    log "Starting quick deployment..."
    
    cd "$PROJECT_DIR"
    
    # Pull latest code
    log "Pulling latest code..."
    git pull origin main
    
    # Install dependencies if package.json changed
    if git diff HEAD~1 HEAD --name-only | grep -q "package.json"; then
        log "Package.json changed, installing dependencies..."
        npm install
        cd backend && npm install && cd ..
    fi
    
    # Build applications
    log "Building applications..."
    cd backend && npm run build && cd ..
    npm run build
    
    # Restart PM2 processes
    log "Restarting PM2 processes..."
    pm2 restart aira-backend
    pm2 restart aira-frontend
    
    # Health check
    log "Performing health check..."
    sleep 5
    
    if curl -f -s http://localhost:7003/health > /dev/null; then
        success "Backend health check passed"
    else
        error "Backend health check failed"
        exit 1
    fi
    
    if curl -f -s http://localhost:7001 > /dev/null; then
        success "Frontend health check passed"
    else
        error "Frontend health check failed"
        exit 1
    fi
    
    success "Quick deployment completed successfully!"
}

# Run quick deployment
quick_deploy "$@"
