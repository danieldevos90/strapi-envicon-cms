#!/bin/bash

echo "🔍 Checking Strapi Status..."
echo ""

# Check if port 1337 is in use
echo "📡 Port 1337 Status:"
PID=$(lsof -ti:1337 2>/dev/null)
if [ ! -z "$PID" ]; then
  echo "  ✅ Port 1337 is in use by process $PID"
  ps -p $PID -o pid,ppid,cmd,%mem,%cpu
else
  echo "  ❌ Port 1337 is NOT in use (Strapi is not running)"
fi
echo ""

# Check if build directory exists
echo "📦 Build Directory:"
if [ -d "build" ]; then
  echo "  ✅ build/ directory exists"
  echo "  Files: $(find build -type f | wc -l)"
else
  echo "  ❌ build/ directory does NOT exist - need to run 'npm run build'"
fi
echo ""

# Check if admin build exists
echo "🎨 Admin Panel Build:"
if [ -d "build/admin" ]; then
  echo "  ✅ build/admin/ exists"
  echo "  Files: $(find build/admin -type f | wc -l)"
else
  echo "  ❌ build/admin/ does NOT exist"
fi
echo ""

# Check node processes
echo "🟢 Node Processes:"
ps aux | grep -E "node|strapi" | grep -v grep || echo "  No node/strapi processes found"
echo ""

# Check git status
echo "📋 Git Status:"
git log --oneline -1
echo ""

echo "🎯 Recommendations:"
if [ ! -d "build" ]; then
  echo "  1. Run: npm run build"
fi
if [ -z "$PID" ]; then
  echo "  2. Run: npm run force-start"
fi

