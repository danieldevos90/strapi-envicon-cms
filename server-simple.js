console.log('=== Simple Node.js Test ===');
console.log('If you see this, Node.js is working!');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());

// Simple HTTP server
const http = require('http');
const port = process.env.PORT || 1337;

const server = http.createServer((req, res) => {
  console.log('Request to:', req.url);
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <h1>Node.js is working!</h1>
    <p>If you see this, the basic Node.js server works.</p>
    <p>Node version: ${process.version}</p>
    <p>Directory: ${process.cwd()}</p>
    <p>The issue is with loading Strapi specifically.</p>
  `);
});

server.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}/`);
});




