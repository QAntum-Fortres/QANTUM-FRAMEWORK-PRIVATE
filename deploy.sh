#!/bin/bash

# ════════════════════════════════════════════════════════════════════════════════
# QANTUM FRAMEWORK - FULLSTACK DEPLOYMENT SCRIPT
# ════════════════════════════════════════════════════════════════════════════════
# 
# This script deploys the complete QANTUM SaaS platform with all dashboards
# and services in a containerized environment.
#
# Usage:
#   ./deploy.sh [start|stop|restart|status|logs]
#
# ════════════════════════════════════════════════════════════════════════════════

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.fullstack.yml"

# ────────────────────────────────────────────────────────────────────
# Helper Functions
# ────────────────────────────────────────────────────────────────────

print_header() {
    echo -e "\n${PURPLE}╔════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC}  $1"
    echo -e "${PURPLE}╚════════════════════════════════════════════════════════════════════════╝${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# ────────────────────────────────────────────────────────────────────
# Pre-flight Checks
# ────────────────────────────────────────────────────────────────────

check_dependencies() {
    print_header "Checking Dependencies"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_success "Docker installed: $(docker --version)"
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker Compose installed"
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker."
        exit 1
    fi
    print_success "Docker daemon is running"
}

check_env_file() {
    print_header "Checking Environment Configuration"
    
    if [ ! -f "$PROJECT_ROOT/.env.deployment" ]; then
        print_warning "Environment file not found. Creating from template..."
        cp "$PROJECT_ROOT/.env.deployment" "$PROJECT_ROOT/.env" 2>/dev/null || true
        print_info "Please edit .env file with your configuration"
        return 1
    fi
    
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        print_info "Creating .env from .env.deployment template..."
        cp "$PROJECT_ROOT/.env.deployment" "$PROJECT_ROOT/.env"
        print_warning "Please edit .env file with your actual credentials"
        print_info ""
        print_info "To generate strong passwords, use:"
        print_info "  openssl rand -base64 32"
        print_info "  or"
        print_info "  pwgen -s 32 1"
        return 1
    fi
    
    # Check if passwords are still using placeholders
    if grep -q "CHANGE_TO_STRONG_PASSWORD" "$PROJECT_ROOT/.env" 2>/dev/null; then
        print_error "Environment file contains placeholder passwords"
        print_info "Update .env with actual passwords before deploying"
        print_info "Generate secure passwords with: openssl rand -base64 32"
        return 1
    fi
    
    print_success "Environment file exists"
}

# ────────────────────────────────────────────────────────────────────
# Deployment Functions
# ────────────────────────────────────────────────────────────────────

deploy_start() {
    print_header "Starting QANTUM Fullstack Deployment"
    
    check_dependencies
    check_env_file
    
    print_info "Building and starting all services..."
    docker-compose -f "$COMPOSE_FILE" up -d --build
    
    print_success "All services started successfully!"
    
    print_header "Service URLs"
    echo -e "${CYAN}Frontend Dashboard:${NC}       http://localhost:8080"
    echo -e "${CYAN}General Dashboard:${NC}        http://localhost:8081"
    echo -e "${CYAN}Backend API:${NC}              http://localhost:5050"
    echo -e "${CYAN}Rust Economy API:${NC}         http://localhost:8890"
    echo -e "${CYAN}Webhook Handler:${NC}          http://localhost:5051"
    echo -e "${CYAN}SEO Audit Module:${NC}         http://localhost:8091"
    echo -e "${CYAN}Temporal UI:${NC}              http://localhost:8082"
    echo -e "${CYAN}Grafana Dashboard:${NC}        http://localhost:3000 ${YELLOW}(admin/admin)${NC}"
    echo -e "${CYAN}Prometheus:${NC}               http://localhost:9090"
    
    print_header "Waiting for services to be healthy"
    sleep 5
    
    # Check service health
    print_info "Checking service health..."
    docker-compose -f "$COMPOSE_FILE" ps
}

deploy_stop() {
    print_header "Stopping QANTUM Fullstack Deployment"
    
    docker-compose -f "$COMPOSE_FILE" down
    
    print_success "All services stopped successfully!"
}

deploy_restart() {
    print_header "Restarting QANTUM Fullstack Deployment"
    
    deploy_stop
    sleep 2
    deploy_start
}

deploy_status() {
    print_header "QANTUM Fullstack Deployment Status"
    
    docker-compose -f "$COMPOSE_FILE" ps
    
    echo ""
    print_header "Resource Usage"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
}

deploy_logs() {
    print_header "QANTUM Fullstack Deployment Logs"
    
    if [ -z "$2" ]; then
        print_info "Showing logs for all services (Ctrl+C to exit)..."
        docker-compose -f "$COMPOSE_FILE" logs -f
    else
        print_info "Showing logs for service: $2"
        docker-compose -f "$COMPOSE_FILE" logs -f "$2"
    fi
}

deploy_clean() {
    print_header "Cleaning QANTUM Fullstack Deployment"
    
    print_warning "This will remove all containers, volumes, and data. Are you sure? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        docker-compose -f "$COMPOSE_FILE" down -v --remove-orphans
        print_success "Cleanup completed!"
    else
        print_info "Cleanup cancelled."
    fi
}

show_help() {
    cat << EOF
${PURPLE}╔════════════════════════════════════════════════════════════════════════╗${NC}
${PURPLE}║${NC}  QANTUM Framework - Fullstack Deployment Manager
${PURPLE}╚════════════════════════════════════════════════════════════════════════╝${NC}

${CYAN}Usage:${NC}
    ./deploy.sh [COMMAND] [OPTIONS]

${CYAN}Commands:${NC}
    ${GREEN}start${NC}       Start all services
    ${GREEN}stop${NC}        Stop all services
    ${GREEN}restart${NC}     Restart all services
    ${GREEN}status${NC}      Show service status
    ${GREEN}logs${NC}        Show service logs (add service name to filter)
    ${GREEN}clean${NC}       Remove all containers and volumes
    ${GREEN}help${NC}        Show this help message

${CYAN}Examples:${NC}
    ./deploy.sh start
    ./deploy.sh logs backend
    ./deploy.sh status

${CYAN}Services:${NC}
    - backend          Python Backend API
    - frontend         React/Vite Frontend
    - dashboard        Static Dashboard (Nginx)
    - rust-economy     Rust Economy Server
    - webhook-handler  Stripe Webhook Handler
    - seo-audit        SEO Audit Module
    - postgres         PostgreSQL Database
    - redis            Redis Cache
    - temporal         Temporal Workflow Engine
    - temporal-ui      Temporal Web UI
    - prometheus       Metrics Collection
    - grafana          Visualization Dashboard

${CYAN}Documentation:${NC}
    See DEPLOYMENT.md for detailed deployment guide.

EOF
}

# ────────────────────────────────────────────────────────────────────
# Main Script
# ────────────────────────────────────────────────────────────────────

main() {
    case "${1:-help}" in
        start)
            deploy_start
            ;;
        stop)
            deploy_stop
            ;;
        restart)
            deploy_restart
            ;;
        status)
            deploy_status
            ;;
        logs)
            deploy_logs "$@"
            ;;
        clean)
            deploy_clean
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
