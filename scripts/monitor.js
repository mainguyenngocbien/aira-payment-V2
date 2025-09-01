#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class AIRAMonitor {
  constructor() {
    this.logFile = path.join(process.cwd(), 'logs', 'monitor.log');
    this.ensureLogsDirectory();
    this.startMonitoring();
  }

  ensureLogsDirectory() {
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    fs.appendFileSync(this.logFile, logMessage + '\n');
  }

  async checkPM2Status() {
    return new Promise((resolve) => {
      exec('pm2 jlist', (error, stdout, stderr) => {
        if (error) {
          this.log(`❌ PM2 status check failed: ${error.message}`);
          resolve(false);
          return;
        }

        try {
          const processes = JSON.parse(stdout);
          const airaProcesses = processes.filter(p => p.name.startsWith('aira-'));
          
          this.log(`📊 PM2 Status: ${airaProcesses.length} AIRA processes running`);
          
          airaProcesses.forEach(process => {
            const status = process.pm2_env.status === 'online' ? '✅' : '❌';
            this.log(`  ${status} ${process.name}: ${process.pm2_env.status} (${process.pm2_env.restart_time} restarts)`);
          });

          resolve(true);
        } catch (parseError) {
          this.log(`❌ Failed to parse PM2 status: ${parseError.message}`);
          resolve(false);
        }
      });
    });
  }

  async checkBackendHealth() {
    return new Promise((resolve) => {
      const http = require('http');
      
      const options = {
        hostname: 'localhost',
        port: 7003,
        path: '/health',
        method: 'GET',
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        if (res.statusCode === 200) {
          this.log('✅ Backend health check passed');
          resolve(true);
        } else {
          this.log(`❌ Backend health check failed: HTTP ${res.statusCode}`);
          resolve(false);
        }
      });

      req.on('error', (error) => {
        this.log(`❌ Backend health check failed: ${error.message}`);
        resolve(false);
      });

      req.on('timeout', () => {
        this.log('❌ Backend health check timeout');
        req.destroy();
        resolve(false);
      });

      req.end();
    });
  }

  async checkFrontendHealth() {
    return new Promise((resolve) => {
      const http = require('http');
      
      const options = {
        hostname: 'localhost',
        port: 7001,
        path: '/',
        method: 'GET',
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        if (res.statusCode === 200) {
          this.log('✅ Frontend health check passed');
          resolve(true);
        } else {
          this.log(`❌ Frontend health check failed: HTTP ${res.statusCode}`);
          resolve(false);
        }
      });

      req.on('error', (error) => {
        this.log(`❌ Frontend health check failed: ${error.message}`);
        resolve(false);
      });

      req.on('timeout', () => {
        this.log('❌ Frontend health check timeout');
        req.destroy();
        resolve(false);
      });

      req.end();
    });
  }

  async checkDiskSpace() {
    return new Promise((resolve) => {
      exec('df -h /', (error, stdout, stderr) => {
        if (error) {
          this.log(`❌ Disk space check failed: ${error.message}`);
          resolve(false);
          return;
        }

        const lines = stdout.split('\n');
        const rootLine = lines[1];
        const parts = rootLine.split(/\s+/);
        const usage = parts[4];
        
        this.log(`💾 Disk usage: ${usage}`);
        
        // Check if usage is over 90%
        const usagePercent = parseInt(usage.replace('%', ''));
        if (usagePercent > 90) {
          this.log(`⚠️ High disk usage: ${usage}`);
        }
        
        resolve(true);
      });
    });
  }

  async checkMemoryUsage() {
    return new Promise((resolve) => {
      exec('free -m', (error, stdout, stderr) => {
        if (error) {
          this.log(`❌ Memory check failed: ${error.message}`);
          resolve(false);
          return;
        }

        const lines = stdout.split('\n');
        const memLine = lines[1];
        const parts = memLine.split(/\s+/);
        const total = parseInt(parts[1]);
        const used = parseInt(parts[2]);
        const free = parseInt(parts[3]);
        const usagePercent = Math.round((used / total) * 100);
        
        this.log(`🧠 Memory usage: ${used}MB/${total}MB (${usagePercent}%)`);
        
        if (usagePercent > 90) {
          this.log(`⚠️ High memory usage: ${usagePercent}%`);
        }
        
        resolve(true);
      });
    });
  }

  async restartFailedServices() {
    return new Promise((resolve) => {
      exec('pm2 restart aira-backend aira-frontend', (error, stdout, stderr) => {
        if (error) {
          this.log(`❌ Failed to restart services: ${error.message}`);
          resolve(false);
          return;
        }
        
        this.log('🔄 Services restarted');
        resolve(true);
      });
    });
  }

  async performHealthCheck() {
    this.log('🔍 Starting health check...');
    
    const pm2Status = await this.checkPM2Status();
    const backendHealth = await this.checkBackendHealth();
    const frontendHealth = await this.checkFrontendHealth();
    const diskSpace = await this.checkDiskSpace();
    const memoryUsage = await this.checkMemoryUsage();
    
    const allHealthy = pm2Status && backendHealth && frontendHealth && diskSpace && memoryUsage;
    
    if (!allHealthy) {
      this.log('⚠️ Health check failed, attempting to restart services...');
      await this.restartFailedServices();
    } else {
      this.log('✅ All health checks passed');
    }
    
    return allHealthy;
  }

  startMonitoring() {
    this.log('🚀 AIRA Monitor started');
    
    // Initial health check
    this.performHealthCheck();
    
    // Schedule regular health checks every 5 minutes
    setInterval(() => {
      this.performHealthCheck();
    }, 5 * 60 * 1000);
    
    // Schedule PM2 status checks every minute
    setInterval(() => {
      this.checkPM2Status();
    }, 60 * 1000);
  }
}

// Handle process signals
process.on('SIGINT', () => {
  console.log('🛑 AIRA Monitor shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 AIRA Monitor shutting down...');
  process.exit(0);
});

// Start the monitor
const monitor = new AIRAMonitor();
