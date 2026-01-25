#!/bin/bash

# ════════════════════════════════════════════════════════════════════════════════
# QANTUM FRAMEWORK - HEALTH CHECK SCRIPT
# ════════════════════════════════════════════════════════════════════════════════
# 
# This script checks the health of all deployed services
#
# Usage:
#   ./health-check.sh
#
# ════════════════════════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${PURPLE}╔════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC}  $1"
    echo -e "${PURPLE}╚════════════════════════════════════════════════════════════════════════╝${NC}\n"
}

check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Checking $service_name... "
    
    if command -v curl &> /dev/null; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
        
        if [ "$response" = "$expected_status" ] || [ "$response" = "200" ] || [ "$response" = "302" ]; then
            echo -e "${GREEN}✓ OK${NC} (HTTP $response)"
            return 0
        else
            echo -e "${RED}✗ FAILED${NC} (HTTP $response)"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠ SKIPPED${NC} (curl not available)"
        return 1
    fi
}

check_container() {
    local container_name=$1
    
    echo -n "Checking container $container_name... "
    
    if docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
        status=$(docker inspect --format='{{.State.Status}}' "$container_name")
        if [ "$status" = "running" ]; then
            echo -e "${GREEN}✓ RUNNING${NC}"
            return 0
        else
            echo -e "${RED}✗ NOT RUNNING${NC} (Status: $status)"
            return 1
        fi
    else
        echo -e "${RED}✗ NOT FOUND${NC}"
        return 1
    fi
}

# Main health check
print_header "QANTUM Framework Health Check"

echo -e "${CYAN}Container Status:${NC}"
check_container "qantum-postgres"
check_container "qantum-redis"
check_container "qantum-backend"
check_container "qantum-rust-economy"
check_container "qantum-webhook"
check_container "qantum-frontend"
check_container "qantum-dashboard"
check_container "qantum-seo-audit"
check_container "qantum-temporal"
check_container "qantum-temporal-ui"
check_container "qantum-prometheus"
check_container "qantum-grafana"

echo ""
echo -e "${CYAN}Service Health Endpoints:${NC}"
check_service "Frontend" "http://localhost:8080"
check_service "Dashboard" "http://localhost:8081"
check_service "Backend" "http://localhost:5050"
check_service "Rust Economy" "http://localhost:8890/health"
check_service "Webhook Handler" "http://localhost:5051/health"
check_service "SEO Audit" "http://localhost:8091/health"
check_service "Temporal UI" "http://localhost:8082"
check_service "Prometheus" "http://localhost:9090"
check_service "Grafana" "http://localhost:3000"

print_header "Health Check Complete"

echo -e "\n${CYAN}Service URLs:${NC}"
echo -e "  Frontend Dashboard:    ${GREEN}http://localhost:8080${NC}"
echo -e "  General Dashboard:     ${GREEN}http://localhost:8081${NC}"
echo -e "  Backend API:           ${GREEN}http://localhost:5050${NC}"
echo -e "  Rust Economy API:      ${GREEN}http://localhost:8890${NC}"
echo -e "  Webhook Handler:       ${GREEN}http://localhost:5051${NC}"
echo -e "  SEO Audit Module:      ${GREEN}http://localhost:8091${NC}"
echo -e "  Temporal UI:           ${GREEN}http://localhost:8082${NC}"
echo -e "  Grafana Dashboard:     ${GREEN}http://localhost:3000${NC}"
echo -e "  Prometheus:            ${GREEN}http://localhost:9090${NC}"

echo ""
