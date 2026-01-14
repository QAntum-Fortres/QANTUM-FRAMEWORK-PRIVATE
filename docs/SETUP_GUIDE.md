# 🚀 VORTEX GENESIS - LIVE OPERATIONS SETUP GUIDE

## ═══════════════════════════════════════════════════════════════════════════════

## 🎯 MISSION: TRANSITION FROM ARCHITECTURE TO BATTLE-READY OPERATIONS

## ═══════════════════════════════════════════════════════════════════════════════

This guide provides step-by-step instructions for deploying the VORTEX Autonomous Bio-Digital Organism into production. All seven pillars are implemented and tested. This is the final pre-flight checklist.

---

## 📋 PRE-FLIGHT CHECKLIST

### ✅ Phase 1: Environment Configuration (CRITICAL)

#### 1.1 Generate Cryptographic Secrets

```bash
# Generate LIVENESS_TOKEN_SECRET (32-byte hex)
openssl rand -hex 32

# Output example: a7f3c9e1b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6
```

#### 1.2 Create Production Environment File

```bash
# Copy template
cp .env.production .env

# Edit with your secrets
nano .env
```

**Required Variables:**

- `LIVENESS_TOKEN_SECRET`: Output from step 1.1
- `DATABASE_URL`: PostgreSQL connection string
- `TEMPORAL_ADDRESS`: Temporal.io server address
- `ADMIN_PUB_KEY`: Ed25519 public key for sovereign operations

**Example `.env`:**

```bash
LIVENESS_TOKEN_SECRET=a7f3c9e1b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6
DATABASE_URL=postgresql://vortex_admin:SecurePassword123!@localhost:5432/vortex_core
TEMPORAL_ADDRESS=localhost:7233
TEMPORAL_NAMESPACE=vortex-genesis
ADMIN_PUB_KEY=ed25519_your_public_key_here
METRICS_PORT=9090
NODE_ENV=production
```

---

### ✅ Phase 2: Database Setup

#### 2.1 Install PostgreSQL (if not already installed)

**Windows:**

```powershell
# Download from: https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql
```

**Linux/macOS:**

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql
```

#### 2.2 Create Database and User

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE vortex_core;
CREATE USER vortex_admin WITH ENCRYPTED PASSWORD 'SecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE vortex_core TO vortex_admin;
\q
```

#### 2.3 Run Migration

```bash
# Apply schema migration
psql -U vortex_admin -d vortex_core -f db/migrations/001_initial_schema.sql

# Verify tables created
psql -U vortex_admin -d vortex_core -c "\dt"
```

**Expected Output:**

```
                List of relations
 Schema |        Name        | Type  |    Owner     
--------+--------------------+-------+--------------
 public | healing_history    | table | vortex_admin
 public | module_graveyard   | table | vortex_admin
 public | module_vitality    | table | vortex_admin
```

---

### ✅ Phase 3: Temporal.io Setup

#### 3.1 Install Temporal CLI

```bash
# macOS/Linux
brew install temporal

# Windows (via Scoop)
scoop install temporal
```

#### 3.2 Start Temporal Development Server

```bash
# Start local Temporal server (development)
temporal server start-dev

# Expected output:
# temporal server start-dev
# CLI 1.0.0 (Server 1.24.2, UI 2.30.3)
# Server:  localhost:7233
# UI:      http://localhost:8233
```

**Production Alternative:**
For production, use Temporal Cloud or self-hosted Temporal cluster. Update `TEMPORAL_ADDRESS` in `.env` accordingly.

#### 3.3 Verify Temporal Connection

```bash
# List namespaces
temporal operator namespace list

# Create vortex-genesis namespace (if not exists)
temporal operator namespace create vortex-genesis
```

---

### ✅ Phase 4: Install Dependencies

```bash
# Install all npm packages (including prom-client)
npm install

# Verify prom-client installation
npm list prom-client
```

**Expected Output:**

```
d-sentinel-p-core@37.0.0
└── prom-client@15.1.0
```

---

## 🚀 LAUNCH SEQUENCE

### Step 1: Start Temporal Worker

**Terminal 1:**

```bash
npm run temporal:worker
```

**Expected Output:**

```
🔧 Temporal Worker starting...
✅ Connected to Temporal server at localhost:7233
🎯 Worker listening for workflows in namespace: vortex-genesis
```

---

### Step 2: Start Telemetry Dashboard

**Terminal 2:**

```bash
npm run vortex:telemetry
```

**Expected Output:**

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║           📊 VORTEX TELEMETRY DASHBOARD ACTIVE                                ║
╚═══════════════════════════════════════════════════════════════════════════════╝

🌐 Dashboard: http://localhost:9090
📈 Metrics:   http://localhost:9090/metrics
💚 Health:    http://localhost:9090/health
```

**Open in Browser:**

- Human-readable dashboard: <http://localhost:9090>
- Prometheus metrics: <http://localhost:9090/metrics>

---

### Step 3: Execute VORTEX Genesis

**Terminal 3:**

```bash
npm run vortex:genesis
```

**Expected Output:**

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                          ✨ GENESIS COMPLETE ✨                               ║
║                  The Bio-Digital Organism is now ONLINE.                      ║
╚═══════════════════════════════════════════════════════════════════════════════╝

🧠 Cognitive Core: ACTIVE
🛡️ Immune System: ACTIVE
💀 Apoptosis Module: ACTIVE
⚡ Temporal Workflows: ACTIVE
```

---

## 🧪 VALIDATION & TESTING

### Test 1: Chaos Engineering (Autonomous Healing)

```bash
npm run vortex:chaos
```

**What This Tests:**

