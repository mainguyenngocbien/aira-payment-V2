const crypto = require('crypto');

// Generate Aira ID (format: AIRA + 12 random alphanumeric characters = 16 total)
function generateAiraId() {
  return 'AIRA' + crypto.randomBytes(6).toString('hex').toUpperCase();
}

// Test Aira ID generation
console.log('Generated Aira IDs:');
for (let i = 0; i < 5; i++) {
  console.log(`  ${i + 1}. ${generateAiraId()}`);
}

// Example database entry
const email = 'songonha@gmail.com';
const wallet = '0x983f42e8ac5fbc32677916e548dd47265b3949f0';
const privateKey = 'a8b10c8a6f893287fc877c9f94fa5972f2dd40f56a2514fbaca280b4cfa03924';
const airaId = generateAiraId();

console.log('\nExample database entry:');
console.log(`${email} ${wallet} ${privateKey} ${airaId}`);
