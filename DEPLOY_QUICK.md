# 🚀 Quick Deploy - QANTUM Framework Fullstack

## One-Command Deployment

```bash
# 1. Setup environment
cp .env.deployment .env
nano .env  # Update with your credentials

# 2. Deploy everything
./deploy.sh start

# 3. Check health
./health-check.sh
```

## Instant Access

After deployment, access these URLs:

| Service | URL | Description |
|---------|-----|-------------|
| 🎨 **Frontend** | http://localhost:8080 | Main application dashboard |
| 📊 **Dashboard** | http://localhost:8081 | General purpose dashboard |
| 🔧 **Backend API** | http://localhost:5050 | REST API endpoints |
| 💰 **Economy** | http://localhost:8890 | Credit & telemetry service |
| 📈 **Grafana** | http://localhost:3000 | Monitoring (admin/your_password) |
| ⚙️ **Temporal** | http://localhost:8082 | Workflow management |
| 📊 **Prometheus** | http://localhost:9090 | Metrics collection |

## Essential Commands

```bash
# View all services status
./deploy.sh status

# View logs (all services)
./deploy.sh logs

# View logs (specific service)
./deploy.sh logs backend

# Restart everything
./deploy.sh restart

# Stop all services
./deploy.sh stop

# Remove everything (including data)
./deploy.sh clean
```

## What Gets Deployed?

### Core Services (6)
- ✅ React/Vite Frontend
- ✅ Python Backend API
- ✅ Rust Economy Server
- ✅ Webhook Handler (Stripe)
- ✅ SEO Audit Module
- ✅ Static HTML Dashboard

### Infrastructure (6)
- ✅ PostgreSQL Database
- ✅ Redis Cache
- ✅ Temporal Workflow Engine
- ✅ Temporal UI
- ✅ Prometheus Monitoring
- ✅ Grafana Visualization

## Quick Troubleshooting

### Services won't start?
```bash
# Check if ports are available
lsof -i :8080
lsof -i :5050

# Clear everything and restart
./deploy.sh clean
./deploy.sh start
```

### Need logs?
```bash
# All services
./deploy.sh logs

# Specific service
./deploy.sh logs postgres
```

### Check what's running
```bash
./deploy.sh status
./health-check.sh
```

## Minimum Requirements

- Docker 20.10+
- Docker Compose 2.0+
- 8GB RAM (16GB recommended)
- 20GB disk space
- 4 CPU cores (8 recommended)

## Full Documentation

For complete deployment guide, architecture details, and production setup:

📖 **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide

---

**Need Help?**
1. Check `./deploy.sh help`
2. Review [DEPLOYMENT.md](DEPLOYMENT.md)
3. Contact the development team

---

*Deploy in 3 commands. Monitor in 1 dashboard.* 🎯
