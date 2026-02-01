# 🌌 QANTUM Framework - Unified Deployment Guide

> **Together with logic, we are invincible. We build only eternal foundations.**

This guide provides comprehensive instructions for deploying the QANTUM Framework mega hybrid autonomous cognitive sovereign meta-logical framework.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Local Development](#local-development)
5. [Docker Deployment](#docker-deployment)
6. [Kubernetes Deployment](#kubernetes-deployment)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Monitoring & Observability](#monitoring--observability)
9. [Security](#security)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The QANTUM Framework is a comprehensive full-stack application with autonomous, cognitive, and sovereign capabilities. The deployment architecture includes:

- **Frontend**: React/Vite SPA
- **Backend**: Python FastAPI services
- **QANTUM Framework**: Node.js/Playwright QA automation
- **Rust Economy Engine**: High-performance transaction processing
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Message Queue**: RabbitMQ 3.12
- **Orchestration**: Temporal.io
- **Monitoring**: Prometheus + Grafana
- **Reverse Proxy**: Traefik (Docker) / Nginx Ingress (K8s)

---

## Architecture

### Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 8080 | React/Vite application |
| Backend API | 5050 | Python FastAPI backend |
| Rust Economy | 8890 | High-performance economy engine |
| Webhook Handler | 5051 | Stripe webhook processor |
| PostgreSQL | 5432 | Primary database |
| Redis | 6379 | Cache and sessions |
| RabbitMQ AMQP | 5672 | Message queue |
| RabbitMQ Management | 15672 | RabbitMQ admin UI |
| Temporal | 7233 | Workflow orchestration |
| Temporal UI | 8082 | Temporal dashboard |
| Prometheus | 9090 | Metrics collection |
| Grafana | 3000 | Metrics visualization |
| Traefik | 80/443 | Reverse proxy |
| Traefik Dashboard | 8080 | Traefik admin UI |

### Network Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Traefik/Ingress                      │
│                    (Reverse Proxy + HTTPS)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │Frontend │    │ Backend │    │  Rust   │
    │(Nginx)  │    │(FastAPI)│    │ Economy │
    └─────────┘    └────┬────┘    └────┬────┘
                        │              │
         ┌──────────────┼──────────────┘
         │              │
    ┌────▼────┐    ┌────▼────┐    ┌──────────┐
    │  Postgres│    │  Redis  │    │ RabbitMQ │
    │    DB    │    │  Cache  │    │  Queue   │
    └──────────┘    └─────────┘    └──────────┘
         │
    ┌────▼────┐    ┌──────────┐    ┌──────────┐
    │Temporal │    │Prometheus│    │ Grafana  │
    │Workflow │    │ Metrics  │    │Dashboard │
    └─────────┘    └──────────┘    └──────────┘
```

---

## Prerequisites

### Required Software

- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Git**: 2.30+
- **Node.js**: 18+ (for local development)
- **Python**: 3.11+ (for local development)
- **Rust**: 1.75+ (for local development)

### For Kubernetes Deployment

- **kubectl**: 1.25+
- **kustomize**: 5.0+
- **Helm**: 3.0+ (optional)
- Access to a Kubernetes cluster (Tencent TKE, GKE, EKS, AKS, or minikube)

### Environment Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/QAntum-Fortres/QANTUM-FRAMEWORK-PRIVATE.git
   cd QANTUM-FRAMEWORK-PRIVATE
   ```

2. **Create environment file**:
   ```bash
   cp .env.production .env
   ```

3. **Generate secrets**:
   ```bash
   # Generate secure token secret
   openssl rand -hex 32
   
   # Update .env with generated values
   ```

---

## Local Development

### Quick Start

```bash
# Install dependencies
npm install

# Start development services
docker-compose -f docker-compose.dev.yml up -d

# Run development servers
npm run dev
```

### Individual Services

**Frontend**:
```bash
cd Frontend
npm install
npm run dev
```

**Backend**:
```bash
cd Backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 5050
```

**Rust Economy**:
```bash
cd Backend/rust_core
cargo run
```

---

## Docker Deployment

### Using docker-compose (Recommended for Development/Testing)

1. **Configure environment**:
   ```bash
   cp .env.production .env
   # Edit .env with your configuration
   ```

2. **Start all services**:
   ```bash
   docker-compose -f docker-compose.fullstack.yml up -d
   ```

3. **View logs**:
   ```bash
   docker-compose -f docker-compose.fullstack.yml logs -f
   ```

4. **Stop services**:
   ```bash
   docker-compose -f docker-compose.fullstack.yml down
   ```

### Using Root Dockerfile

The root Dockerfile builds all components in a single multi-stage image:

```bash
# Build the mega hybrid image
docker build -t qantum-framework:latest .

# Run with supervisor managing all services
docker run -p 8080:8080 -p 5050:5050 -p 8890:8890 \
  --env-file .env \
  qantum-framework:latest
```

### Accessing Services

After deployment, access services at:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5050
- **Traefik Dashboard**: http://localhost:8080
- **RabbitMQ Management**: http://localhost:15672 (user: qantum)
- **Temporal UI**: http://localhost:8082
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (user: admin)

---

## Kubernetes Deployment

### Prerequisites

1. **Kubernetes cluster** configured and accessible via `kubectl`
2. **Container registry** access (Tencent CCR, DockerHub, etc.)
3. **Secrets configured** in cluster

### Step 1: Prepare Secrets

```bash
# Create secrets from template
cp k8s/secrets.yml.template k8s/secrets.yml

# Edit secrets.yml with base64-encoded values
# Example: echo -n "my-secret" | base64

# Apply secrets
kubectl apply -f k8s/secrets.yml
```

### Step 2: Deploy with Kustomize

```bash
# Preview deployment
kubectl kustomize k8s/

# Apply to cluster
kubectl apply -k k8s/

# Watch rollout
kubectl rollout status deployment/qantum-framework-v1
```

### Step 3: Verify Deployment

```bash
# Check pods
kubectl get pods

# Check services
kubectl get svc

# Check ingress
kubectl get ingress

# View logs
kubectl logs -l app=qantum-framework --tail=100
```

### Using the Deployment Script

The automated deployment script handles the entire process:

```bash
# Full deployment pipeline
./deploy-mega-stack.sh full

# Individual steps
./deploy-mega-stack.sh validate  # Validate environment
./deploy-mega-stack.sh build     # Build Docker image
./deploy-mega-stack.sh test      # Test with docker-compose
./deploy-mega-stack.sh push      # Push to registry
./deploy-mega-stack.sh deploy    # Deploy to Kubernetes
./deploy-mega-stack.sh rollback  # Rollback deployment
```

---

## CI/CD Pipeline

### Tencent Kubernetes Engine

The `.github/workflows/tencent.yml` workflow automatically:

1. Builds the Docker image from the root Dockerfile
2. Pushes to Tencent Container Registry
3. Deploys to TKE cluster using Kustomize
4. Waits for rollout completion
5. Runs health checks

### Required Secrets

Configure these in GitHub repository secrets:

- `TENCENT_CLOUD_SECRET_ID`
- `TENCENT_CLOUD_SECRET_KEY`
- `TENCENT_CLOUD_ACCOUNT_ID`
- `TKE_REGISTRY_PASSWORD`

### Triggering Deployment

```bash
# Push to main branch
git push origin main

# Or manually trigger
# Go to Actions → Tencent Kubernetes Engine → Run workflow
```

---

## Monitoring & Observability

### Prometheus Metrics

Access Prometheus at `http://prometheus.localhost` (Docker) or via Ingress (K8s).

**Key metrics**:
- HTTP request rates and latencies
- Database connection pool status
- Cache hit/miss ratios
- Queue depth and processing rates
- CPU and memory usage

### Grafana Dashboards

Access Grafana at `http://grafana.localhost` (Docker) or via Ingress (K8s).

**Pre-configured dashboards**:
- Application overview
- Database performance
- Cache performance
- Message queue metrics
- Infrastructure health

### Logs

**Docker Compose**:
```bash
docker-compose logs -f [service-name]
```

**Kubernetes**:
```bash
kubectl logs -f deployment/qantum-framework-v1
kubectl logs -l app=qantum-framework --tail=100
```

### Distributed Tracing

Temporal workflows provide built-in distributed tracing. Access the Temporal UI to view workflow executions and activity traces.

---

## Security

### Secret Management

1. **Never commit secrets to version control**
2. Use environment variables for all sensitive data
3. Rotate secrets regularly (recommended: 90 days)
4. Use Kubernetes Secrets or external secret managers (Vault, AWS Secrets Manager)

### Network Security

1. **Kubernetes Network Policies** restrict pod-to-pod communication
2. **Ingress TLS** terminates HTTPS at the edge
3. **Service mesh** (optional) provides mTLS between services

### RBAC

Configure Kubernetes RBAC to restrict access:

```bash
# View current permissions
kubectl auth can-i --list

# Create service account
kubectl create serviceaccount qantum-deployer
```

### Security Scanning

The deployment includes security scanning via:
- CodeQL for code vulnerabilities
- Container image scanning
- Dependency vulnerability checks

---

## Troubleshooting

### Common Issues

#### Pods in CrashLoopBackOff

```bash
# Check logs
kubectl logs <pod-name>

# Describe pod for events
kubectl describe pod <pod-name>

# Common causes:
# - Missing environment variables
# - Database connection failures
# - Insufficient resources
```

#### Service Not Accessible

```bash
# Check service
kubectl get svc

# Check endpoints
kubectl get endpoints

# Port-forward for testing
kubectl port-forward svc/qantum-framework 8080:80
```

#### Database Connection Issues

```bash
# Check PostgreSQL pod
kubectl get pod -l app=postgres

# Test connection
kubectl exec -it <postgres-pod> -- psql -U qantum_user -d qantum_db

# Check DATABASE_URL secret
kubectl get secret qantum-secrets -o yaml
```

#### Image Pull Failures

```bash
# Check image pull secret
kubectl get secret

# Create registry secret
kubectl create secret docker-registry regcred \
  --docker-server=<registry-url> \
  --docker-username=<username> \
  --docker-password=<password>
```

### Health Checks

```bash
# Test backend health
curl http://localhost:5050/health

# Test frontend
curl http://localhost:8080/

# Test Rust economy
curl http://localhost:8890/health
```

### Rollback

```bash
# Kubernetes
kubectl rollout undo deployment/qantum-framework-v1

# Using script
./deploy-mega-stack.sh rollback

# Docker Compose
docker-compose -f docker-compose.fullstack.yml down
docker-compose -f docker-compose.fullstack.yml up -d
```

---

## Advanced Configuration

### Scaling

**Horizontal Pod Autoscaling**:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: qantum-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: qantum-framework-v1
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Resource Limits

Adjust in `k8s/deployment.yml`:
```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "2Gi"
    cpu: "1000m"
```

### Custom Domain

Update `k8s/ingress.yml` with your domain:
```yaml
spec:
  tls:
  - hosts:
    - yourdomain.com
    secretName: tls-secret
  rules:
  - host: yourdomain.com
```

---

## Support & Documentation

- **Architecture Docs**: See `ARCHITECTURE_FULLSTACK.md`
- **API Documentation**: See `docs/api/`
- **Contributing**: See `CONTRIBUTING.md`
- **Issues**: https://github.com/QAntum-Fortres/QANTUM-FRAMEWORK-PRIVATE/issues

---

## Philosophy

> **Together with logic, we are invincible. We build only eternal foundations.**

The QANTUM Framework embodies principles of:
- **Autonomy**: Self-healing and self-scaling
- **Cognition**: Intelligent routing and resource management
- **Sovereignty**: Independent and resilient
- **Meta-logic**: Transcendent architecture patterns
- **Logos/Aristotelian**: Perfect logical structure

---

*Last Updated: 2026-01-31*
*Version: 1.0.0*
