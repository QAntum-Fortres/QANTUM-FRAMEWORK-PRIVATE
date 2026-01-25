# 🚀 QANTUM Framework - Fullstack Deployment Guide

## Overview

This guide provides complete instructions for deploying the QANTUM Framework SaaS platform with all general dashboards and services in a production-ready containerized environment.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Service Configuration](#service-configuration)
- [Monitoring & Observability](#monitoring--observability)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

---

## 🏗️ Architecture Overview

The QANTUM Framework fullstack deployment consists of the following services:

### Core Services

| Service | Technology | Port | Description |
|---------|-----------|------|-------------|
| **Frontend** | React + Vite | 8080 | Main user interface with real-time metrics |
| **Dashboard** | Static HTML + Nginx | 8081 | General purpose dashboard |
| **Backend** | Python + Flask | 5050 | Main API server |
| **Rust Economy** | Rust + Actix-web | 8890 | Credit management & telemetry |
| **Webhook Handler** | Python + Flask | 5051 | Stripe payment processing |
| **SEO Audit** | Python + Flask | 8091 | SEO analysis micro-service |

### Infrastructure Services

| Service | Technology | Port | Description |
|---------|-----------|------|-------------|
| **PostgreSQL** | PostgreSQL 15 | 5432 | Primary database |
| **Redis** | Redis 7 | 6379 | Caching and sessions |
| **Temporal** | Temporal.io | 7233 | Workflow orchestration |
| **Temporal UI** | Temporal UI | 8082 | Workflow management interface |
| **Prometheus** | Prometheus | 9090 | Metrics collection |
| **Grafana** | Grafana | 3000 | Visualization dashboard |

### Service Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        QANTUM Framework                          │
│                     Fullstack Architecture                       │
└─────────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │   Internet   │
                         └──────┬───────┘
                                │
                  ┌─────────────┼─────────────┐
                  │             │             │
           ┌──────▼──────┐ ┌───▼────────┐ ┌─▼──────────┐
           │  Frontend   │ │ Dashboard  │ │  Backend   │
           │   :8080     │ │   :8081    │ │   :5050    │
           └──────┬──────┘ └────────────┘ └─────┬──────┘
                  │                              │
                  └───────────┬──────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
       ┌──────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
       │   Rust      │ │  Webhook   │ │ SEO Audit  │
       │  Economy    │ │  Handler   │ │   :8091    │
       │   :8890     │ │   :5051    │ └────────────┘
       └──────┬──────┘ └─────┬──────┘
              │               │
              └───────┬───────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
    ┌────▼────┐  ┌───▼────┐  ┌───▼────────┐
    │ Postgres│  │ Redis  │  │  Temporal  │
    │  :5432  │  │ :6379  │  │   :7233    │
    └─────────┘  └────────┘  └────────────┘
                                    │
                          ┌─────────┴─────────┐
                          │                   │
                    ┌─────▼──────┐    ┌──────▼─────┐
                    │ Temporal UI│    │ Prometheus │
                    │   :8082    │    │   :9090    │
                    └────────────┘    └──────┬─────┘
                                             │
                                      ┌──────▼─────┐
                                      │  Grafana   │
                                      │   :3000    │
                                      └────────────┘
```

---

## 📦 Prerequisites

### System Requirements

- **Operating System**: Linux, macOS, or Windows with WSL2
- **Docker**: Version 20.10 or later
- **Docker Compose**: Version 2.0 or later
- **Available RAM**: Minimum 8GB (16GB recommended)
- **Available Disk**: Minimum 20GB free space
- **CPU**: 4 cores minimum (8 cores recommended)

### Software Installation

#### Install Docker

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**macOS:**
```bash
brew install --cask docker
```

**Windows:**
Download and install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)

#### Install Docker Compose

Docker Compose is included with Docker Desktop. For Linux:

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Verify Installation

```bash
docker --version
docker-compose --version
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/QAntum-Fortres/QANTUM-FRAMEWORK-PRIVATE.git
cd QANTUM-FRAMEWORK-PRIVATE
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.deployment .env

# Edit with your configuration
nano .env  # or use your preferred editor
```

**Important:** Update the following values in `.env`:
- `POSTGRES_PASSWORD` - Set a strong database password
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret
- `GRAFANA_PASSWORD` - Admin password for Grafana

### 3. Deploy All Services

```bash
# Make deploy script executable
chmod +x deploy.sh

# Start all services
./deploy.sh start
```

### 4. Access the Dashboards

After deployment, access the following URLs:

- **Frontend Dashboard**: http://localhost:8080
- **General Dashboard**: http://localhost:8081
- **Grafana Monitoring**: http://localhost:3000 (admin/your_password)
- **Temporal Workflows**: http://localhost:8082
- **Prometheus Metrics**: http://localhost:9090

### 5. Verify Deployment

```bash
# Check service status
./deploy.sh status

# View service logs
./deploy.sh logs
```

---

## 🔧 Detailed Setup

### Environment Configuration

The `.env` file contains all configuration variables:

```bash
# ════════════════════════════════════════════════════════════════════
# QANTUM FRAMEWORK - FULLSTACK DEPLOYMENT ENVIRONMENT
# ════════════════════════════════════════════════════════════════════

# Database Configuration
POSTGRES_PASSWORD=your_secure_password_here

# Stripe Payment Integration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Stripe Price IDs
STRIPE_PRICE_SINGULARITY=price_your_singularity_price_id
STRIPE_PRICE_AETERNA=price_your_aeterna_price_id
STRIPE_PRICE_VORTEX=price_your_vortex_price_id

# Grafana
GRAFANA_PASSWORD=admin_password_here

# Frontend URLs
VITE_BACKEND_URL=http://localhost:5050
VITE_RUST_ECONOMY_URL=http://localhost:8890

# Security
LIVENESS_TOKEN_SECRET=your_secret_key_for_hmac
```

### Building from Source

If you need to rebuild specific services:

```bash
# Build all services
docker-compose -f docker-compose.fullstack.yml build

# Build specific service
docker-compose -f docker-compose.fullstack.yml build frontend

# Build without cache
docker-compose -f docker-compose.fullstack.yml build --no-cache
```

### Database Initialization

The PostgreSQL database is automatically initialized on first run. To manually run migrations:

```bash
# Access the database container
docker-compose -f docker-compose.fullstack.yml exec postgres psql -U qantum_user -d qantum_db

# Run migrations (if you have migration files)
docker-compose -f docker-compose.fullstack.yml exec backend python manage.py migrate
```

---

## 📊 Service Configuration

### Frontend Configuration

The frontend is built with React and Vite. Configuration is done through environment variables:

```bash
VITE_BACKEND_URL=http://localhost:5050
VITE_RUST_ECONOMY_URL=http://localhost:8890
```

### Backend Configuration

Python-based backend services use the following configuration:

```bash
PORT=8080
DATABASE_URL=postgresql://qantum_user:password@postgres:5432/qantum_db
RUST_ECONOMY_URL=http://rust-economy:8890
```

### Rust Economy Server

The Rust economy server manages credits and telemetry:

```bash
RUST_LOG=info
DATABASE_URL=postgresql://qantum_user:password@postgres:5432/qantum_db
```

### Temporal Configuration

Workflow orchestration is handled by Temporal:

```bash
DB=postgresql
POSTGRES_USER=qantum_user
POSTGRES_PWD=your_password
POSTGRES_SEEDS=postgres
```

---

## 📈 Monitoring & Observability

### Prometheus Metrics

Prometheus collects metrics from all services. Access at http://localhost:9090

**Key Metrics:**
- Service health checks
- Request rates and latencies
- System resource usage
- Custom business metrics

### Grafana Dashboards

Grafana provides visualization of Prometheus metrics. Access at http://localhost:3000

**Default Credentials:**
- Username: `admin`
- Password: Set in `.env` as `GRAFANA_PASSWORD`

**Pre-configured Dashboards:**
- System Overview
- Service Health
- Database Performance
- API Request Metrics

### Temporal Workflow UI

Monitor and manage workflows at http://localhost:8082

**Features:**
- Workflow execution history
- Task queue monitoring
- Worker status
- Error tracking

### Service Logs

View logs for all services:

```bash
# All services
./deploy.sh logs

# Specific service
./deploy.sh logs backend

# Follow logs in real-time
docker-compose -f docker-compose.fullstack.yml logs -f backend
```

---

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use

**Problem:** Service fails to start because port is already in use.

**Solution:**
```bash
# Find process using the port
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change the port in docker-compose.fullstack.yml
```

#### Database Connection Failed

**Problem:** Services cannot connect to PostgreSQL.

**Solution:**
```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.fullstack.yml ps postgres

# Check PostgreSQL logs
docker-compose -f docker-compose.fullstack.yml logs postgres

# Restart PostgreSQL
docker-compose -f docker-compose.fullstack.yml restart postgres
```

#### Out of Memory

**Problem:** Services crash due to insufficient memory.

**Solution:**
```bash
# Increase Docker memory limit in Docker Desktop settings
# Or add resource limits in docker-compose.fullstack.yml

services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
```

#### Build Failures

**Problem:** Docker build fails for a specific service.

**Solution:**
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose -f docker-compose.fullstack.yml build --no-cache service_name

# Check build logs
docker-compose -f docker-compose.fullstack.yml build service_name 2>&1 | tee build.log
```

### Health Checks

Check the health of all services:

```bash
# Using deploy script
./deploy.sh status

# Manual health checks
curl http://localhost:8080  # Frontend
curl http://localhost:8081  # Dashboard
curl http://localhost:5050/health  # Backend
curl http://localhost:8890/health  # Rust Economy
curl http://localhost:5051/health  # Webhook Handler
```

### Debugging Individual Services

```bash
# Enter a running container
docker-compose -f docker-compose.fullstack.yml exec backend bash

# View container resource usage
docker stats

# Inspect container configuration
docker inspect qantum-backend
```

---

## 🔒 Security Best Practices

### 1. Environment Variables

- **Never commit** `.env` files to version control
- Use strong, randomly generated passwords
- Rotate secrets regularly (every 90 days)

### 2. Network Security

- Use HTTPS in production (configure reverse proxy)
- Implement rate limiting
- Configure CORS properly
- Use firewall rules to restrict access

### 3. Database Security

- Use strong passwords
- Enable SSL/TLS for database connections
- Regular backups
- Restrict database access to application network only

### 4. Stripe Webhook Security

- Always verify webhook signatures
- Use HTTPS endpoints in production
- Implement idempotency for webhook handlers
- Monitor webhook failures

### 5. Docker Security

- Don't run containers as root
- Use minimal base images
- Scan images for vulnerabilities
- Keep images updated

### 6. Access Control

- Implement authentication for all dashboards
- Use API keys for service-to-service communication
- Enable audit logging
- Implement role-based access control (RBAC)

---

## 🚢 Production Deployment

### Pre-Production Checklist

- [ ] Configure all environment variables
- [ ] Set up HTTPS/TLS certificates
- [ ] Configure backup strategy
- [ ] Set up monitoring and alerting
- [ ] Test disaster recovery procedures
- [ ] Security audit and penetration testing
- [ ] Load testing
- [ ] Set up CI/CD pipeline
- [ ] Configure log aggregation
- [ ] Document runbooks

### Cloud Deployment Options

#### AWS ECS/Fargate

```bash
# Build and push images to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag qantum-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/qantum-backend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/qantum-backend:latest
```

#### Google Cloud Run

```bash
# Deploy services to Cloud Run
gcloud builds submit --tag gcr.io/PROJECT_ID/qantum-backend
gcloud run deploy qantum-backend --image gcr.io/PROJECT_ID/qantum-backend --platform managed
```

#### Kubernetes

```bash
# Convert docker-compose to Kubernetes manifests
kompose convert -f docker-compose.fullstack.yml

# Apply to Kubernetes cluster
kubectl apply -f .
```

### Scaling Considerations

- Use load balancer for frontend and API services
- Implement horizontal pod autoscaling
- Use managed database services (RDS, Cloud SQL)
- Set up CDN for static assets
- Implement caching strategy (Redis, CloudFlare)

---

## 🛠️ Maintenance

### Backup Strategy

```bash
# Backup PostgreSQL database
docker-compose -f docker-compose.fullstack.yml exec postgres pg_dump -U qantum_user qantum_db > backup_$(date +%Y%m%d).sql

# Backup volumes
docker run --rm -v qantum_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data
```

### Updates and Upgrades

```bash
# Pull latest images
docker-compose -f docker-compose.fullstack.yml pull

# Restart services with new images
./deploy.sh restart

# Update specific service
docker-compose -f docker-compose.fullstack.yml up -d --no-deps --build backend
```

### Cleanup

```bash
# Clean up stopped containers and unused images
./deploy.sh clean

# Remove all data (CAUTION: This is destructive!)
docker-compose -f docker-compose.fullstack.yml down -v
```

---

## 📚 Additional Resources

- [QUICKSTART.md](QUICKSTART.md) - Quick start guide for Wealth Bridge
- [README.md](README.md) - Complete system walkthrough
- [WEALTH_BRIDGE_README.md](WEALTH_BRIDGE_README.md) - Architecture guide
- [Temporal Documentation](https://docs.temporal.io)
- [Prometheus Documentation](https://prometheus.io/docs)
- [Grafana Documentation](https://grafana.com/docs)

---

## 🆘 Support

For issues and questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review service logs with `./deploy.sh logs <service>`
3. Contact the development team

---

## 📄 License

Proprietary - All Rights Reserved

---

**Built with ❤️ by the QANTUM Team**

*"Deploy. Monitor. Scale."* 🚀
