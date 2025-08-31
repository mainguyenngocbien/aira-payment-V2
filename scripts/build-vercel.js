#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting Vercel build process...');

// Step 1: Remove console.logs
console.log('📝 Removing console.logs...');
try {
  execSync('node scripts/remove-console-logs.js', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️ Console.log removal failed, continuing...');
}

// Step 2: Create temporary tsconfig for Vercel
console.log('⚙️ Creating Vercel TypeScript config...');
const tsconfigVercel = {
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "app/**/*.ts",
    "app/**/*.tsx",
    "components/**/*.ts",
    "components/**/*.tsx",
    "hooks/**/*.ts",
    "hooks/**/*.tsx",
    "lib/**/*.ts",
    "lib/**/*.tsx",
    "middleware.ts",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "backend",
    "backend/**/*",
    "scripts",
    "scripts/**/*"
  ]
};

fs.writeFileSync('tsconfig.vercel.json', JSON.stringify(tsconfigVercel, null, 2));

// Step 3: Run Next.js build with custom config
console.log('🚀 Building Next.js app...');
try {
  execSync('npx next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      TS_NODE_PROJECT: 'tsconfig.vercel.json'
    }
  });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // Clean up temporary config
  if (fs.existsSync('tsconfig.vercel.json')) {
    fs.unlinkSync('tsconfig.vercel.json');
  }
}
