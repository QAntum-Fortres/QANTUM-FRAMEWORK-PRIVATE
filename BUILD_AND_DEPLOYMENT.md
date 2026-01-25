# MEGA-HYBRID Build & Deployment Guide
# Step-by-Step Instructions for Enterprise Deployment

## Quick Start - Local Development

### 1. Prerequisites Check

```bash
# Check Rust installation
rustc --version  # Should be 1.92.0+
cargo --version  # Should be 1.92.0+

# Check Python installation
python --version  # Should be 3.9+
pip --version

# Check Node.js installation
node --version   # Should be 18.0+
npm --version
```

### 2. Build All Rust Modules

```bash
# Navigate to project root
cd /path/to/QANTUM-FRAMEWORK-PRIVATE

# Build entire workspace (includes all modules)
cargo build --workspace

# For production-optimized builds:
cargo build --workspace --release
```

**Expected Output:**
```
   Compiling lwas_core v1.0.0
   Compiling lwas_economy v1.0.0
   Compiling lwas_telemetry_reporter v1.0.0
   Compiling rust_core v0.1.0
   Compiling veritas_core v0.1.0
    Finished `dev` profile [unoptimized + debuginfo] target(s)
```

### 3. Test Individual Modules

#### Test LwaS Core (Compiler)
```bash
cd src/rust_mojo_core
cargo test
# Should see: test result: ok. 3 passed
```

#### Test LwaS Economy
```bash
cd src/rust_mojo_economy
cargo test
# Should see: test result: ok. 3 passed
```

#### Test LwaS Telemetry
```bash
cd src/rust_mojo_telemetry
cargo test
# Should see: test result: ok. 4 passed
```

### 4. Start Services

#### Start Economy Server (Port 8891)
```bash
cd src/rust_mojo_economy
cargo run --bin economy_server

# Expected output:
# 🚀 LwaS Economy Server Starting...
# 📊 Real-time Equity & Profitability Calculation Engine
# 🌐 Server will listen on http://127.0.0.1:8891
```

Test it:
```bash
curl http://127.0.0.1:8891/health
# {"status":"healthy","service":"lwas_economy","version":"1.0.0"}
```

#### Start Telemetry Server (Port 8890)
```bash
cd src/rust_mojo_telemetry
cargo run --bin telemetry_reporter

# Expected output:
# 👁️  LwaS Telemetry Reporter - The Eye of Sauron
# 📡 Real-time System & Market Monitoring
# 🌐 Server will listen on http://127.0.0.1:8890
```

Test it:
```bash
curl http://127.0.0.1:8890/health
# {"status":"watching","service":"lwas_telemetry_reporter",...}
```

### 5. Setup Python Backend

```bash
cd Backend

# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp ../.env.example .env
# Edit .env and add your Stripe keys

# Start OmniCore
python OmniCore.py
```

---

## Production Deployment

### Docker Deployment

#### 1. Build Docker Images

**Economy Server:**
```dockerfile
# Dockerfile.economy
FROM rust:1.92 as builder
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY Backend ./Backend
COPY veritas_core ./veritas_core
RUN cargo build --release -p lwas_economy

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/economy_server /usr/local/bin/
EXPOSE 8891
CMD ["economy_server"]
```

Build and run:
```bash
docker build -f Dockerfile.economy -t qantum/economy-server:1.0.0 .
docker run -p 8891:8891 qantum/economy-server:1.0.0
```

**Telemetry Server:**
```dockerfile
# Dockerfile.telemetry
FROM rust:1.92 as builder
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY Backend ./Backend
COPY veritas_core ./veritas_core
RUN cargo build --release -p lwas_telemetry_reporter

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/telemetry_reporter /usr/local/bin/
EXPOSE 8890
CMD ["telemetry_reporter"]
```

Build and run:
```bash
docker build -f Dockerfile.telemetry -t qantum/telemetry-reporter:1.0.0 .
docker run -p 8890:8890 qantum/telemetry-reporter:1.0.0
```

