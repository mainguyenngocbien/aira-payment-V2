#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Color mapping to deep blue #044aad
const colorMappings = {
  // Primary text colors - all to deep blue
  'text-readable-primary': 'text-[#044aad]',
  'text-readable-secondary': 'text-[#044aad]',
  'text-readable-muted': 'text-[#044aad]',
  
  // Gray colors to deep blue
  'text-gray-900': 'text-[#044aad]',
  'text-gray-800': 'text-[#044aad]',
  'text-gray-700': 'text-[#044aad]',
  'text-gray-600': 'text-[#044aad]',
  'text-gray-500': 'text-[#044aad]',
  'text-gray-400': 'text-[#044aad]',
  
  // Neutral colors to deep blue
  'text-neutral-800': 'text-[#044aad]',
  'text-neutral-700': 'text-[#044aad]',
  'text-neutral-600': 'text-[#044aad]',
  'text-neutral-500': 'text-[#044aad]',
  
  // Secondary colors to deep blue
  'text-secondary-500': 'text-[#044aad]',
  'text-secondary-600': 'text-[#044aad]',
  'text-secondary-700': 'text-[#044aad]',
  
  // Hover states
  'hover:text-gray-700': 'hover:text-[#044aad]',
  'hover:text-gray-600': 'hover:text-[#044aad]',
  'hover:text-readable-secondary': 'hover:text-[#044aad]',
  'hover:text-readable-muted': 'hover:text-[#044aad]',
  
  // Background colors for buttons
  'bg-gray-100': 'bg-blue-50',
  'bg-gray-200': 'bg-blue-100',
  'hover:bg-gray-100': 'hover:bg-blue-50',
  'hover:bg-gray-200': 'hover:bg-blue-100',
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

console.log('🎨 Updating all text colors to deep blue #044aad...\n');

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

console.log('\n🎉 Deep blue color update completed!');
console.log('📊 Summary:');
console.log(`   Total files processed: ${totalFiles}`);
console.log(`   Files updated: ${updatedFiles}`);

console.log('\n🔧 Color mappings applied:');
for (const [oldColor, newColor] of Object.entries(colorMappings)) {
  console.log(`   ${oldColor} → ${newColor}`);
}

console.log('\n💡 Next steps:');
console.log('   1. Run: npm run dev');
console.log('   2. Check the deep blue text colors');
console.log('   3. Verify consistency across all components');
