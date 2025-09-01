#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Color mapping for better readability
const colorMappings = {
  // Primary text colors
  'text-gray-900': 'text-readable-primary',
  'text-gray-800': 'text-readable-primary',
  'text-neutral-800': 'text-readable-primary',
  
  // Secondary text colors
  'text-gray-700': 'text-readable-secondary',
  'text-gray-600': 'text-readable-secondary',
  'text-secondary-500': 'text-readable-secondary',
  
  // Muted text colors
  'text-gray-500': 'text-readable-muted',
  'text-gray-400': 'text-readable-muted',
  
  // Hover states
  'hover:text-gray-700': 'hover:text-readable-secondary',
  'hover:text-gray-600': 'hover:text-readable-secondary',
  
  // Background colors for text
  'bg-gray-100': 'bg-base-200',
  'bg-gray-200': 'bg-base-300',
  'hover:bg-gray-100': 'hover:bg-base-200',
  'hover:bg-gray-200': 'hover:bg-base-300',
};

// Directories to process
const directories = [
  './app',
  './components',
  './hooks',
  './lib'
];

// File extensions to process
const extensions = ['.tsx', '.ts', '.jsx', '.js'];

function updateColorsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Apply color mappings
    for (const [oldColor, newColor] of Object.entries(colorMappings)) {
      if (content.includes(oldColor)) {
        content = content.replace(new RegExp(oldColor, 'g'), newColor);
        updated = true;
      }
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(fullPath);
        if (extensions.includes(ext)) {
          updateColorsInFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${dirPath}:`, error.message);
  }
}

console.log('🎨 Updating text colors for better readability...\n');

let totalFiles = 0;
let updatedFiles = 0;

// Process each directory
for (const dir of directories) {
  if (fs.existsSync(dir)) {
    console.log(`📁 Processing directory: ${dir}`);
    processDirectory(dir);
  } else {
    console.log(`⚠️ Directory not found: ${dir}`);
  }
}

console.log('\n🎉 Text color update completed!');
console.log('📊 Summary:');
console.log(`   Total files processed: ${totalFiles}`);
console.log(`   Files updated: ${updatedFiles}`);

console.log('\n🔧 Color mappings applied:');
for (const [oldColor, newColor] of Object.entries(colorMappings)) {
  console.log(`   ${oldColor} → ${newColor}`);
}

console.log('\n💡 Next steps:');
console.log('   1. Run: npm run dev');
console.log('   2. Check the updated colors');
console.log('   3. Test readability on different backgrounds');
