#!/bin/bash

# Setup Git Hooks for Auto-Deployment
# This script sets up Git hooks to automatically deploy when code is pushed

set -e

PROJECT_DIR="/var/www/aira-payment"
HOOKS_DIR="$PROJECT_DIR/.git/hooks"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Create post-receive hook
create_post_receive_hook() {
    log "Creating post-receive hook..."
    
    cat > "$HOOKS_DIR/post-receive" << 'EOF'
#!/bin/bash

# Post-receive hook for auto-deployment
PROJECT_DIR="/var/www/aira-payment"
LOG_FILE="/var/log/aira-payment/git-hook.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Git push received, starting auto-deployment..."

# Change to project directory
cd "$PROJECT_DIR"

# Pull latest changes
git pull origin main

# Run quick deployment
bash scripts/quick-deploy.sh

log "Auto-deployment completed"
EOF

    chmod +x "$HOOKS_DIR/post-receive"
    success "Post-receive hook created"
}

# Create pre-push hook (for local development)
create_pre_push_hook() {
    log "Creating pre-push hook..."
    
    cat > ".git/hooks/pre-push" << 'EOF'
#!/bin/bash

# Pre-push hook for local development
echo "Running pre-push checks..."

# Run tests if they exist
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    echo "Running tests..."
    npm test
fi

# Run linting
if [ -f "package.json" ] && grep -q '"lint"' package.json; then
    echo "Running linter..."
    npm run lint
fi

echo "Pre-push checks completed"
EOF

    chmod +x ".git/hooks/pre-push"
    success "Pre-push hook created"
}

# Setup webhook endpoint (alternative to Git hooks)
create_webhook_endpoint() {
    log "Creating webhook endpoint..."
    
    cat > "scripts/webhook-server.js" << 'EOF'
const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');

const app = express();
const PORT = 3001;
const SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret';

app.use(express.json());

// GitHub webhook endpoint
app.post('/webhook/github', (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);
    const expectedSignature = 'sha256=' + crypto
        .createHmac('sha256', SECRET)
        .update(payload)
        .digest('hex');

    if (signature !== expectedSignature) {
        console.log('Invalid signature');
        return res.status(401).send('Unauthorized');
    }

    if (req.body.ref === 'refs/heads/main') {
        console.log('Main branch updated, triggering deployment...');
        
        exec('bash scripts/quick-deploy.sh', (error, stdout, stderr) => {
            if (error) {
                console.error('Deployment failed:', error);
                return res.status(500).send('Deployment failed');
            }
            console.log('Deployment completed successfully');
            res.status(200).send('Deployment triggered');
        });
    } else {
        res.status(200).send('No deployment needed');
    }
});

app.listen(PORT, () => {
    console.log(`Webhook server running on port ${PORT}`);
});
EOF

    success "Webhook endpoint created"
}

# Main setup function
main() {
    log "Setting up Git hooks for auto-deployment..."
    
    if [ -d "$PROJECT_DIR/.git" ]; then
        create_post_receive_hook
        create_pre_push_hook
        create_webhook_endpoint
        success "Git hooks setup completed!"
    else
        error "Not a Git repository"
        exit 1
    fi
}

# Run main function
main "$@"
