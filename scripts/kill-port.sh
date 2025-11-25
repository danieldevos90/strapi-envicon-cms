#!/bin/bash

echo "🔍 Checking port 1337..."

# Find process on port 1337
PID=$(lsof -ti:1337 2>/dev/null)

if [ ! -z "$PID" ]; then
  echo "⚠️  Found process $PID on port 1337"
  echo "🔪 Killing process..."
  kill -9 $PID 2>/dev/null || true
  sleep 1
  echo "✅ Process killed"
else
  echo "✅ Port 1337 is already free"
fi

