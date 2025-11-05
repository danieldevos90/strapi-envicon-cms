#!/usr/bin/env node

console.log('='.repeat(60));
console.log('=== Strapi Build Process (Verbose Mode) ===');
console.log('='.repeat(60));
console.log('\n📅 Start Time:', new Date().toISOString());
console.log('📂 Working Directory:', process.cwd());
console.log('🔢 Node Version:', process.version);
console.log('💻 Platform:', process.platform);
console.log('⚙️  Architecture:', process.arch);

// Load environment variables
console.log('\n' + '='.repeat(60));
console.log('📋 Loading Environment Variables...');
console.log('='.repeat(60));
require('dotenv').config();

console.log('✅ NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('✅ HOST:', process.env.HOST || 'not set');
console.log('✅ PORT:', process.env.PORT || 'not set');
console.log('✅ DATABASE_CLIENT:', process.env.DATABASE_CLIENT || 'not set');

// Check for dist folder
const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(60));
console.log('📁 Checking Directory Structure...');
console.log('='.repeat(60));

const distPath = path.join(process.cwd(), 'dist');
console.log('📂 dist folder:', fs.existsSync(distPath) ? '✅ exists' : '⚠️  does not exist yet');

const nodeModulesPath = path.join(process.cwd(), 'node_modules');
console.log('📂 node_modules:', fs.existsSync(nodeModulesPath) ? '✅ exists' : '❌ MISSING');

const strapiPath = path.join(process.cwd(), 'node_modules', '@strapi', 'strapi');
console.log('📦 @strapi/strapi:', fs.existsSync(strapiPath) ? '✅ exists' : '❌ MISSING');

// Check memory
console.log('\n' + '='.repeat(60));
console.log('💾 Memory Information...');
console.log('='.repeat(60));
const memUsage = process.memoryUsage();
console.log('Heap Total:', (memUsage.heapTotal / 1024 / 1024).toFixed(2), 'MB');
console.log('Heap Used:', (memUsage.heapUsed / 1024 / 1024).toFixed(2), 'MB');

// Start build
console.log('\n' + '='.repeat(60));
console.log('🔨 Starting Strapi Build...');
console.log('='.repeat(60));
console.log('Command: strapi build');
console.log('');

const { spawn } = require('child_process');

const buildProcess = spawn('npx', ['strapi', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, FORCE_COLOR: '1' }
});

buildProcess.on('error', (error) => {
  console.error('\n' + '='.repeat(60));
  console.error('❌ Build Process Error');
  console.error('='.repeat(60));
  console.error(error);
  process.exit(1);
});

buildProcess.on('close', (code) => {
  console.log('\n' + '='.repeat(60));
  
  if (code === 0) {
    console.log('✅ Build Completed Successfully!');
    console.log('='.repeat(60));
    
    // Check dist folder after build
    console.log('\n📁 Post-Build Check:');
    if (fs.existsSync(distPath)) {
      console.log('✅ dist folder created');
      
      // List contents
      try {
        const distContents = fs.readdirSync(distPath);
        console.log('📂 dist folder contains:', distContents.length, 'items');
        console.log('   Files/folders:', distContents.slice(0, 10).join(', '));
        if (distContents.length > 10) {
          console.log('   ... and', distContents.length - 10, 'more');
        }
      } catch (err) {
        console.log('⚠️  Could not list dist contents:', err.message);
      }
    } else {
      console.log('❌ dist folder was NOT created!');
    }
    
    // Memory usage after build
    const finalMemUsage = process.memoryUsage();
    console.log('\n💾 Final Memory Usage:');
    console.log('Heap Used:', (finalMemUsage.heapUsed / 1024 / 1024).toFixed(2), 'MB');
    
    console.log('\n📅 End Time:', new Date().toISOString());
    console.log('\n✅ Next step: npm start or restart app in Plesk');
    console.log('='.repeat(60));
  } else {
    console.log('❌ Build Failed!');
    console.log('='.repeat(60));
    console.log('Exit Code:', code);
    console.log('\n📅 Failed at:', new Date().toISOString());
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check if all environment variables are set: npm run check-env');
    console.log('2. Check if node_modules exists: npm install');
    console.log('3. Check memory limits on server');
    console.log('4. Check Plesk/Passenger logs for errors');
    console.log('='.repeat(60));
  }
  
  process.exit(code);
});

