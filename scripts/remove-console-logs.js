const fs = require('fs');
const path = require('path');

// Directories to process
const directories = [
  'app',
  'components', 
  'hooks',
  'lib'
];

// File extensions to process
const extensions = ['.ts', '.tsx', '.js', '.jsx'];

// Function to recursively find all files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (extensions.includes(path.extname(file))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Skip logger.ts file to avoid circular imports
    if (filePath.includes('logger.ts')) {
      return false;
    }
    
    // Check if file already has logger import
    const hasLoggerImport = content.includes("import logger from");
    const hasLoggerRequire = content.includes("require('logger')");
    
    // Replace console.log with logger.log
    if (content.includes('console.log')) {
      content = content.replace(/console\.log\(/g, 'logger.log(');
      modified = true;
    }
    
    // Replace console.warn with logger.warn
    if (content.includes('console.warn')) {
      content = content.replace(/console\.warn\(/g, 'logger.warn(');
      modified = true;
    }
    
    // Replace console.error with logger.error
    if (content.includes('console.error')) {
      content = content.replace(/console\.error\(/g, 'logger.error(');
      modified = true;
    }
    
    // Replace console.info with logger.info
    if (content.includes('console.info')) {
      content = content.replace(/console\.info\(/g, 'logger.info(');
      modified = true;
    }
    
    // Replace console.debug with logger.debug
    if (content.includes('console.debug')) {
      content = content.replace(/console\.debug\(/g, 'logger.debug(');
      modified = true;
    }
    
    // Add logger import if needed and file was modified
    if (modified && !hasLoggerImport && !hasLoggerRequire) {
      // Calculate relative path to logger
      const relativePath = path.relative(path.dirname(filePath), 'lib').replace(/\\/g, '/');
      const importStatement = `import logger from '${relativePath}/logger';\n`;
      
      // Find the first import statement to add after it
      const importMatch = content.match(/^import.*$/m);
      if (importMatch) {
        const importIndex = content.indexOf(importMatch[0]) + importMatch[0].length;
        content = content.slice(0, importIndex) + '\n' + importStatement + content.slice(importIndex);
      } else {
        // If no imports, add at the beginning
        content = importStatement + content;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Processed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
function main() {
  console.log('🔍 Starting console.log removal process...\n');
  
  let totalFiles = 0;
  let processedFiles = 0;
  
  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = findFiles(dir);
      totalFiles += files.length;
      
      console.log(`📁 Processing directory: ${dir}`);
      files.forEach(file => {
        if (processFile(file)) {
          processedFiles++;
        }
      });
    } else {
      console.log(`⚠️ Directory not found: ${dir}`);
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total files scanned: ${totalFiles}`);
  console.log(`   Files processed: ${processedFiles}`);
  console.log(`\n✅ Console.log removal completed!`);
  console.log(`\n💡 Don't forget to:`);
  console.log(`   1. Import logger in files that need it`);
  console.log(`   2. Test your application thoroughly`);
  console.log(`   3. Build for production to verify logs are hidden`);
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { processFile, findFiles };

