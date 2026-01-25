# QANTUM Wealth Bridge - Quick Start Guide

## 🚀 What is Wealth Bridge?

The **Wealth Bridge** is the critical infrastructure that connects traditional fiat payments (via Stripe) to QANTUM's digital economy system. It enables:

- **Automated Payment Processing**: Stripe webhooks → Rust Economy credit minting
- **Real-Time System Telemetry**: CPU, RAM, and transaction monitoring
- **Subscription Tiers**: Three levels (Singularity, Aeterna, Vortex)
- **Micro-SaaS Modules**: Starting with SEO Audit service
- **Premium UI**: Glassmorphism design with zero-entropy transitions

## 📦 Components

| Component | Technology | Port | Description |
|-----------|-----------|------|-------------|
| **Rust Economy Server** | Rust (Actix-web) | 8890 | Credit management, module unlocking, telemetry |
| **Webhook Handler** | Python (Flask) | 5051 | Stripe payment processing, wealth bridge |
| **Main Backend** | Python (Flask) | 5050 | Certificate generation, checkout sessions |
| **SEO Audit Module** | Python (Flask) | 8091 | Automated website SEO analysis |
| **Frontend Dashboard** | React + Vite | 5173 | User interface with real-time metrics |

## 🏃 Quick Start

### Prerequisites

- **Rust** (1.70+)
- **Python** (3.9+)
- **Node.js** (18+)
- **npm** (9+)

### 1. One-Command Startup

```bash
./scripts/start_wealth_bridge.sh
```

This script will:
1. Build the Rust economy server
2. Install Python dependencies
3. Install Frontend dependencies
4. Start all 5 services
5. Display service URLs and test commands

### 2. Access the Dashboard

Open your browser to: **http://localhost:5173**

You'll see:
- **System Pulse**: Real-time CPU/RAM/transaction metrics
- **Pricing Cards**: Three subscription tiers
- **Glassmorphism UI**: Premium design with smooth animations

### 3. Test the System

```bash
./scripts/test_wealth_bridge.sh
```

This runs integration tests for all components.

### 4. Manual Testing

**Test Telemetry:**
```bash
curl http://localhost:8890/api/telemetry | jq
```

**Simulate a Payment:**
```bash
curl -X POST http://localhost:5051/webhook/test \
  -H 'Content-Type: application/json' \
  -d '{"user_id": "test@example.com", "tier": "aeterna"}' | jq
```

**Check User Balance:**
```bash
curl 'http://localhost:8890/api/balance?user_id=test@example.com' | jq
```

**Run SEO Audit:**
```bash
curl -X POST http://localhost:8091/api/audit \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com"}' | jq
```

### 5. Stop All Services

```bash
./scripts/stop_wealth_bridge.sh
```

## 🔧 Manual Setup (Advanced)

If you prefer to start services individually:

### Rust Economy Server
```bash
cd Backend/rust_core
cargo run --release --bin lwas_economy
```

### Webhook Handler
```bash
cd Backend
python3 stripe_webhook_handler.py
```

### Main Backend
```bash
cd Backend
python3 OmniCore_Scribe.py
```

### SEO Audit Module
```bash
cd micro-saas/seo-audit-module
python3 app.py
```

### Frontend
```bash
cd Frontend
npm run dev
```

## 🔑 Environment Variables

Create `.env` files in the appropriate directories:

**Backend/.env:**
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RUST_ECONOMY_URL=http://localhost:8890

