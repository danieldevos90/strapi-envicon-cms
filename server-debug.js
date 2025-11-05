console.log('=== Starting Strapi Debug ===');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT || '1337');

// Check if modules exist
try {
  const strapiPath = require.resolve('@strapi/strapi');
  console.log('✅ @strapi/strapi found at:', strapiPath);
} catch (err) {
  console.log('❌ Cannot find @strapi/strapi:', err.message);
}

// Try to start a simple server first
const http = require('http');
const port = process.env.PORT || 1337;

const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Debug server is working! Now trying Strapi...\n');
});

server.listen(port, () => {
  console.log(`✅ Basic HTTP server running on port ${port}`);
  
  // Now try to load Strapi
  setTimeout(() => {
    console.log('\n=== Attempting to load Strapi ===');
    try {
      const Strapi = require('@strapi/strapi');
      console.log('✅ Strapi module loaded successfully');
      
      // Close our debug server
      server.close(() => {
        console.log('Debug server closed, starting Strapi...');
        
        // Start Strapi (v4/v5 syntax)
        Strapi.createStrapi({ distDir: './dist' }).start().catch(err => {
          console.error('❌ Strapi start error:', err);
          process.exit(1);
        });
      });
    } catch (err) {
      console.error('❌ Failed to load Strapi:', err);
      process.exit(1);
    }
  }, 2000);
});
