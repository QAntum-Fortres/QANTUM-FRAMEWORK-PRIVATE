#!/bin/bash

# ════════════════════════════════════════════════════════════════════════════════
# QANTUM FRAMEWORK - DEPLOYMENT VALIDATION SCRIPT
# ════════════════════════════════════════════════════════════════════════════════
# 
# This script validates the deployment configuration without starting services
#
# Usage:
#   ./validate-deployment.sh
#
# ════════════════════════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

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
    ((ERRORS++))
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# ────────────────────────────────────────────────────────────────────
# Validation Functions
# ────────────────────────────────────────────────────────────────────

validate_file_exists() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        print_success "$description exists: $file"
    else
        print_error "$description not found: $file"
    fi
}

validate_directory_exists() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        print_success "$description exists: $dir"
    else
        print_error "$description not found: $dir"
    fi
}

validate_executable() {
    local script=$1
    
    if [ -x "$script" ]; then
        print_success "Script is executable: $script"
    else
        print_warning "Script is not executable: $script (run: chmod +x $script)"
    fi
}

validate_env_file() {
    local env_file=$1
    
    if [ -f "$env_file" ]; then
        print_info "Checking environment variables in $env_file..."
        
        # Check critical variables
        local critical_vars=(
            "POSTGRES_PASSWORD"
            "STRIPE_SECRET_KEY"
            "STRIPE_WEBHOOK_SECRET"
        )
        
        for var in "${critical_vars[@]}"; do
            if grep -q "^${var}=" "$env_file"; then
                local value=$(grep "^${var}=" "$env_file" | cut -d'=' -f2)
                if [[ "$value" =~ (change_me|your_|here) ]]; then
                    print_warning "$var needs to be updated in $env_file"
                else
                    print_success "$var is set"
                fi
            else
                print_warning "$var not found in $env_file"
            fi
        done
    else
        print_error "Environment file not found: $env_file"
        print_info "Run: cp .env.deployment .env"
    fi
}

validate_docker_compose_syntax() {
    local compose_file=$1
    
    # Try to validate with docker-compose or docker compose
    if command -v docker-compose &> /dev/null; then
        if docker-compose -f "$compose_file" config > /dev/null 2>&1; then
            print_success "Docker Compose file syntax is valid: $compose_file"
        else
            print_error "Docker Compose file has syntax errors: $compose_file"
        fi
    elif command -v docker &> /dev/null && docker compose version &> /dev/null 2>&1; then
        if docker compose -f "$compose_file" config > /dev/null 2>&1; then
            print_success "Docker Compose file syntax is valid: $compose_file"
        else
            print_error "Docker Compose file has syntax errors: $compose_file"
        fi
    else
        print_warning "Docker Compose not available - skipping syntax validation"
    fi
}

# ────────────────────────────────────────────────────────────────────
# Main Validation
# ────────────────────────────────────────────────────────────────────

print_header "QANTUM Framework Deployment Validation"

# Check deployment files
print_info "Checking deployment files..."
validate_file_exists "docker-compose.fullstack.yml" "Main Docker Compose file"
validate_file_exists "docker-compose.dev.yml" "Development Docker Compose override"
validate_file_exists ".env.deployment" "Environment template"
validate_file_exists "deploy.sh" "Deployment script"
validate_file_exists "health-check.sh" "Health check script"
validate_file_exists "Makefile" "Makefile"
validate_file_exists "DEPLOYMENT.md" "Deployment documentation"
validate_file_exists "DEPLOY_QUICK.md" "Quick start guide"

# Check if scripts are executable
echo ""
print_info "Checking script permissions..."
validate_executable "deploy.sh"
validate_executable "health-check.sh"

# Check supporting configuration files
echo ""
print_info "Checking configuration files..."
validate_file_exists "prometheus.yml" "Prometheus configuration"
validate_file_exists "nginx-dashboard.conf" "Nginx configuration"

# Check service directories
echo ""
print_info "Checking service directories..."
validate_directory_exists "Backend" "Backend directory"
validate_directory_exists "Frontend" "Frontend directory"
validate_directory_exists "Dashboard_Final" "Dashboard directory"

# Check Dockerfiles
echo ""
print_info "Checking Dockerfiles..."
validate_file_exists "Backend/Dockerfile" "Backend Dockerfile"
validate_file_exists "Backend/Dockerfile.webhook" "Webhook Dockerfile"
validate_file_exists "Backend/rust_core/Dockerfile" "Rust Economy Dockerfile"
validate_file_exists "Frontend/Dockerfile" "Frontend Dockerfile"
validate_file_exists "Frontend/Dockerfile.dev" "Frontend Dev Dockerfile"

# Check environment configuration
echo ""
print_info "Checking environment configuration..."
if [ -f ".env" ]; then
    validate_env_file ".env"
else
    print_warning ".env file not found (will use .env.deployment template)"
    print_info "Create .env file: cp .env.deployment .env"
fi

# Validate Docker Compose syntax
echo ""
print_info "Validating Docker Compose syntax..."
validate_docker_compose_syntax "docker-compose.fullstack.yml"

# Check for Docker
echo ""
print_info "Checking Docker installation..."
if command -v docker &> /dev/null; then
    print_success "Docker is installed: $(docker --version)"
    
    # Check if Docker daemon is running
    if docker info &> /dev/null 2>&1; then
        print_success "Docker daemon is running"
    else
        print_warning "Docker daemon is not running"
    fi
else
    print_error "Docker is not installed"
fi

# Check for Docker Compose
echo ""
print_info "Checking Docker Compose installation..."
if command -v docker-compose &> /dev/null; then
    print_success "Docker Compose is installed: $(docker-compose --version)"
elif command -v docker &> /dev/null && docker compose version &> /dev/null 2>&1; then
    print_success "Docker Compose (v2) is installed: $(docker compose version)"
else
    print_error "Docker Compose is not installed"
fi

# Port availability check (optional, as ports might be in use for other things)
echo ""
print_info "Checking critical ports (informational)..."
check_port() {
    local port=$1
    local service=$2
    
    if command -v lsof &> /dev/null; then
        if lsof -i ":$port" &> /dev/null; then
            print_warning "Port $port ($service) is currently in use"
        else
            print_success "Port $port ($service) is available"
        fi
    elif command -v netstat &> /dev/null; then
        if netstat -tuln | grep -q ":$port "; then
            print_warning "Port $port ($service) is currently in use"
        else
            print_success "Port $port ($service) is available"
        fi
    else
        print_info "Cannot check port availability (lsof/netstat not available)"
        return
    fi
}

check_port 8080 "Frontend"
check_port 8081 "Dashboard"
check_port 5050 "Backend"
check_port 8890 "Rust Economy"
check_port 5432 "PostgreSQL"
check_port 3000 "Grafana"

# Summary
print_header "Validation Summary"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo -e "${BLUE}Ready to deploy:${NC}"
    echo "  1. Configure .env file (if not done): cp .env.deployment .env"
    echo "  2. Start services: ./deploy.sh start"
    echo "  3. Check health: ./health-check.sh"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Validation completed with $WARNINGS warning(s)${NC}"
    echo ""
    echo -e "${BLUE}You can proceed with deployment, but review warnings above.${NC}"
    exit 0
else
    echo -e "${RED}✗ Validation failed with $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo ""
    echo -e "${BLUE}Please fix the errors above before deploying.${NC}"
    exit 1
fi
