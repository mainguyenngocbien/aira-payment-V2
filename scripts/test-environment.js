#!/usr/bin/env node

// Test environment detection
const environmentDetector = require('../lib/environment.js');

console.log('🔍 Testing Environment Detection...\n');

// Test environment detection
const config = environmentDetector.getConfig();

console.log('📋 Environment Configuration:');
console.log('================================');
console.log(`Environment: ${config.environment}`);
console.log(`Is Local: ${config.isLocal}`);
console.log(`Is GCP: ${config.isGCP}`);
console.log(`Is Production: ${config.isProduction}`);
console.log(`API Base URL: ${config.apiBaseUrl}`);
console.log(`Frontend URL: ${config.frontendUrl}`);
console.log('');

// Test API endpoints
console.log('🔗 Testing API Endpoints:');
console.log('==========================');

const testEndpoints = [
  '/health',
  '/api/v1/health',
  '/api/v1/user/me',
  '/api/v1/wallet-manager/wallet'
];

testEndpoints.forEach(endpoint => {
  const fullUrl = `${config.apiBaseUrl}${endpoint}`;
  console.log(`✅ ${endpoint} -> ${fullUrl}`);
});

console.log('');

// Test environment info
console.log('ℹ️ Environment Info:');
console.log('====================');
console.log(environmentDetector.getEnvironmentInfo());

console.log('\n🎉 Environment detection test completed!');
