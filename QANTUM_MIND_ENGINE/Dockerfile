# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║           🧠 QANTUM v26.0.0 - Enterprise Docker Image                   ║
# ║           Hybrid Automation Engine: Cypress + Playwright + Selenium          ║
# ╚══════════════════════════════════════════════════════════════════════════════╝
#
# One-Click Deployment:
#   docker pull QAntum/mind-engine-core:latest
#   docker run -p 3000:3000 QAntum/mind-engine-core
#
# Build locally:
#   docker build -t qantum .
#   docker run -p 3000:3000 qantum
#
# ════════════════════════════════════════════════════════════════════════════════

# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy source files
COPY src/ ./src/
COPY public/ ./public/

# Build TypeScript
RUN npm run build

# ════════════════════════════════════════════════════════════════════════════════
# Stage 2: Production
# ════════════════════════════════════════════════════════════════════════════════
FROM node:20-slim AS production

# Metadata
LABEL maintainer="QANTUM Team <enterprise@QAntum.ai>"
LABEL version="26.0.0"
LABEL description="Enterprise Test Automation Platform with AI Self-Healing"

# Install browser dependencies for Playwright
RUN apt-get update && apt-get install -y \
    # Chromium dependencies
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    # Firefox dependencies
    libdbus-glib-1-2 \
    libxt6 \
    # General
    fonts-liberation \
    fonts-noto-color-emoji \
    xdg-utils \
    wget \
    ca-certificates \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -r QAntum && useradd -r -g QAntum QAntum

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Install Playwright browsers
RUN npx playwright install chromium firefox webkit

# Create directories for outputs
RUN mkdir -p reports screenshots videos traces logs \
    && chown -R QAntum:QAntum /app

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV MIND_ENGINE_VERSION=26.0.0
ENV PLAYWRIGHT_BROWSERS_PATH=/app/.cache/ms-playwright

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Switch to non-root user
USER QAntum

# Expose port
EXPOSE 3000

# Default command
CMD ["node", "dist/start-server.js"]

# ════════════════════════════════════════════════════════════════════════════════
# Alternative entry points:
# ════════════════════════════════════════════════════════════════════════════════
# Run tests:
#   docker run qantum node dist/runner.js
#
# Run CLI:
#   docker run -it qantum node src/cli/hacker-cli.js test
#
# Generate report:
#   docker run -v $(pwd)/reports:/app/reports qantum node dist/reports/pdf-generator.js
# ════════════════════════════════════════════════════════════════════════════════
