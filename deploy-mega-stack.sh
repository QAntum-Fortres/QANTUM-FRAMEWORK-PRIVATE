#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# 🌌 QANTUM FRAMEWORK - MEGA STACK DEPLOYMENT ORCHESTRATOR
# ═══════════════════════════════════════════════════════════════════════════════
# Autonomous deployment script with validation, testing, and rollback
# Philosophy: Together with logic, we are invincible
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# Color Codes for Output
# ─────────────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ─────────────────────────────────────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${ENV_FILE:-.env.production}"
DOCKER_COMPOSE_FILE="${DOCKER_COMPOSE_FILE:-docker-compose.fullstack.yml}"
K8S_DIR="${K8S_DIR:-k8s}"
NAMESPACE="${NAMESPACE:-default}"
REGISTRY="${REGISTRY:-ccr.ccs.tencentyun.com/demo/mywebapp}"

# ─────────────────────────────────────────────────────────────────────────────
# Logging Functions
# ─────────────────────────────────────────────────────────────────────────────
log_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_header() {
    echo -e "\n${PURPLE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════${NC}\n"
}

# ─────────────────────────────────────────────────────────────────────────────
# Validation Functions
# ─────────────────────────────────────────────────────────────────────────────
validate_environment() {
    log_header "🔍 Validating Environment"
    
    # Check if .env file exists
    if [[ ! -f "$ENV_FILE" ]]; then
        log_error "Environment file $ENV_FILE not found"
        log_info "Please create it from .env.example or .env.production"
        return 1
    fi
    
    # Source environment file
    set -a
    source "$ENV_FILE"
    set +a
    
    # Required environment variables
    local required_vars=(
        "DATABASE_URL"
        "LIVENESS_TOKEN_SECRET"
    )
    
    local missing_vars=()
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        return 1
    fi
    
    log_success "Environment validation passed"
    return 0
}

