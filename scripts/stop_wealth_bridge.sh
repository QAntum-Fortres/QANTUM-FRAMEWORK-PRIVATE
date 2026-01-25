#!/bin/bash

# Wealth Bridge - Stop All Services Script

echo "🛑 Stopping Wealth Bridge services..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Read PIDs from files
if [ -f "logs/all_pids.txt" ]; then
    source logs/all_pids.txt
    
    [ ! -z "$RUST_ECONOMY" ] && kill $RUST_ECONOMY 2>/dev/null && echo "✓ Stopped Rust Economy Server"
    [ ! -z "$WEBHOOK_HANDLER" ] && kill $WEBHOOK_HANDLER 2>/dev/null && echo "✓ Stopped Webhook Handler"
    [ ! -z "$OMNICORE" ] && kill $OMNICORE 2>/dev/null && echo "✓ Stopped OmniCore Backend"
    [ ! -z "$SEO_MODULE" ] && kill $SEO_MODULE 2>/dev/null && echo "✓ Stopped SEO Audit Module"
    [ ! -z "$FRONTEND" ] && kill $FRONTEND 2>/dev/null && echo "✓ Stopped Frontend"
    
    rm -f logs/*.pid logs/all_pids.txt
else
    echo "⚠️  No PID file found. Attempting to kill by port..."
    
    # Kill by port as fallback
    lsof -ti:8890 | xargs kill 2>/dev/null && echo "✓ Stopped service on port 8890"
    lsof -ti:5051 | xargs kill 2>/dev/null && echo "✓ Stopped service on port 5051"
    lsof -ti:5050 | xargs kill 2>/dev/null && echo "✓ Stopped service on port 5050"
    lsof -ti:8091 | xargs kill 2>/dev/null && echo "✓ Stopped service on port 8091"
    lsof -ti:5173 | xargs kill 2>/dev/null && echo "✓ Stopped service on port 5173"
fi

echo "✅ All Wealth Bridge services stopped"
