# ════════════════════════════════════════════════════════════════════════════════
# QANTUM Framework - Deployment Makefile
# ════════════════════════════════════════════════════════════════════════════════

.PHONY: help start stop restart status logs clean health dev prod build

# Default target
.DEFAULT_GOAL := help

# Docker Compose files
COMPOSE_FILE := docker-compose.fullstack.yml
DEV_COMPOSE_FILE := docker-compose.dev.yml

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

help: ## Show this help message
	@echo '$(BLUE)QANTUM Framework - Deployment Commands$(NC)'
	@echo ''
	@echo 'Usage:'
	@echo '  make $(GREEN)<target>$(NC)'
	@echo ''
	@echo 'Targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

start: ## Start all services in production mode
	@echo "$(BLUE)Starting QANTUM Framework (Production)...$(NC)"
	./deploy.sh start

stop: ## Stop all services
	@echo "$(YELLOW)Stopping QANTUM Framework...$(NC)"
	./deploy.sh stop

restart: ## Restart all services
	@echo "$(YELLOW)Restarting QANTUM Framework...$(NC)"
	./deploy.sh restart

status: ## Show status of all services
	@echo "$(BLUE)QANTUM Framework Status:$(NC)"
	./deploy.sh status

logs: ## Show logs from all services
	./deploy.sh logs

health: ## Run health checks on all services
	@echo "$(BLUE)Running health checks...$(NC)"
	./health-check.sh

clean: ## Remove all containers and volumes
	@echo "$(YELLOW)Cleaning QANTUM Framework...$(NC)"
	./deploy.sh clean

dev: ## Start all services in development mode with hot reload
	@echo "$(BLUE)Starting QANTUM Framework (Development)...$(NC)"
	@docker-compose -f $(COMPOSE_FILE) -f $(DEV_COMPOSE_FILE) up -d --build
	@echo "$(GREEN)Development environment started!$(NC)"
	@echo "Frontend with hot reload: http://localhost:5173"

dev-logs: ## Show logs in development mode
	@docker-compose -f $(COMPOSE_FILE) -f $(DEV_COMPOSE_FILE) logs -f

dev-stop: ## Stop development environment
	@docker-compose -f $(COMPOSE_FILE) -f $(DEV_COMPOSE_FILE) down

prod: ## Deploy in production mode (alias for start)
	@$(MAKE) start

build: ## Build all Docker images
	@echo "$(BLUE)Building all Docker images...$(NC)"
	@docker-compose -f $(COMPOSE_FILE) build
	@echo "$(GREEN)Build complete!$(NC)"

setup: ## Initial setup - copy env file
	@if [ ! -f .env ]; then \
		cp .env.deployment .env; \
		echo "$(GREEN)Created .env file from template$(NC)"; \
		echo "$(YELLOW)Please edit .env with your configuration$(NC)"; \
	else \
		echo "$(YELLOW).env file already exists$(NC)"; \
	fi

# Service-specific commands
logs-backend: ## Show backend service logs
	./deploy.sh logs backend

logs-frontend: ## Show frontend service logs
	./deploy.sh logs frontend

logs-dashboard: ## Show dashboard service logs
	./deploy.sh logs dashboard

logs-db: ## Show database logs
	./deploy.sh logs postgres

# Quick access URLs
urls: ## Display all service URLs
	@echo "$(BLUE)QANTUM Framework Service URLs:$(NC)"
	@echo "  Frontend:          http://localhost:8080"
	@echo "  Dashboard:         http://localhost:8081"
	@echo "  Backend API:       http://localhost:5050"
	@echo "  Rust Economy:      http://localhost:8890"
	@echo "  Webhook Handler:   http://localhost:5051"
	@echo "  SEO Audit:         http://localhost:8091"
	@echo "  Temporal UI:       http://localhost:8082"
	@echo "  Grafana:           http://localhost:3000"
	@echo "  Prometheus:        http://localhost:9090"

# Database management
db-shell: ## Access PostgreSQL shell
	@docker-compose -f $(COMPOSE_FILE) exec postgres psql -U qantum_user -d qantum_db

db-backup: ## Backup PostgreSQL database
	@mkdir -p backups
	@docker-compose -f $(COMPOSE_FILE) exec postgres pg_dump -U qantum_user qantum_db > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Database backup created in backups/$(NC)"

db-restore: ## Restore PostgreSQL database (requires BACKUP_FILE variable)
	@if [ -z "$(BACKUP_FILE)" ]; then \
		echo "$(YELLOW)Usage: make db-restore BACKUP_FILE=backups/backup_YYYYMMDD_HHMMSS.sql$(NC)"; \
	else \
		cat $(BACKUP_FILE) | docker-compose -f $(COMPOSE_FILE) exec -T postgres psql -U qantum_user -d qantum_db; \
		echo "$(GREEN)Database restored from $(BACKUP_FILE)$(NC)"; \
	fi

# Monitoring
monitor: ## Open Grafana dashboard
	@echo "$(BLUE)Opening Grafana dashboard...$(NC)"
	@open http://localhost:3000 || xdg-open http://localhost:3000 || echo "Open http://localhost:3000 in your browser"

metrics: ## Open Prometheus metrics
	@echo "$(BLUE)Opening Prometheus metrics...$(NC)"
	@open http://localhost:9090 || xdg-open http://localhost:9090 || echo "Open http://localhost:9090 in your browser"

# Testing
test: ## Run health checks and basic tests
	@echo "$(BLUE)Running tests...$(NC)"
	@$(MAKE) health
	@echo "$(GREEN)Tests complete!$(NC)"

# Install/Update
install: setup build ## Full installation - setup and build
	@echo "$(GREEN)Installation complete!$(NC)"
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "  1. Edit .env file with your configuration"
	@echo "  2. Run 'make start' to start all services"
	@echo "  3. Run 'make health' to verify deployment"
