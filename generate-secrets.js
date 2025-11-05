#!/usr/bin/env node

const crypto = require('crypto');

console.log('=== Generating Strapi Secrets ===\n');
console.log('Copy these to your .env file:\n');
console.log('# Security Keys (Generated ' + new Date().toISOString() + ')');

const secrets = {
  'APP_KEYS': crypto.randomBytes(32).toString('base64'),
  'API_TOKEN_SALT': crypto.randomBytes(32).toString('base64'),
  'ADMIN_JWT_SECRET': crypto.randomBytes(32).toString('base64'),
  'TRANSFER_TOKEN_SALT': crypto.randomBytes(32).toString('base64'),
  'JWT_SECRET': crypto.randomBytes(32).toString('base64')
};

Object.entries(secrets).forEach(([key, value]) => {
  console.log(`${key}=${value}`);
});

console.log('\n✅ Secrets generated successfully!\n');