# Stripe Price IDs (from Dashboard)
STRIPE_PRICE_SINGULARITY=price_...
STRIPE_PRICE_AETERNA=price_...
STRIPE_PRICE_VORTEX=price_...
```

**Frontend/.env:**
```bash
VITE_BACKEND_URL=http://localhost:5050
VITE_RUST_ECONOMY_URL=http://localhost:8890
```

## 💳 Subscription Tiers

| Tier | Price | Credits | Features |
|------|-------|---------|----------|
| **Singularity** | $29/mo | 100 | Basic analytics, community support, real-time telemetry |
| **Aeterna** | $99/mo | 500 | + Advanced arbitrage, AI insights, priority support |
| **Vortex** | $299/mo | 2000 | + Enterprise support, custom integrations, white-label |

## 📡 API Endpoints

### Rust Economy Server (Port 8890)

- `GET /health` - Health check
- `GET /api/telemetry` - System metrics (CPU, RAM, transactions)
- `GET /api/balance?user_id=X` - Get user balance
- `GET /api/balances` - List all balances
- `POST /api/mint_credits` - Mint credits for user
- `POST /api/unlock_module` - Unlock module for user

### Webhook Handler (Port 5051)

- `GET /health` - Health check
- `POST /webhook/stripe` - Stripe webhook endpoint
- `POST /webhook/test` - Test endpoint (mock payment)

### SEO Audit Module (Port 8091)

- `GET /health` - Health check
- `POST /api/audit` - Audit single URL
- `POST /api/batch-audit` - Audit multiple URLs

## 🎨 Frontend Components

### SystemPulse Component
```typescript
import { SystemPulse } from './components/SystemPulse/SystemPulse';

<SystemPulse />
```

Shows real-time:
- CPU load percentage
- RAM usage (GB and %)
- Temperature (if available)
- Active transaction count

### PricingCards Component
```typescript
import { PricingCards } from './components/PricingCards/PricingCards';

<PricingCards />
```

Displays three subscription tiers with:
- Glassmorphism design
- Hover animations
- Stripe Checkout integration
- Email collection

### API Service
```typescript
import { apiService } from './services/apiService';

// Get telemetry
const metrics = await apiService.getTelemetry();

// Get balance
const balance = await apiService.getBalance('user@example.com');

// Create checkout
const session = await apiService.createCheckoutSession(
  'aeterna',
  'user@example.com'
);
```

## 🐳 Docker Deployment

### SEO Audit Module
```bash
cd micro-saas/seo-audit-module
docker build -t seo-audit-module .
docker run -p 8091:8091 seo-audit-module
```

### Cloud Run (Google Cloud)
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/seo-audit-module
gcloud run deploy seo-audit-module \
  --image gcr.io/PROJECT_ID/seo-audit-module \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 📚 Documentation

- **[WEALTH_BRIDGE_README.md](WEALTH_BRIDGE_README.md)** - Complete architecture guide
- **[micro-saas/seo-audit-module/README.md](micro-saas/seo-audit-module/README.md)** - SEO module docs

## 🔐 Security Notes

1. **Never commit secrets** to version control
2. **Use HTTPS** in production
3. **Verify Stripe webhooks** with signatures
4. **Configure CORS** properly
5. **Implement rate limiting** on all APIs
6. **Validate all inputs** before processing

## 🚢 Production Deployment Checklist

- [ ] Set up Stripe webhook URL in Stripe Dashboard
- [ ] Configure all environment variables
- [ ] Enable webhook signature verification
- [ ] Use HTTPS for all endpoints
- [ ] Set up monitoring and logging
- [ ] Configure database for persistent storage
- [ ] Implement backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Load test all endpoints
- [ ] Security audit

## 🆘 Troubleshooting

**Services won't start:**
- Check if ports are already in use: `lsof -i :8890`
- Review logs in `./logs/` directory
- Ensure all dependencies are installed

**Rust compilation errors:**
- Update Rust: `rustup update`
- Clear cache: `cargo clean`
- Rebuild: `cargo build --release`

**Frontend build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

**Payment webhook not working:**
- Verify Stripe webhook secret is set
- Check webhook URL in Stripe Dashboard
- Review webhook handler logs

## 🤝 Contributing

This is a private repository. For questions or issues, contact the development team.

## 📄 License

Proprietary - All Rights Reserved

---

**Built with ❤️ by the QANTUM Team**

*"Where fiat flows into digital sovereignty"* 🌉
