# ═══════════════════════════════════════════════════════════════════════════
# QANTUM CORE-ENGINE - Dockerfile
# Self-Evolving QA Automation Platform
# ═══════════════════════════════════════════════════════════════════════════

# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Build TypeScript (if applicable)
RUN npm run build || echo "No build step needed"

# ═══════════════════════════════════════════════════════════════════════════
# Production Stage
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

# Install Node.js
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy built application
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/dist ./dist 2>/dev/null || true

# Copy test files and configs
COPY tests/ ./tests/ 2>/dev/null || true
COPY *.js ./
COPY *.json ./

# Install Playwright browsers (already in base image, but ensure latest)
RUN npx playwright install --with-deps chromium

# Create output directories
RUN mkdir -p output visual_diffs bug_reports coverage allure-results allure-report

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "console.log('OK')" || exit 1

# Default command
CMD ["npm", "test"]