#### 2. Docker Compose (Complete Stack)

```yaml
# docker-compose.yml
version: '3.8'

services:
  economy:
    image: qantum/economy-server:1.0.0
    ports:
      - "8891:8891"
    environment:
      - RUST_LOG=info
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8891/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  telemetry:
    image: qantum/telemetry-reporter:1.0.0
    ports:
      - "8890:8890"
    environment:
      - RUST_LOG=info
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8890/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    build:
      context: .
      dockerfile: Backend/Dockerfile
    ports:
      - "8000:8000"
    environment:
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - economy
      - telemetry
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=qantum
      - POSTGRES_USER=qantum
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

Start the stack:
```bash
docker-compose up -d
```

### Kubernetes Deployment

#### 1. Create Namespace
```bash
kubectl create namespace qantum-production
```

#### 2. Deploy Economy Server

```yaml
# k8s/economy-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: economy-server
  namespace: qantum-production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: economy-server
  template:
    metadata:
      labels:
        app: economy-server
    spec:
      containers:
      - name: economy
        image: qantum/economy-server:1.0.0
        ports:
        - containerPort: 8891
        env:
        - name: RUST_LOG
          value: "info"
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8891
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 8891
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: economy-service
  namespace: qantum-production
spec:
  selector:
    app: economy-server
  ports:
  - protocol: TCP
    port: 8891
    targetPort: 8891
  type: ClusterIP
```

Apply:
```bash
kubectl apply -f k8s/economy-deployment.yaml
```

#### 3. Deploy Telemetry Server

```yaml
# k8s/telemetry-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: telemetry-reporter
  namespace: qantum-production
spec:
  replicas: 2
  selector:
    matchLabels:
      app: telemetry-reporter
  template:
    metadata:
      labels:
        app: telemetry-reporter
    spec:
      containers:
      - name: telemetry
        image: qantum/telemetry-reporter:1.0.0
        ports:
        - containerPort: 8890
        env:
        - name: RUST_LOG
          value: "info"
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8890
          initialDelaySeconds: 10
          periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: telemetry-service
  namespace: qantum-production
spec:
  selector:
    app: telemetry-reporter
  ports:
  - protocol: TCP
    port: 8890
    targetPort: 8890
  type: ClusterIP
```

Apply:
```bash
kubectl apply -f k8s/telemetry-deployment.yaml
```

---

## Testing the Deployment

### 1. Health Checks

```bash
# Economy Server
curl http://localhost:8891/health

# Telemetry Server
curl http://localhost:8890/health

# Expected: {"status": "healthy", ...}
```

### 2. Functional Tests

#### Test Economy API
```bash
# Get current equity
curl http://localhost:8891/equity

# Record a transaction
curl -X POST http://localhost:8891/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_tx_001",
    "amount": 100.0,
    "currency": "USD",
    "timestamp": "2026-01-25T02:52:48.340Z",
    "tx_type": "Payment",
    "metadata": {}
  }'

# Check updated equity
curl http://localhost:8891/equity
# Should show increased equity
```

#### Test Telemetry API
```bash
# Get system metrics
curl http://localhost:8890/system

# Get full report
curl http://localhost:8890/report

# Record market data
curl -X POST http://localhost:8890/market \
  -H "Content-Type: application/json" \
  -d '{
    "market_id": "BTC/USD",
    "price": 50000.0,
    "volume": 1000.0,
    "volatility": 15.0,
    "timestamp": "2026-01-25T02:52:48.340Z"
  }'
```

### 3. Load Testing

```bash
# Install Apache Bench (if not installed)
# Ubuntu: sudo apt-get install apache2-utils
# Mac: brew install ab

# Test Economy Server (100 requests, 10 concurrent)
ab -n 100 -c 10 http://localhost:8891/equity

