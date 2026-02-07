# 🌌 QANTUM FRAMEWORK

> **Together with logic, we are invincible. We build only eternal foundations.**

The QANTUM Framework is a **mega hybrid autonomous cognitive sovereign meta-logical framework** — a comprehensive full-stack platform combining cutting-edge technologies with timeless architectural principles.

## 🚀 Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### One-Command Deployment

```bash
# Clone and deploy
git clone https://github.com/QAntum-Fortres/QANTUM-FRAMEWORK-PRIVATE.git
cd QANTUM-FRAMEWORK-PRIVATE
cp .env.production .env
# Edit .env with your configuration
docker-compose -f docker-compose.fullstack.yml up -d
```

Access the application:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5050
- **Grafana Dashboard**: http://localhost:3000
- **RabbitMQ Management**: http://localhost:15672
- **Temporal UI**: http://localhost:8082

### Automated Deployment Script

```bash
# Full deployment pipeline
./deploy-mega-stack.sh full

# Or individual steps
./deploy-mega-stack.sh validate  # Validate environment
./deploy-mega-stack.sh build     # Build Docker image
./deploy-mega-stack.sh test      # Test with docker-compose
./deploy-mega-stack.sh deploy    # Deploy to Kubernetes
```

## 📚 Documentation

- **[Deployment Guide](DEPLOYMENT_UNIFIED.md)** - Complete deployment instructions
- **[Architecture](ARCHITECTURE_FULLSTACK.md)** - System architecture and design
- **[API Documentation](docs/api/)** - API reference
- **[Getting Started](GETTING_STARTED.md)** - Development guide

## 🏗️ Architecture

### Core Components

- **Frontend**: React/Vite SPA with TypeScript
- **Backend**: Python FastAPI REST API
- **Rust Economy**: High-performance transaction engine
- **QANTUM Framework**: Node.js/Playwright QA automation
- **PostgreSQL**: Primary database
- **Redis**: Cache and sessions
- **RabbitMQ**: Message queue
- **Temporal**: Workflow orchestration
- **Prometheus + Grafana**: Monitoring and observability

### Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 8080 | React/Vite application |
| Backend | 5050 | FastAPI REST API |
| Rust Economy | 8890 | Transaction engine |
| Webhook Handler | 5051 | Stripe webhooks |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache |
| RabbitMQ | 5672/15672 | Message queue |
| Temporal | 7233 | Workflow engine |
| Prometheus | 9090 | Metrics |
| Grafana | 3000 | Dashboards |

## 🔧 Development

### Local Development Setup

```bash
# Install dependencies
npm install
pip install -r requirements.txt

# Start development services
docker-compose -f docker-compose.dev.yml up -d

# Run individual services
cd Frontend && npm run dev      # Frontend
cd Backend && uvicorn app.main:app --reload  # Backend
cd Backend/rust_core && cargo run  # Rust Economy
```

### Running Tests

```bash
# Frontend tests
cd Frontend && npm test

# Backend tests
cd Backend && pytest

# Integration tests
./run-integration-tests.sh
```

## 🚢 Deployment

### Docker Deployment

```bash
# Build root Dockerfile (all components)
docker build -t qantum-framework:latest .

# Run with docker-compose
docker-compose -f docker-compose.fullstack.yml up -d
```

### Kubernetes Deployment

```bash
# Create secrets
cp k8s/secrets.yml.template k8s/secrets.yml
# Edit secrets.yml with your values
kubectl apply -f k8s/secrets.yml

# Deploy with Kustomize
kubectl apply -k k8s/

# Monitor deployment
kubectl rollout status deployment/qantum-framework-v1
kubectl get pods
```

### CI/CD Pipeline

The GitHub Actions workflow automatically:
1. Builds the Docker image
2. Pushes to container registry
3. Deploys to Kubernetes cluster
4. Runs health checks

Triggers on push to `main` branch.

## 🛠️ Technology Stack

### Frontend
- React 18+ with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Query for server state

### Backend
- Python 3.11+ with FastAPI
- SQLAlchemy ORM
- Pydantic validation
- Uvicorn ASGI server

### Infrastructure
- PostgreSQL 15 database
- Redis 7 cache
- RabbitMQ 3.12 message queue
- Temporal.io workflows
- Prometheus + Grafana monitoring
- Traefik reverse proxy

### DevOps
- Docker multi-stage builds
- Kubernetes with Kustomize
- GitHub Actions CI/CD
- Automated testing and deployment

## 🔐 Security

- TLS/HTTPS encryption
- JWT authentication
- RBAC authorization
- Secrets management
- Rate limiting
- CORS protection
- SQL injection prevention
- XSS protection

See [Security Guide](docs/SECURITY.md) for details.

## 📊 Monitoring

- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **Temporal UI**: Workflow monitoring
- **RabbitMQ Management**: Queue monitoring
- **Health checks**: Automated health monitoring

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

See [LICENSE](LICENSE) for details.

## 🌟 Philosophy

The QANTUM Framework embodies principles of:

- **Autonomy**: Self-healing and self-scaling systems
- **Cognition**: Intelligent routing and resource management
- **Sovereignty**: Independent and resilient architecture
- **Meta-logic**: Transcendent design patterns
- **Logos**: Perfect logical structure (Aristotelian)

> **Together with logic, we are invincible. We build only eternal foundations.**

## 📞 Support

- **Documentation**: See `docs/` directory
- **Issues**: https://github.com/QAntum-Fortres/QANTUM-FRAMEWORK-PRIVATE/issues
- **Discussions**: https://github.com/QAntum-Fortres/QANTUM-FRAMEWORK-PRIVATE/discussions

---

## Legacy Components

The repository also contains legacy components from earlier iterations:

### Structure
```
QANTUM-FRAMEWORK-PRIVATE/
├── Dockerfile                    # [NEW] Root multi-stage Dockerfile
├── docker-compose.fullstack.yml  # [NEW] Complete stack
├── k8s/                          # [NEW] Kubernetes manifests
├── deploy-mega-stack.sh          # [NEW] Deployment orchestrator
├── DEPLOYMENT_UNIFIED.md         # [NEW] Deployment guide
├── ARCHITECTURE_FULLSTACK.md     # [NEW] Architecture docs
│
├── Frontend/                     # React/Vite SPA
├── Backend/                      # Python FastAPI + Rust
├── QANTUM_FRAMEWORK/             # QA automation platform
│
├── AETERNAAA/                    # Legacy cloud-native ecosystem
├── OmniCore.py                   # Legacy orchestrator
├── Ledger.py                     # Legacy blockchain
└── README.md                     # This file
```

---

*Version: 1.0.0*
*Last Updated: 2026-01-31*

