# AIRA Payment - Auto-Deployment Guide

Hướng dẫn thiết lập cơ chế auto-build và deployment cho AIRA Payment trên GCP với PM2.

## 🚀 Quick Start

### 1. Initial Setup trên GCP Server

```bash
# Clone repository
git clone https://github.com/mainguyenngocbien/aira-payment-V2.git
cd aira-payment-V2

# Install dependencies
npm install
cd backend && npm install && cd ..

# Make scripts executable
chmod +x scripts/*.sh

# Run initial deployment
npm run deploy
```

### 2. Start PM2 Services

```bash
# Start all services
npm run pm2:start

# Check status
npm run pm2:status

# View logs
npm run pm2:logs
```

## 📋 PM2 Configuration

### Ecosystem File: `ecosystem.config.js`

- **aira-backend**: Backend API server (port 7003)
- **aira-frontend**: Frontend Next.js server (port 7001)  
- **aira-watcher**: Auto-build watcher for file changes

### PM2 Commands

```bash
# Start services
npm run pm2:start

# Stop all services
npm run pm2:stop

# Restart all services
npm run pm2:restart

# Reload (zero-downtime)
npm run pm2:reload

# Delete all services
npm run pm2:delete

# View status
npm run pm2:status

# View logs
npm run pm2:logs

# Monitor dashboard
npm run pm2:monitor
```

## 🔄 Auto-Build Mechanism

### File Watcher: `scripts/auto-build-watcher.js`

Tự động build và restart khi có thay đổi file:

**Watched Files:**
- Backend: `backend/src/**/*.ts`, `backend/package.json`
- Frontend: `app/**/*.tsx`, `components/**/*.tsx`, `lib/**/*.ts`

**Features:**
- ✅ Build cooldown (5 seconds)
- ✅ Build queue system
- ✅ Automatic PM2 restart
- ✅ Comprehensive logging
- ✅ Error handling

### Start Auto-Build Watcher

```bash
# Start watcher manually
npm run watcher

# Or start with PM2 (recommended)
pm2 start ecosystem.config.js --only aira-watcher
```

## 🚀 Deployment Options

### 1. Full Deployment

```bash
npm run deploy
```

**What it does:**
- Creates backup of current deployment
- Pulls latest code from Git
- Installs dependencies
- Builds applications
- Sets up PM2
- Configures Nginx
- Performs health checks

### 2. Quick Deployment

```bash
npm run deploy:quick
```

**What it does:**
- Pulls latest code
- Installs dependencies (if package.json changed)
- Builds applications
- Restarts PM2 processes
- Performs health checks

### 3. Manual Deployment Steps

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install
cd backend && npm install && cd ..

# Build applications
npm run build:full

# Restart services
npm run pm2:restart
```

## 🔧 Git Hooks Setup

### Auto-Deploy on Push

```bash
# Setup Git hooks
npm run setup:hooks
```

**Hooks Created:**
- `post-receive`: Auto-deploy when code is pushed
- `pre-push`: Run tests and linting before push

### Webhook Alternative

```bash
# Start webhook server
node scripts/webhook-server.js
```

**GitHub Webhook URL:** `http://your-server:3001/webhook/github`

## 📊 Monitoring

### Health Monitoring: `scripts/monitor.js`

```bash
# Start monitoring
npm run monitor
```

**Monitors:**
- ✅ PM2 process status
- ✅ Backend health (port 7003)
- ✅ Frontend health (port 7001)
- ✅ Disk space usage
- ✅ Memory usage
- ✅ Auto-restart failed services

### Manual Health Checks

```bash
# Check backend
curl http://localhost:7003/health

# Check frontend
curl http://localhost:7001

# Check PM2 status
pm2 status
```

## 🌐 Nginx Configuration

### Auto-Generated Config

The deployment script automatically creates Nginx configuration:

```nginx
# Frontend (airapayment.olym3.xyz)
server {
    listen 80;
    server_name airapayment.olym3.xyz;
    location / {
        proxy_pass http://localhost:7001;
        # ... proxy headers
    }
}

# Backend API (apiaira.olym3.xyz)
server {
    listen 80;
    server_name apiaira.olym3.xyz;
    location / {
        proxy_pass http://localhost:7003;
        # ... proxy headers
    }
}
```

## 📁 Directory Structure

```
/var/www/aira-payment/
├── app/                    # Next.js frontend
├── backend/               # Express.js backend
├── components/            # React components
├── scripts/               # Deployment scripts
│   ├── deploy.sh         # Full deployment
│   ├── quick-deploy.sh   # Quick deployment
│   ├── auto-build-watcher.js  # File watcher
│   ├── monitor.js        # Health monitoring
│   └── setup-git-hooks.sh # Git hooks setup
├── logs/                  # Application logs
├── ecosystem.config.js   # PM2 configuration
└── package.json          # Dependencies & scripts
```

## 🔐 Environment Variables

### Frontend (.env)
```env
NEXT_PUBLIC_API_BASE_URL=https://apiaira.olym3.xyz:7003/api/v1
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=airapayment.olym3.xyz
# ... other Firebase config
```

### Backend (.env)
```env
PORT=7003
NODE_ENV=production
FRONTEND_URL=https://airapayment.olym3.xyz
# ... other config
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check port usage
   lsof -i :7001
   lsof -i :7003
   
   # Kill processes
   kill -9 <PID>
   ```

2. **PM2 issues**
   ```bash
   # Reset PM2
   pm2 kill
   pm2 start ecosystem.config.js
   ```

3. **Build failures**
   ```bash
   # Check logs
   pm2 logs aira-backend
   pm2 logs aira-frontend
   
   # Manual build
   npm run build:full
   ```

4. **Permission issues**
   ```bash
   # Fix permissions
   chmod +x scripts/*.sh
   sudo chown -R $USER:$USER /var/www/aira-payment
   ```

### Log Files

- **PM2 Logs**: `pm2 logs`
- **Application Logs**: `/var/www/aira-payment/logs/`
- **Deployment Logs**: `/var/log/aira-payment/deploy.log`
- **Monitor Logs**: `/var/www/aira-payment/logs/monitor.log`

## 🔄 Workflow

### Development Workflow

1. **Local Development**
   ```bash
   npm run dev:full
   ```

2. **Commit & Push**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

3. **Auto-Deploy** (if hooks setup)
   - Git hook triggers deployment
   - Or manual: `npm run deploy:quick`

### Production Workflow

1. **Initial Setup**
   ```bash
   npm run deploy
   ```

2. **Updates**
   ```bash
   npm run deploy:quick
   ```

3. **Monitoring**
   ```bash
   npm run monitor
   pm2 monit
   ```

## 📞 Support

- **PM2 Documentation**: https://pm2.keymetrics.io/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Nginx Configuration**: https://nginx.org/en/docs/

---

**Happy Deploying! 🚀**