# Test Telemetry Server
ab -n 100 -c 10 http://localhost:8890/system
```

---

## Monitoring Setup

### 1. Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'economy-server'
    static_configs:
      - targets: ['localhost:8891']
    metrics_path: /metrics

  - job_name: 'telemetry-reporter'
    static_configs:
      - targets: ['localhost:8890']
    metrics_path: /metrics
```

### 2. Grafana Dashboards

Import pre-built dashboards:
- Economy Metrics Dashboard (ID: 1001)
- System Telemetry Dashboard (ID: 1002)

---

## Troubleshooting

### Build Issues

**Problem:** Cargo build fails with dependency errors
```bash
# Solution: Clean and rebuild
cargo clean
cargo update
cargo build --workspace
```

**Problem:** Missing dependencies
```bash
# Solution: Install system dependencies
# Ubuntu/Debian:
sudo apt-get install build-essential pkg-config libssl-dev

# MacOS:
brew install openssl pkg-config
```

### Runtime Issues

**Problem:** Port already in use
```bash
# Find process using port
lsof -i :8891  # For economy server
lsof -i :8890  # For telemetry server

# Kill process
kill -9 <PID>
```

**Problem:** Permission denied
```bash
# Solution: Run with proper permissions
chmod +x target/release/economy_server
chmod +x target/release/telemetry_reporter
```

### Performance Issues

**Problem:** High CPU usage
```bash
# Check system resources
cargo run --release  # Always use release mode in production

# Profile the application
cargo flamegraph --bin economy_server
```

---

## Maintenance

### Regular Tasks

#### Daily
- Check service health
- Review error logs
- Monitor resource usage

#### Weekly
- Review security updates
- Update dependencies
- Backup verification

#### Monthly
- Security audit
- Performance review
- Capacity planning

### Updating the System

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild
cargo build --workspace --release

# 3. Run tests
cargo test --workspace

# 4. Restart services
systemctl restart economy-server
systemctl restart telemetry-reporter

# 5. Verify health
curl http://localhost:8891/health
curl http://localhost:8890/health
```

---

## Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] TLS/HTTPS enabled for production
- [ ] Firewall rules configured
- [ ] Regular security updates applied
- [ ] Audit logs enabled
- [ ] Backup system tested
- [ ] Monitoring and alerting active
- [ ] Access control configured
- [ ] Rate limiting enabled
- [ ] DDoS protection active

---

## Performance Benchmarks

### Expected Performance (Release Build)

**Economy Server:**
- Equity calculation: < 1ms
- Transaction processing: < 5ms
- API response time (p95): < 50ms
- Throughput: > 1000 req/sec

**Telemetry Server:**
- System metrics collection: < 10ms
- Report generation: < 100ms
- API response time (p95): < 30ms
- Throughput: > 2000 req/sec

### Optimization Tips

1. **Always use release builds in production**
   ```bash
   cargo build --release
   ```

2. **Enable CPU-specific optimizations**
   ```toml
   # .cargo/config.toml
   [target.'cfg(target_arch = "x86_64")']
   rustflags = ["-C", "target-cpu=native"]
   ```

3. **Use connection pooling**
   - Configure pool size based on load
   - Monitor connection usage

4. **Enable caching**
   - Redis for frequently accessed data
   - In-memory cache for hot paths

---

## Success Criteria

Your deployment is successful when:

✅ All Rust modules compile without errors  
✅ All tests pass  
✅ Services start and respond to health checks  
✅ APIs return correct data  
✅ Monitoring shows healthy metrics  
✅ Load tests pass performance benchmarks  
✅ Security scans show no critical issues  
✅ Backup and recovery procedures tested  

---

**THE MEGA-HYBRID IS READY FOR IGNITION!** 🚀

For detailed architecture and component documentation, see:
- [MEGA_HYBRID_DOCUMENTATION.md](MEGA_HYBRID_DOCUMENTATION.md)
- [src/omni_core/README.md](src/omni_core/README.md)
- [src/nerve-center/ARCHITECTURE_OF_TRUTH.md](src/nerve-center/ARCHITECTURE_OF_TRUTH.md)
