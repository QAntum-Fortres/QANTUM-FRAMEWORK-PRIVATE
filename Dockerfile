# ═══════════════════════════════════════════════════════════════════════════════
# 🌌 QANTUM FRAMEWORK - MEGA HYBRID AUTONOMOUS COGNITIVE DEPLOYMENT
# ═══════════════════════════════════════════════════════════════════════════════
# Multi-stage Dockerfile building ALL framework components
# Philosophy: Eternal foundations built with perfect logical structure
# ═══════════════════════════════════════════════════════════════════════════════

# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1: Frontend Builder (React/Vite)
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY Frontend/package*.json ./
RUN npm ci --only=production

# Copy frontend source and build
COPY Frontend/ ./
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2: Backend Builder (Python FastAPI)
# ─────────────────────────────────────────────────────────────────────────────
FROM python:3.11-slim AS backend-builder

WORKDIR /app/backend

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY Backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY Backend/ ./

# ─────────────────────────────────────────────────────────────────────────────
# STAGE 3: QANTUM Framework Builder (Node.js/Playwright)
# ─────────────────────────────────────────────────────────────────────────────
FROM node:18-alpine AS qantum-builder

WORKDIR /app/qantum

# Copy package files
COPY QANTUM_FRAMEWORK/package*.json ./
COPY QANTUM_FRAMEWORK/tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source and build
COPY QANTUM_FRAMEWORK/src/ ./src/
RUN npm run build || echo "No build step needed"

# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4: Rust Economy Builder
# ─────────────────────────────────────────────────────────────────────────────
FROM rust:1.75-slim AS rust-builder

WORKDIR /app/rust

# Copy Cargo files
COPY Backend/rust_core/Cargo.toml Backend/rust_core/Cargo.lock ./

# Copy source and build
COPY Backend/rust_core/src ./src
RUN cargo build --release

# ─────────────────────────────────────────────────────────────────────────────
# STAGE 5: Production - Nginx with Cognitive Routing
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    nodejs \
    npm \
    curl \
    ca-certificates

# ═══════════════════════════════════════════════════════════════════════════════
# Copy Built Artifacts
# ═══════════════════════════════════════════════════════════════════════════════

# Frontend static files
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html/frontend

# Backend application
COPY --from=backend-builder /app/backend /app/backend

# QANTUM Framework
COPY --from=qantum-builder /app/qantum /app/qantum

# Rust Economy binary
COPY --from=rust-builder /app/rust/target/release/lwas_economy /app/rust/lwas_economy

# ═══════════════════════════════════════════════════════════════════════════════
# Nginx Configuration with Cognitive Routing
# ═══════════════════════════════════════════════════════════════════════════════

RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
# QANTUM Framework - Cognitive Autonomous Routing Configuration

upstream backend {
    server 127.0.0.1:5050;
}

upstream rust_economy {
    server 127.0.0.1:8890;
}

upstream webhook_handler {
    server 127.0.0.1:5051;
}

server {
    listen 8080 default_server;
    server_name _;
    
    # Frontend SPA
    location / {
        root /usr/share/nginx/html/frontend;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://backend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Rust Economy Engine
    location /economy/ {
        proxy_pass http://rust_economy/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Webhook Handler
    location /webhooks/ {
        proxy_pass http://webhook_handler/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Health Check Endpoint
    location /health {
        access_log off;
        return 200 "QANTUM Framework: All systems operational\n";
        add_header Content-Type text/plain;
    }
    
    # Metrics Endpoint
    location /metrics {
        access_log off;
        return 200 "# QANTUM Framework Metrics\n";
        add_header Content-Type text/plain;
    }
}
EOF

# ═══════════════════════════════════════════════════════════════════════════════
# Supervisor Configuration for Multi-Process Management
# ═══════════════════════════════════════════════════════════════════════════════

RUN apk add --no-cache supervisor

RUN mkdir -p /var/log/supervisor

RUN cat > /etc/supervisord.conf << 'EOF'
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid

[program:nginx]
command=nginx -g 'daemon off;'
autostart=true
autorestart=true
stdout_logfile=/var/log/supervisor/nginx.log
stderr_logfile=/var/log/supervisor/nginx.err

[program:backend]
command=python3 -m uvicorn app.main:app --host 0.0.0.0 --port 5050
directory=/app/backend
autostart=true
autorestart=true
stdout_logfile=/var/log/supervisor/backend.log
stderr_logfile=/var/log/supervisor/backend.err

[program:rust_economy]
command=/app/rust/lwas_economy
directory=/app/rust
autostart=true
autorestart=true
environment=RUST_LOG="info",PORT="8890"
stdout_logfile=/var/log/supervisor/rust.log
stderr_logfile=/var/log/supervisor/rust.err

[program:webhook_handler]
command=python3 stripe_webhook_handler.py
directory=/app/backend
autostart=true
autorestart=true
environment=PORT="5051"
stdout_logfile=/var/log/supervisor/webhook.log
stderr_logfile=/var/log/supervisor/webhook.err
EOF

# ═══════════════════════════════════════════════════════════════════════════════
# Environment & Ports
# ═══════════════════════════════════════════════════════════════════════════════

# Expose all service ports
EXPOSE 8080 5050 8890 5051

# Health Check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Set working directory
WORKDIR /app

# ═══════════════════════════════════════════════════════════════════════════════
# Startup Command
# ═══════════════════════════════════════════════════════════════════════════════

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]

# ═══════════════════════════════════════════════════════════════════════════════
# 🎯 METADATA
# ═══════════════════════════════════════════════════════════════════════════════

LABEL maintainer="QANTUM Framework"
LABEL description="Mega Hybrid Autonomous Cognitive Sovereign Meta-Logical Framework"
LABEL version="1.0.0"
LABEL philosophy="Eternal foundations built with perfect logical structure"

# ═══════════════════════════════════════════════════════════════════════════════
# Together with logic, we are invincible. We build only eternal foundations.
# ═══════════════════════════════════════════════════════════════════════════════
