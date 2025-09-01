module.exports = {
  apps: [
    {
      name: 'aira-backend',
      script: './backend/dist/index.js',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 7003,
        FRONTEND_URL: 'https://airapayment.olym3.xyz'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 7003,
        FRONTEND_URL: 'http://localhost:7001'
      },
      // Auto restart configuration
      watch: false, // We'll use custom watcher
      ignore_watch: ['node_modules', 'logs', '*.log'],
      max_memory_restart: '1G',
      
      // Logging
      log_file: './logs/backend-combined.log',
      out_file: './logs/backend-out.log',
      error_file: './logs/backend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto restart on crash
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true
    },
    {
      name: 'aira-frontend',
      script: 'npm',
      args: 'start',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 7001
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 7001
      },
      
      // Logging
      log_file: './logs/frontend-combined.log',
      out_file: './logs/frontend-out.log',
      error_file: './logs/frontend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto restart on crash
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'aira-watcher',
      script: './scripts/auto-build-watcher.js',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      
      // Logging
      log_file: './logs/watcher-combined.log',
      out_file: './logs/watcher-out.log',
      error_file: './logs/watcher-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto restart on crash
      autorestart: true,
      max_restarts: 5,
      min_uptime: '5s'
    }
  ],

  deploy: {
    production: {
      user: 'root',
      host: 'your-gcp-server-ip',
      ref: 'origin/main',
      repo: 'https://github.com/mainguyenngocbien/aira-payment-V2.git',
      path: '/var/www/aira-payment',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build:backend && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
