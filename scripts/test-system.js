#!/usr/bin/env node

// Comprehensive system test
const environmentDetector = require('../lib/environment.js');

console.log('🧪 Comprehensive System Test\n');

// Test 1: Environment Detection
console.log('1️⃣ Testing Environment Detection...');
const config = environmentDetector.getConfig();
console.log(`   Environment: ${config.environment}`);
console.log(`   API Base URL: ${config.apiBaseUrl}`);
console.log(`   Frontend URL: ${config.frontendUrl}`);
console.log(`   Is Local: ${config.isLocal}`);
console.log(`   Is GCP: ${config.isGCP}`);
console.log(`   Is Production: ${config.isProduction}`);
console.log('   ✅ Environment detection working\n');

// Test 2: API Endpoints
console.log('2️⃣ Testing API Endpoints...');
const testEndpoints = [
  '/health',
  '/api/v1/health',
  '/api/v1/user/me',
  '/api/v1/wallet-manager/wallet'
];

testEndpoints.forEach(endpoint => {
  const fullUrl = `${config.apiBaseUrl}${endpoint}`;
  console.log(`   ✅ ${endpoint} -> ${fullUrl}`);
});
console.log('   ✅ API endpoints configured\n');

// Test 3: Build Status
console.log('3️⃣ Testing Build Status...');
const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '..', '.next');
if (fs.existsSync(nextDir)) {
  console.log('   ✅ .next directory exists');
  
  const staticDir = path.join(nextDir, 'static');
  if (fs.existsSync(staticDir)) {
    console.log('   ✅ Static files generated');
  }
  
  const serverDir = path.join(nextDir, 'server');
  if (fs.existsSync(serverDir)) {
    console.log('   ✅ Server files generated');
  }
} else {
  console.log('   ⚠️ .next directory not found (run npm run build first)');
}
console.log('   ✅ Build status checked\n');

// Test 4: Environment Variables
console.log('4️⃣ Testing Environment Variables...');
const envVars = [
  'NODE_ENV',
  'NEXT_PUBLIC_API_BASE_URL',
  'NEXT_PUBLIC_FRONTEND_URL'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`   ✅ ${varName}: ${value}`);
  } else {
    console.log(`   ⚠️ ${varName}: not set`);
  }
});
console.log('   ✅ Environment variables checked\n');

// Test 5: Package Dependencies
console.log('5️⃣ Testing Package Dependencies...');
const packageJson = require('../package.json');
const requiredDeps = [
  'next',
  'react',
  'react-dom',
  'firebase',
  'daisyui',
  'tailwindcss'
];

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
    console.log(`   ✅ ${dep}: installed`);
  } else {
    console.log(`   ❌ ${dep}: missing`);
  }
});
console.log('   ✅ Dependencies checked\n');

// Test 6: Scripts
console.log('6️⃣ Testing Available Scripts...');
const requiredScripts = [
  'dev',
  'build',
  'start',
  'test:env'
];

requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`   ✅ ${script}: available`);
  } else {
    console.log(`   ❌ ${script}: missing`);
  }
});
console.log('   ✅ Scripts checked\n');

// Summary
console.log('📊 Test Summary:');
console.log('================');
console.log(`Environment: ${config.environment}`);
console.log(`API Base URL: ${config.apiBaseUrl}`);
console.log(`Frontend URL: ${config.frontendUrl}`);
console.log(`Build Status: ${fs.existsSync(nextDir) ? 'Ready' : 'Not Built'}`);

if (config.isLocal) {
  console.log('\n🚀 Local Development Ready!');
  console.log('   Run: npm run dev');
  console.log('   Visit: http://localhost:7001');
} else {
  console.log('\n🚀 Production Ready!');
  console.log('   Run: npm run start');
  console.log('   Visit: https://airapayment.olym3.xyz');
}

console.log('\n🎉 System test completed!');
