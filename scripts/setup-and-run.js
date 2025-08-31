#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 AIRA Payment - Setup and Run Script');
console.log('=====================================');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description, cwd = process.cwd()) {
  try {
    log(`📦 ${description}...`, 'blue');
    execSync(command, { 
      stdio: 'inherit', 
      cwd,
      shell: true 
    });
    log(`✅ ${description} completed`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    return false;
  }
}

// Check if backend directory exists
const backendPath = path.join(process.cwd(), 'backend');
if (!fs.existsSync(backendPath)) {
  log('❌ Backend directory not found!', 'red');
  log('Please make sure the backend folder exists.', 'yellow');
  process.exit(1);
}

// Check if backend package.json exists
const backendPackageJson = path.join(backendPath, 'package.json');
if (!fs.existsSync(backendPackageJson)) {
  log('❌ Backend package.json not found!', 'red');
  log('Please make sure the backend is properly set up.', 'yellow');
  process.exit(1);
}

// Install frontend dependencies
log('🔧 Installing frontend dependencies...', 'cyan');
if (!runCommand('npm install', 'Frontend dependencies installation')) {
  process.exit(1);
}

// Install backend dependencies
log('🔧 Installing backend dependencies...', 'cyan');
if (!runCommand('npm install', 'Backend dependencies installation', backendPath)) {
  process.exit(1);
}

// Build backend
log('🔨 Building backend...', 'cyan');
if (!runCommand('npm run build', 'Backend build', backendPath)) {
  process.exit(1);
}

// Create .env file for backend if it doesn't exist
const backendEnvPath = path.join(backendPath, '.env');
const backendEnvExamplePath = path.join(backendPath, 'env.example');

if (!fs.existsSync(backendEnvPath) && fs.existsSync(backendEnvExamplePath)) {
  log('📝 Creating backend .env file...', 'yellow');
  try {
    fs.copyFileSync(backendEnvExamplePath, backendEnvPath);
    log('✅ Backend .env file created from example', 'green');
  } catch (error) {
    log('⚠️  Could not create .env file, you may need to create it manually', 'yellow');
  }
}

log('🎉 Setup completed successfully!', 'green');
console.log('=====================================');
log('🚀 Starting both frontend and backend...', 'magenta');
log('Frontend will be available at: http://localhost:3000', 'cyan');
log('Backend will be available at: http://localhost:3003', 'cyan');
log('Press Ctrl+C to stop both servers', 'yellow');
console.log('=====================================');

// Start both servers
try {
  execSync('npm run dev:full', { 
    stdio: 'inherit',
    shell: true 
  });
} catch (error) {
  if (error.signal === 'SIGINT') {
    log('\n🛑 Servers stopped by user', 'yellow');
  } else {
    log(`❌ Error running servers: ${error.message}`, 'red');
  }
}
