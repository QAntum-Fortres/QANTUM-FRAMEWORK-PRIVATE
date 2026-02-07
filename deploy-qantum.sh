#!/bin/bash

###############################################################################
# QANTUM Framework - One-Command Deployment Script
# 
# Deploys the complete QANTUM framework including:
# - QAntum Client (browser automation)
# - Frontend Dashboard
# - Backend Services (Python + Rust)
# - Database & Infrastructure
# 
# Usage: ./deploy-qantum.sh [start|stop|restart|status|logs]
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="qantum-framework"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Functions
log_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

log_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

log_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_banner() {
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "  🚀 QANTUM FRAMEWORK - Deployment Manager"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
}

check_dependencies() {
    log_info "Checking dependencies..."
    
    local missing_deps=()
    
    # Check for Docker
    if ! command -v docker &> /dev/null; then
        missing_deps+=("docker")
    fi
    
    # Check for Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        missing_deps+=("docker-compose")
    fi
    
    # Check for Node.js
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    # Check for npm
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing dependencies: ${missing_deps[*]}"
        log_info "Please install the missing dependencies and try again."
        exit 1
    fi
    
    log_success "All dependencies installed"
}

install_qantum_client() {
    log_info "Installing QAntum Client..."
    
    cd "$SCRIPT_DIR/src/qantum-client"
    
    if [ ! -d "node_modules" ]; then
        npm install
        log_success "QAntum Client dependencies installed"
    else
        log_info "QAntum Client dependencies already installed"
    fi
    
    # Build TypeScript
    if [ ! -d "dist" ]; then
        npm run build
        log_success "QAntum Client built successfully"
    else
        log_info "QAntum Client already built"
    fi
    
    cd "$SCRIPT_DIR"
}

start_services() {
    log_info "Starting QANTUM Framework services..."
    
    # Check if .env file exists
    if [ ! -f "$SCRIPT_DIR/.env" ]; then
        if [ -f "$SCRIPT_DIR/.env.deployment" ]; then
            cp "$SCRIPT_DIR/.env.deployment" "$SCRIPT_DIR/.env"
            log_warning "Created .env from .env.deployment template"
            log_warning "Please update .env with your configuration!"
        else
            log_error ".env file not found. Please create one from .env.example"
            exit 1
        fi
    fi
    
    # Start Docker services
    if [ -f "$SCRIPT_DIR/docker-compose.fullstack.yml" ]; then
        log_info "Starting Docker services..."
        docker-compose -f "$SCRIPT_DIR/docker-compose.fullstack.yml" up -d
        log_success "Docker services started"
    else
        log_warning "docker-compose.fullstack.yml not found, skipping Docker services"
    fi
    
    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 5
    
    print_service_urls
}

stop_services() {
    log_info "Stopping QANTUM Framework services..."
    
    if [ -f "$SCRIPT_DIR/docker-compose.fullstack.yml" ]; then
        docker-compose -f "$SCRIPT_DIR/docker-compose.fullstack.yml" down
        log_success "Docker services stopped"
    fi
}

restart_services() {
    log_info "Restarting QANTUM Framework services..."
    stop_services
    sleep 2
    start_services
}

check_status() {
    log_info "Checking service status..."
    
    if [ -f "$SCRIPT_DIR/docker-compose.fullstack.yml" ]; then
        docker-compose -f "$SCRIPT_DIR/docker-compose.fullstack.yml" ps
    else
        log_warning "docker-compose.fullstack.yml not found"
    fi
    
    echo ""
    log_info "QAntum Client status:"
    if [ -d "$SCRIPT_DIR/src/qantum-client/dist" ]; then
        log_success "Built and ready"
    else
        log_warning "Not built yet. Run: ./deploy-qantum.sh install"
    fi
}

show_logs() {
    local service=$1
    
    if [ -z "$service" ]; then
        log_info "Showing logs for all services..."
        docker-compose -f "$SCRIPT_DIR/docker-compose.fullstack.yml" logs -f
    else
        log_info "Showing logs for $service..."
        docker-compose -f "$SCRIPT_DIR/docker-compose.fullstack.yml" logs -f "$service"
    fi
}

print_service_urls() {
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "  🌐 Service URLs"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "  Frontend Dashboard:     http://localhost:8080"
    echo "  General Dashboard:      http://localhost:8081"
    echo "  Backend API:            http://localhost:5050"
    echo "  Rust Economy:           http://localhost:8890"
    echo "  Webhook Handler:        http://localhost:5051"
    echo "  Grafana (Monitoring):   http://localhost:3000"
    echo "  Prometheus (Metrics):   http://localhost:9090"
    echo "  Temporal UI:            http://localhost:8082"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "  📖 Documentation"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "  QAntum Client API:      src/qantum-client/README.md"
    echo "  Main README:            README_QANTUM_CLIENT.md"
    echo "  Deployment Guide:       DEPLOYMENT.md"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "  🧪 Quick Tests"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "  # Test QAntum Client (Basic)"
    echo "  cd src/qantum-client && npm test"
    echo ""
    echo "  # Test QAntum Client (Advanced)"
    echo "  cd src/qantum-client && npm run test:advanced"
    echo ""
    echo "  # Test QAntum Client (Parallel)"
    echo "  cd src/qantum-client && npm run test:parallel"
    echo ""
    echo "  # Test Backend Health"
    echo "  curl http://localhost:5050/health"
    echo ""
    echo "  # Test Rust Economy"
    echo "  curl http://localhost:8890/api/telemetry"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
}

run_examples() {
    log_info "Running QAntum Client examples..."
    
    cd "$SCRIPT_DIR/src/qantum-client"
    
    if [ ! -d "node_modules" ]; then
        log_warning "Dependencies not installed. Installing now..."
        npm install
    fi
    
    log_info "Running basic usage example..."
    npm test || true
    
    echo ""
    read -p "Press Enter to run advanced examples..." -n1 -s
    echo ""
    
    log_info "Running advanced usage example..."
    npm run test:advanced || true
    
    echo ""
    read -p "Press Enter to run parallel execution example..." -n1 -s
    echo ""
    
    log_info "Running parallel execution example..."
    npm run test:parallel || true
    
    cd "$SCRIPT_DIR"
}

show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  install      Install QAntum Client and dependencies"
    echo "  start        Start all QANTUM Framework services"
    echo "  stop         Stop all services"
    echo "  restart      Restart all services"
    echo "  status       Show service status"
    echo "  logs [svc]   Show logs (optionally for specific service)"
    echo "  examples     Run QAntum Client examples"
    echo "  urls         Show service URLs"
    echo "  help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install              # Install and build QAntum Client"
    echo "  $0 start                # Start all services"
    echo "  $0 logs backend         # Show backend logs"
    echo "  $0 examples             # Run example tests"
    echo ""
}

# Main script
main() {
    print_banner
    
    case "${1:-help}" in
        install)
            check_dependencies
            install_qantum_client
            log_success "Installation complete!"
            log_info "Run './deploy-qantum.sh start' to start services"
            ;;
        start)
            check_dependencies
            install_qantum_client
            start_services
            log_success "QANTUM Framework is running!"
            ;;
        stop)
            stop_services
            log_success "QANTUM Framework stopped"
            ;;
        restart)
            restart_services
            log_success "QANTUM Framework restarted"
            ;;
        status)
            check_status
            ;;
        logs)
            show_logs "${2:-}"
            ;;
        examples)
            run_examples
            ;;
        urls)
            print_service_urls
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
