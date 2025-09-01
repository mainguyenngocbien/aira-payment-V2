#!/bin/bash

# AIRA Payment Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_DIR="/var/www/aira-payment"
BACKUP_DIR="/var/backups/aira-payment"
LOG_FILE="/var/log/aira-payment/deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
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

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."
    sudo mkdir -p "$PROJECT_DIR"
    sudo mkdir -p "$BACKUP_DIR"
    sudo mkdir -p "/var/log/aira-payment"
    sudo mkdir -p "/var/www/aira-payment/logs"
    sudo chown -R $USER:$USER "$PROJECT_DIR"
    sudo chown -R $USER:$USER "$BACKUP_DIR"
    sudo chown -R $USER:$USER "/var/log/aira-payment"
}

# Backup current deployment
backup_current() {
    if [ -d "$PROJECT_DIR" ] && [ "$(ls -A $PROJECT_DIR)" ]; then
        log "Creating backup of current deployment..."
        BACKUP_NAME="aira-payment-backup-$(date +%Y%m%d-%H%M%S)"
        cp -r "$PROJECT_DIR" "$BACKUP_DIR/$BACKUP_NAME"
        success "Backup created: $BACKUP_DIR/$BACKUP_NAME"
    fi
}

# Pull latest code
pull_code() {
    log "Pulling latest code from repository..."
    cd "$PROJECT_DIR"
    
    if [ ! -d ".git" ]; then
        log "Cloning repository..."
        git clone https://github.com/mainguyenngocbien/aira-payment-V2.git .
    else
        git fetch origin
        git reset --hard origin/main
    fi
    
    success "Code updated successfully"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    # Frontend dependencies
    log "Installing frontend dependencies..."
    npm install --production=false
    
    # Backend dependencies
    log "Installing backend dependencies..."
    cd backend
    npm install --production=false
    cd ..
    
    success "Dependencies installed successfully"
}

# Build applications
build_applications() {
    log "Building applications..."
    
    # Build backend
    log "Building backend..."
    cd backend
    npm run build
    cd ..
    
    # Build frontend
    log "Building frontend..."
    npm run build
    
    success "Applications built successfully"
}

# Setup PM2
setup_pm2() {
    log "Setting up PM2..."
    
    # Install PM2 globally if not installed
    if ! command -v pm2 &> /dev/null; then
        log "Installing PM2..."
        npm install -g pm2
    fi
    
    # Stop existing processes
    pm2 stop all || true
    pm2 delete all || true
    
    # Start applications with PM2
    pm2 start ecosystem.config.js --env "$ENVIRONMENT"
    
    # Save PM2 configuration
    pm2 save
    pm2 startup
    
    success "PM2 setup completed"
}

# Setup environment variables
setup_environment() {
    log "Setting up environment variables..."
    
    if [ ! -f "$PROJECT_DIR/.env" ]; then
        log "Creating environment file..."
        cp "$PROJECT_DIR/env.example" "$PROJECT_DIR/.env"
        warning "Please update .env file with your configuration"
    fi
    
    if [ ! -f "$PROJECT_DIR/backend/.env" ]; then
        log "Creating backend environment file..."
        cp "$PROJECT_DIR/backend/env.example" "$PROJECT_DIR/backend/.env"
        warning "Please update backend/.env file with your configuration"
    fi
}

# Setup SSL (if needed)
setup_ssl() {
    log "Setting up SSL certificates..."
    
    # Check if certbot is installed
    if command -v certbot &> /dev/null; then
        log "Certbot found, setting up SSL..."
        # Add your SSL setup commands here
        # certbot --nginx -d airapayment.olym3.xyz -d apiaira.olym3.xyz
    else
        warning "Certbot not found, SSL setup skipped"
    fi
}

# Setup Nginx (if needed)
setup_nginx() {
    log "Setting up Nginx configuration..."
    
    if command -v nginx &> /dev/null; then
        # Create Nginx configuration
        sudo tee /etc/nginx/sites-available/aira-payment << EOF
server {
    listen 80;
    server_name airapayment.olym3.xyz;
    
    location / {
        proxy_pass http://localhost:7001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}

server {
    listen 80;
    server_name apiaira.olym3.xyz;
    
    location / {
        proxy_pass http://localhost:7003;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
        
        # Enable site
        sudo ln -sf /etc/nginx/sites-available/aira-payment /etc/nginx/sites-enabled/
        sudo nginx -t
        sudo systemctl reload nginx
        
        success "Nginx configuration updated"
    else
        warning "Nginx not found, configuration skipped"
    fi
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Check backend
    if curl -f -s http://localhost:7003/health > /dev/null; then
        success "Backend health check passed"
    else
        error "Backend health check failed"
        return 1
    fi
    
    # Check frontend
    if curl -f -s http://localhost:7001 > /dev/null; then
        success "Frontend health check passed"
    else
        error "Frontend health check failed"
        return 1
    fi
    
    success "All health checks passed"
}

# Main deployment function
main() {
    log "Starting AIRA Payment deployment (Environment: $ENVIRONMENT)"
    
    create_directories
    backup_current
    pull_code
    install_dependencies
    build_applications
    setup_environment
    setup_pm2
    setup_nginx
    setup_ssl
    health_check
    
    success "Deployment completed successfully!"
    log "Applications are running:"
    log "  Frontend: http://localhost:7001"
    log "  Backend: http://localhost:7003"
    log "  PM2 Status: pm2 status"
    log "  PM2 Logs: pm2 logs"
}

# Run main function
main "$@"
