#!/usr/bin/env node

const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class AutoBuildWatcher {
  constructor() {
    this.isBuilding = false;
    this.buildQueue = [];
    this.lastBuildTime = 0;
    this.buildCooldown = 5000; // 5 seconds cooldown between builds
    
    // Create logs directory if it doesn't exist
    this.ensureLogsDirectory();
    
    this.log('🚀 Auto-Build Watcher started');
    this.setupWatchers();
  }

  ensureLogsDirectory() {
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
    
    // Also write to log file
    const logFile = path.join(process.cwd(), 'logs', 'watcher.log');
    fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
  }

  setupWatchers() {
    // Watch backend source files
    const backendWatcher = chokidar.watch([
      'backend/src/**/*.ts',
      'backend/src/**/*.js',
      'backend/package.json',
      'backend/tsconfig.json'
    ], {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true
    });

    // Watch frontend source files
    const frontendWatcher = chokidar.watch([
      'app/**/*.tsx',
      'app/**/*.ts',
      'components/**/*.tsx',
      'components/**/*.ts',
      'lib/**/*.ts',
      'hooks/**/*.ts',
      'package.json',
      'next.config.js',
      'tailwind.config.js'
    ], {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true
    });

    backendWatcher.on('change', (filePath) => {
      this.log(`📝 Backend file changed: ${filePath}`);
      this.queueBuild('backend');
    });

    frontendWatcher.on('change', (filePath) => {
      this.log(`📝 Frontend file changed: ${filePath}`);
      this.queueBuild('frontend');
    });

    this.log('👀 Watching for file changes...');
  }

  queueBuild(type) {
    const now = Date.now();
    
    // Check cooldown
    if (now - this.lastBuildTime < this.buildCooldown) {
      this.log(`⏳ Build cooldown active, queuing ${type} build...`);
      this.buildQueue.push(type);
      return;
    }

    this.executeBuild(type);
  }

  async executeBuild(type) {
    if (this.isBuilding) {
      this.log(`⏳ Build in progress, queuing ${type} build...`);
      this.buildQueue.push(type);
      return;
    }

    this.isBuilding = true;
    this.lastBuildTime = Date.now();

    try {
      this.log(`🔨 Starting ${type} build...`);
      
      if (type === 'backend') {
        await this.buildBackend();
        await this.restartBackend();
      } else if (type === 'frontend') {
        await this.buildFrontend();
        await this.restartFrontend();
      }

      this.log(`✅ ${type} build completed successfully`);
      
      // Process queued builds
      if (this.buildQueue.length > 0) {
        const nextType = this.buildQueue.shift();
        setTimeout(() => {
          this.executeBuild(nextType);
        }, 2000); // 2 second delay between builds
      }
      
    } catch (error) {
      this.log(`❌ ${type} build failed: ${error.message}`);
    } finally {
      this.isBuilding = false;
    }
  }

  async buildBackend() {
    return new Promise((resolve, reject) => {
      this.log('🔨 Building backend...');
      
      exec('cd backend && npm run build', (error, stdout, stderr) => {
        if (error) {
          this.log(`❌ Backend build error: ${error.message}`);
          reject(error);
          return;
        }
        
        if (stderr) {
          this.log(`⚠️ Backend build warnings: ${stderr}`);
        }
        
        this.log('✅ Backend build completed');
        resolve();
      });
    });
  }

  async buildFrontend() {
    return new Promise((resolve, reject) => {
      this.log('🔨 Building frontend...');
      
      exec('npm run build', (error, stdout, stderr) => {
        if (error) {
          this.log(`❌ Frontend build error: ${error.message}`);
          reject(error);
          return;
        }
        
        if (stderr) {
          this.log(`⚠️ Frontend build warnings: ${stderr}`);
        }
        
        this.log('✅ Frontend build completed');
        resolve();
      });
    });
  }

  async restartBackend() {
    return new Promise((resolve, reject) => {
      this.log('🔄 Restarting backend...');
      
      exec('pm2 restart aira-backend', (error, stdout, stderr) => {
        if (error) {
          this.log(`❌ Backend restart error: ${error.message}`);
          reject(error);
          return;
        }
        
        this.log('✅ Backend restarted successfully');
        resolve();
      });
    });
  }

  async restartFrontend() {
    return new Promise((resolve, reject) => {
      this.log('🔄 Restarting frontend...');
      
      exec('pm2 restart aira-frontend', (error, stdout, stderr) => {
        if (error) {
          this.log(`❌ Frontend restart error: ${error.message}`);
          reject(error);
          return;
        }
        
        this.log('✅ Frontend restarted successfully');
        resolve();
      });
    });
  }

  // Graceful shutdown
  shutdown() {
    this.log('🛑 Shutting down Auto-Build Watcher...');
    process.exit(0);
  }
}

// Handle process signals
process.on('SIGINT', () => {
  watcher.shutdown();
});

process.on('SIGTERM', () => {
  watcher.shutdown();
});

// Start the watcher
const watcher = new AutoBuildWatcher();
