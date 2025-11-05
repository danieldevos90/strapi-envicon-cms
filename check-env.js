#!/usr/bin/env node

console.log('=== Strapi Environment Variables Check ===\n');

// Load .env file
require('dotenv').config();

const requiredVars = [
  'NODE_ENV',
  'HOST',
  'PORT',
  'APP_KEYS',
  'API_TOKEN_SALT',
  'ADMIN_JWT_SECRET',
  'TRANSFER_TOKEN_SALT',
  'JWT_SECRET',
  'DATABASE_CLIENT',
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_NAME',
  'DATABASE_USERNAME',
  'DATABASE_PASSWORD'
];

const optionalVars = [
  'DATABASE_SSL',
  'DATABASE_SSL_SELF',
  'DATABASE_SSL_CA',
  'DATABASE_SSL_KEY',
  'DATABASE_SSL_CERT'
];

let missingCount = 0;
let presentCount = 0;

console.log('📋 Required Environment Variables:\n');

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${maskValue(varName, value)}`);
    presentCount++;
  } else {
    console.log(`❌ ${varName}: MISSING`);
    missingCount++;
  }
});

console.log('\n📋 Optional Environment Variables:\n');

optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${maskValue(varName, value)}`);
  } else {
    console.log(`⚪ ${varName}: not set (optional)`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`\n📊 Summary: ${presentCount}/${requiredVars.length} required variables present`);

if (missingCount > 0) {
  console.log(`\n❌ ${missingCount} required variable(s) missing!`);
  console.log('\n💡 Generate missing secrets with:');
  console.log('   node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"');
  console.log('\nOr run: npm run generate-secrets\n');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set!\n');
  console.log('You can now run: npm run build && npm start\n');
  process.exit(0);
}

// Helper function to mask sensitive values
function maskValue(varName, value) {
  const sensitiveVars = [
    'APP_KEYS',
    'API_TOKEN_SALT', 
    'ADMIN_JWT_SECRET',
    'TRANSFER_TOKEN_SALT',
    'JWT_SECRET',
    'DATABASE_PASSWORD'
  ];
  
  if (sensitiveVars.includes(varName)) {
    if (value.length > 8) {
      return value.substring(0, 4) + '***' + value.substring(value.length - 4);
    }
    return '***';
  }
  
  return value;
}

