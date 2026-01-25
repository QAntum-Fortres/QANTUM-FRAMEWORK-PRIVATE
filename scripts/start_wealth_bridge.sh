#!/bin/bash

# Wealth Bridge - Complete System Startup Script
# This script starts all components of the QANTUM Wealth Bridge ecosystem

set -e

echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║   🚀 WEALTH BRIDGE - STARTUP SEQUENCE                                  ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${CYAN}[STATUS]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if directories exist
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Step 1: Build Rust Economy Server
print_status "Building Rust Economy Server (lwas_economy)..."
cd Backend/rust_core

if cargo build --release --bin lwas_economy; then
    print_success "Rust Economy Server built successfully"
else
    print_error "Failed to build Rust Economy Server"
    exit 1
fi

cd ../..

# Step 2: Install Python Dependencies
print_status "Installing Python dependencies..."
cd Backend

if python3 -m pip install -r requirements.txt --quiet; then
    print_success "Python dependencies installed"
else
    print_warning "Some Python dependencies may have failed to install"
fi

cd ..

# Step 3: Install Frontend Dependencies
print_status "Installing Frontend dependencies..."
cd Frontend

if npm install --quiet; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install Frontend dependencies"
    exit 1
fi

cd ..

# Step 4: Build SEO Module (optional)
print_status "Installing SEO Audit Module dependencies..."
cd micro-saas/seo-audit-module

if python3 -m pip install -r requirements.txt --quiet; then
    print_success "SEO Module dependencies installed"
else
    print_warning "SEO Module dependencies may have failed to install"
fi

cd ../..

echo ""
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║   ✅ BUILD COMPLETE - STARTING SERVICES                                ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

# Create logs directory
mkdir -p logs

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=0

    print_status "Waiting for $name to be ready..."
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            print_success "$name is ready!"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    
    print_error "$name failed to start"
    return 1
}

# Start services in background
print_status "Starting Rust Economy Server (port 8890)..."
./Backend/rust_core/target/release/lwas_economy > logs/rust_economy.log 2>&1 &
RUST_PID=$!
echo $RUST_PID > logs/rust_economy.pid
print_success "Rust Economy Server started (PID: $RUST_PID)"

wait_for_service "http://localhost:8890/health" "Rust Economy Server"

print_status "Starting Stripe Webhook Handler (port 5051)..."
cd Backend
python3 stripe_webhook_handler.py > ../logs/webhook_handler.log 2>&1 &
WEBHOOK_PID=$!
echo $WEBHOOK_PID > ../logs/webhook_handler.pid
cd ..
print_success "Webhook Handler started (PID: $WEBHOOK_PID)"

wait_for_service "http://localhost:5051/health" "Webhook Handler"

print_status "Starting Main Backend (OmniCore - port 5050)..."
cd Backend
python3 OmniCore_Scribe.py > ../logs/omnicore.log 2>&1 &
OMNICORE_PID=$!
echo $OMNICORE_PID > ../logs/omnicore.pid
cd ..
print_success "OmniCore Backend started (PID: $OMNICORE_PID)"

wait_for_service "http://localhost:5050/health" "OmniCore Backend" || print_warning "OmniCore may not have a health endpoint"

print_status "Starting SEO Audit Module (port 8091)..."
cd micro-saas/seo-audit-module
python3 app.py > ../../logs/seo_module.log 2>&1 &
SEO_PID=$!
echo $SEO_PID > ../../logs/seo_module.pid
cd ../..
print_success "SEO Audit Module started (PID: $SEO_PID)"

wait_for_service "http://localhost:8091/health" "SEO Audit Module"

print_status "Starting Frontend Development Server (port 5173)..."
cd Frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../logs/frontend.pid
cd ..
print_success "Frontend Dev Server started (PID: $FRONTEND_PID)"

echo ""
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║   🎉 WEALTH BRIDGE IS NOW RUNNING                                      ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📡 Service Status:"
echo "   ├─ Rust Economy Server:    http://localhost:8890"
echo "   ├─ Webhook Handler:        http://localhost:5051"
echo "   ├─ OmniCore Backend:       http://localhost:5050"
echo "   ├─ SEO Audit Module:       http://localhost:8091"
echo "   └─ Frontend Dashboard:     http://localhost:5173"
echo ""
echo "📝 Logs are available in: ./logs/"
echo ""
echo "🧪 Quick Tests:"
echo "   # Test Rust Economy Telemetry"
echo "   curl http://localhost:8890/api/telemetry | jq"
echo ""
echo "   # Test Webhook (Mock Payment)"
echo "   curl -X POST http://localhost:5051/webhook/test \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"user_id\": \"test@example.com\", \"tier\": \"aeterna\"}' | jq"
echo ""
echo "   # Test SEO Audit"
echo "   curl -X POST http://localhost:8091/api/audit \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"url\": \"https://example.com\"}' | jq"
echo ""
echo "🛑 To stop all services: ./scripts/stop_wealth_bridge.sh"
echo ""

# Save PIDs to a master file
cat > logs/all_pids.txt << EOF
RUST_ECONOMY=$RUST_PID
WEBHOOK_HANDLER=$WEBHOOK_PID
OMNICORE=$OMNICORE_PID
SEO_MODULE=$SEO_PID
FRONTEND=$FRONTEND_PID
EOF

print_success "All services started successfully!"
echo ""
echo "Press Ctrl+C to view live logs..."
sleep 2
tail -f logs/*.log