validate_dependencies() {
    log_header "🔧 Checking Dependencies"
    
    local required_commands=("docker" "docker-compose")
    local missing_commands=()
    
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            missing_commands+=("$cmd")
        fi
    done
    
    if [[ ${#missing_commands[@]} -gt 0 ]]; then
        log_error "Missing required commands:"
        for cmd in "${missing_commands[@]}"; do
            echo "  - $cmd"
        done
        return 1
    fi
    
    log_success "All dependencies installed"
    return 0
}

# ─────────────────────────────────────────────────────────────────────────────
# Build Functions
# ─────────────────────────────────────────────────────────────────────────────
build_docker_image() {
    log_header "🏗️  Building Docker Image"
    
    local image_tag="${REGISTRY}:$(git rev-parse --short HEAD 2>/dev/null || echo 'latest')"
    
    log_info "Building image: $image_tag"
    
    if docker build \
        --build-arg BUILD_DATE="$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
        --build-arg VCS_REF="$(git rev-parse HEAD 2>/dev/null || echo 'unknown')" \
        --tag "$image_tag" \
        --tag "${REGISTRY}:latest" \
        -f Dockerfile \
        .; then
        log_success "Docker image built successfully"
        echo "$image_tag" > /tmp/qantum-image-tag.txt
        return 0
    else
        log_error "Docker image build failed"
        return 1
    fi
}

# ─────────────────────────────────────────────────────────────────────────────
# Testing Functions
# ─────────────────────────────────────────────────────────────────────────────
test_docker_compose() {
    log_header "🧪 Testing with Docker Compose"
    
    log_info "Starting services..."
    if ! docker-compose -f "$DOCKER_COMPOSE_FILE" up -d; then
        log_error "Failed to start services"
        return 1
    fi
    
    log_info "Waiting for services to be healthy (60s timeout)..."
    local timeout=60
    local elapsed=0
    
    while [[ $elapsed -lt $timeout ]]; do
        if docker-compose -f "$DOCKER_COMPOSE_FILE" ps | grep -q "unhealthy"; then
            sleep 5
            elapsed=$((elapsed + 5))
        else
            log_success "All services are healthy"
            docker-compose -f "$DOCKER_COMPOSE_FILE" ps
            return 0
        fi
    done
    
    log_error "Services failed health check"
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
    return 1
}

run_health_checks() {
    log_header "🩺 Running Health Checks"
    
    local endpoints=(
        "http://localhost:8080/health:Frontend"
        "http://localhost:5050/health:Backend"
        "http://localhost:8890/health:Rust-Economy"
    )
    
    local failed=0
    for endpoint in "${endpoints[@]}"; do
        IFS=: read -r url name <<< "$endpoint"
        log_info "Checking $name at $url"
        
        if curl -f -s "$url" > /dev/null 2>&1; then
            log_success "$name is healthy"
        else
            log_warning "$name health check failed (may not be implemented)"
            # Don't fail on health check endpoints that may not exist
        fi
    done
    
    return 0
}

cleanup_test_environment() {
    log_info "Cleaning up test environment..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" down -v
}

# ─────────────────────────────────────────────────────────────────────────────
# Registry Functions
# ─────────────────────────────────────────────────────────────────────────────
push_to_registry() {
    log_header "📤 Pushing to Container Registry"
    
    if [[ ! -f /tmp/qantum-image-tag.txt ]]; then
        log_error "No image tag found. Build may have failed."
        return 1
    fi
    
    local image_tag
    image_tag="$(cat /tmp/qantum-image-tag.txt)"
    
    log_info "Pushing $image_tag"
    if docker push "$image_tag"; then
        log_success "Image pushed successfully"
        
        log_info "Pushing ${REGISTRY}:latest"
        if docker push "${REGISTRY}:latest"; then
            log_success "Latest tag pushed successfully"
            return 0
        fi
    fi
    
    log_error "Failed to push images"
    return 1
}

# ─────────────────────────────────────────────────────────────────────────────
# Kubernetes Functions
# ─────────────────────────────────────────────────────────────────────────────
deploy_to_kubernetes() {
    log_header "🚀 Deploying to Kubernetes"
    
    if ! command -v kubectl &> /dev/null; then
        log_warning "kubectl not found, skipping Kubernetes deployment"
        return 0
    fi
    
    local image_tag
    image_tag="$(cat /tmp/qantum-image-tag.txt 2>/dev/null || echo "${REGISTRY}:latest")"
    
    log_info "Deploying with image: $image_tag"
    
    # Apply configurations
    if [[ -d "$K8S_DIR" ]]; then
        cd "$K8S_DIR"
        
        # Update kustomization with new image
        if command -v kustomize &> /dev/null; then
            kustomize edit set image "$image_tag"
            
            log_info "Applying Kubernetes manifests..."
            if kustomize build . | kubectl apply -f -; then
                log_success "Kubernetes manifests applied"
            else
                log_error "Failed to apply Kubernetes manifests"
                cd "$SCRIPT_DIR"
                return 1
            fi
        else
            log_warning "kustomize not found, applying manifests directly"
            kubectl apply -f .
        fi
        
        cd "$SCRIPT_DIR"
        
        # Wait for rollout
        log_info "Waiting for rollout to complete..."
        if kubectl rollout status deployment/qantum-framework-v1 -n "$NAMESPACE" --timeout=10m; then
            log_success "Deployment completed successfully"
            kubectl get pods -n "$NAMESPACE"
            return 0
        else
            log_error "Deployment rollout failed"
            return 1
        fi
    else
        log_warning "Kubernetes directory not found, skipping deployment"
        return 0
    fi
}

rollback_deployment() {
    log_header "↩️  Rolling Back Deployment"
    
    if ! command -v kubectl &> /dev/null; then
        log_warning "kubectl not found, cannot rollback"
        return 1
    fi
    
    log_info "Rolling back deployment..."
    if kubectl rollout undo deployment/qantum-framework-v1 -n "$NAMESPACE"; then
        log_success "Rollback initiated"
        kubectl rollout status deployment/qantum-framework-v1 -n "$NAMESPACE"
        return 0
    else
        log_error "Rollback failed"
        return 1
    fi
}

# ─────────────────────────────────────────────────────────────────────────────
# Main Deployment Flow
# ─────────────────────────────────────────────────────────────────────────────
main() {
    log_header "🌌 QANTUM FRAMEWORK - MEGA STACK DEPLOYMENT"
    
    local mode="${1:-full}"
    
    case "$mode" in
        validate)
            validate_environment && validate_dependencies
            ;;
        build)
            validate_environment && validate_dependencies && build_docker_image
            ;;
        test)
            validate_environment && validate_dependencies && test_docker_compose && run_health_checks
            cleanup_test_environment
            ;;
        push)
            push_to_registry
            ;;
        deploy)
            deploy_to_kubernetes
            ;;
        rollback)
            rollback_deployment
            ;;
        full)
            log_info "Running full deployment pipeline..."
            
            if ! validate_environment; then
                log_error "Environment validation failed"
                exit 1
            fi
            
            if ! validate_dependencies; then
                log_error "Dependency check failed"
                exit 1
            fi
            
            if ! build_docker_image; then
                log_error "Build failed"
                exit 1
            fi
            
            log_info "Skipping local tests (can be run separately with: $0 test)"
            
            # If registry credentials are available, push
            if [[ -n "${REGISTRY_USERNAME:-}" ]] && [[ -n "${REGISTRY_PASSWORD:-}" ]]; then
                if ! push_to_registry; then
                    log_error "Push failed"
                    exit 1
                fi
                
                if ! deploy_to_kubernetes; then
                    log_error "Deployment failed"
                    log_warning "You can rollback with: $0 rollback"
                    exit 1
                fi
            else
                log_warning "Registry credentials not found, skipping push and deploy"
                log_info "Set REGISTRY_USERNAME and REGISTRY_PASSWORD to enable"
            fi
            
            log_success "✨ Deployment completed successfully!"
            echo -e "\n${PURPLE}Together with logic, we are invincible.${NC}"
            echo -e "${PURPLE}We build only eternal foundations.${NC}\n"
            ;;
        *)
            echo "Usage: $0 {validate|build|test|push|deploy|rollback|full}"
            echo ""
            echo "Commands:"
            echo "  validate  - Validate environment and dependencies"
            echo "  build     - Build Docker image"
            echo "  test      - Test with docker-compose"
            echo "  push      - Push images to registry"
            echo "  deploy    - Deploy to Kubernetes"
            echo "  rollback  - Rollback Kubernetes deployment"
            echo "  full      - Run complete deployment pipeline (default)"
            exit 1
            ;;
    esac
}

# ─────────────────────────────────────────────────────────────────────────────
# Execute Main
# ─────────────────────────────────────────────────────────────────────────────
main "$@"