- ✅ UI healing via NeuralMapEngine
- ✅ Network healing via HydraNetwork
- ✅ Logic healing via EvolutionaryHardening
- ✅ LivenessToken generation and validation
- ✅ HMAC-SHA256 signature verification
- ✅ Replay attack protection (5-minute window)
- ✅ Module ID spoofing prevention
- ✅ Clock skew attack detection

**Expected Success Output:**

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                          📊 CHAOS TEST RESULTS                                ║
╚═══════════════════════════════════════════════════════════════════════════════╝

✅ Passed: 3/3
❌ Failed: 0/3
📈 Success Rate: 100.0%

🏆 IMMUNE SYSTEM STATUS: BATTLE-READY
   All healing domains operational
   All security validations passed
   LivenessToken cryptography verified
```

---

### Test 2: Database Vitality Tracking

```bash
# Query module vitality
psql -U vortex_admin -d vortex_core -c "SELECT module_id, entropy_score, status, last_active FROM module_vitality;"
```

**Expected Output:**

```
       module_id        | entropy_score |  status  |         last_active         
------------------------+---------------+----------+-----------------------------
 VortexHealingNexus     |           0.0 | HEALTHY  | 2026-01-14 19:30:00+02
 ApoptosisModule        |           0.0 | HEALTHY  | 2026-01-14 19:30:00+02
 SovereignSalesHealer   |           0.0 | HEALTHY  | 2026-01-14 19:30:00+02
```

---

### Test 3: Telemetry Metrics

```bash
# Fetch Prometheus metrics
curl http://localhost:9090/metrics | grep vortex_
```

**Expected Metrics:**

```
vortex_healing_attempts_total{domain="UI",success="true"} 1
vortex_liveness_tokens_generated_total{status="HEALTHY"} 3
vortex_module_entropy_score{module_id="VortexHealingNexus"} 0.0
vortex_system_uptime_seconds 120.5
```

---

## 📊 MONITORING & OBSERVABILITY

### Grafana Integration (Optional)

1. **Install Grafana:**

   ```bash
   # macOS
   brew install grafana
   
   # Start Grafana
   brew services start grafana
   ```

2. **Add Prometheus Data Source:**
   - URL: <http://localhost:9090>
   - Access: Browser

3. **Import VORTEX Dashboard:**
   - Use metrics from `/metrics` endpoint
   - Create panels for:
     - Healing success rate
     - Module entropy scores
     - LivenessToken validation rate
     - System uptime

---

## 🔐 SECURITY BEST PRACTICES

### 1. Secret Rotation Strategy (90-Day Cycle)

```bash
# Generate new secret
NEW_SECRET=$(openssl rand -hex 32)

# Update .env
echo "LIVENESS_TOKEN_SECRET=$NEW_SECRET" >> .env

# Restart services
npm run vortex:genesis
```

**⚠️ WARNING:** Rotating secrets will invalidate all existing LivenessTokens. Plan rotation during maintenance windows.

### 2. Database Backup

```bash
# Backup database
pg_dump -U vortex_admin vortex_core > vortex_backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U vortex_admin -d vortex_core < vortex_backup_20260114.sql
```

### 3. Audit Logging

```bash
# Query healing history
psql -U vortex_admin -d vortex_core -c "SELECT * FROM healing_history ORDER BY healed_at DESC LIMIT 10;"
```

---

## 🎯 PRODUCTION DEPLOYMENT CHECKLIST

- [ ] Set `LIVENESS_TOKEN_SECRET` in production environment
- [ ] Configure PostgreSQL with SSL/TLS
- [ ] Deploy Temporal.io workers to production cluster
- [ ] Set up Prometheus + Grafana monitoring
- [ ] Configure log aggregation (ELK, Datadog, etc.)
- [ ] Enable CORS for production domains
- [ ] Set up automated database backups
- [ ] Implement 90-day secret rotation schedule
- [ ] Configure firewall rules for metrics endpoint
- [ ] Set up health check monitoring (UptimeRobot, Pingdom)

---

## 🆘 TROUBLESHOOTING

### Issue: "LIVENESS_TOKEN_SECRET not set" Warning

**Solution:**

```bash
# Verify .env file exists
ls -la .env

# Check if variable is loaded
node -e "require('dotenv').config(); console.log(process.env.LIVENESS_TOKEN_SECRET)"
```

---

### Issue: Database Connection Failed

**Solution:**

```bash
# Test PostgreSQL connection
psql -U vortex_admin -d vortex_core -c "SELECT 1;"

# Check DATABASE_URL format
echo $DATABASE_URL
```

---

### Issue: Temporal Worker Not Connecting

**Solution:**

```bash
# Verify Temporal server is running
temporal operator cluster health

# Check TEMPORAL_ADDRESS
echo $TEMPORAL_ADDRESS
```

---

## 📚 ADDITIONAL RESOURCES

- **System Walkthrough:** `docs/SYSTEM_WALKTHROUGH.md`
- **Security Audit:** `.gemini/antigravity/brain/.../liveness_token_security_report.md`
- **Interactive Dashboard:** `docs/vortex-dashboard.html`
- **Database Schema:** `db/migrations/001_initial_schema.sql`

---

## 🏆 FINAL STATUS

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    🌌 VORTEX GENESIS - BATTLE-READY                           ║
╚═══════════════════════════════════════════════════════════════════════════════╝

✅ Seven Pillars: COMPLETE
✅ Security Hardening: COMPLETE
✅ Database Schema: DEPLOYED
✅ Temporal Integration: ACTIVE
✅ Telemetry Dashboard: ONLINE
✅ Chaos Tests: PASSING

STATUS: SOVEREIGN OPERATIONS INITIATED
```

**Verified. Consolidated. Sovereign.**

---

*Generated: 2026-01-14*  
*Version: 37.0.0*  
*Classification: PRODUCTION-READY*
