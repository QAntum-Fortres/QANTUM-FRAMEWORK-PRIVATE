# 🚀 QAntum Quick Start Guide

> Get up and running with QAntum in 5 minutes.  
> **"Скриптът не греши никога защото е математика."**

---

## 📋 Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ or **yarn** 1.22+
- **Git** for version control
- **VS Code** (recommended IDE)

---

## ⚡ Installation

### Step 1: Clone Repository

```bash
git clone https://github.com/QAntum-Fortres/QAntum-FRAMEWORK.git
cd QAntumQATool
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build

```bash
npm run build
```

### Step 4: Verify

```bash
npm test
```

---

## 🖥️ Start Dashboard

```bash
# Start the Singularity Dashboard
node scripts/singularity-dashboard.js

# Open in browser
# http://localhost:8888
```

Dashboard Features:
- 🔍 Oracle Scanner - Security testing
- 👻 Ghost Protocol - Stealth automation
- 🔄 Self-Healing - Auto-fix selectors
- 📊 Real-time metrics

---

## 🔧 Automation First

**From now on - ONLY scripts, NEVER manual.**

```bash
# Full pipeline (recommended)
npx tsx scripts/automation.ts all

# Or individual steps:
npx tsx scripts/automation.ts docs    # Generate documentation
npx tsx scripts/automation.ts build   # Build all modules
npx tsx scripts/automation.ts test    # Run all tests
npx tsx scripts/automation.ts deploy  # Deploy
```

---

## 🔑 License Activation

### Get License Key

1. Visit https://qantum.dev
2. Create account
3. Choose tier (FREE/PRO/ENTERPRISE/SINGULARITY)
4. Copy license key

### Set Environment Variable

```bash
# Windows PowerShell
$env:QANTUM_LICENSE = "QNTM-PRO-XXXX-XXXX-XXXX-SIG"

# Linux/macOS
export QANTUM_LICENSE="QNTM-PRO-XXXX-XXXX-XXXX-SIG"
```

### Or in Code

```typescript
import { QAntumSaaSPlatform } from '@qantum/saas-platform';

const platform = new QAntumSaaSPlatform();
const access = platform.validateAccess('QNTM-PRO-XXXX-XXXX-XXXX-SIG');

if (access.valid) {
  console.log('License valid!', access.tier);
}
```

---

## 📦 Usage Examples

### Ghost Protocol V2 - Stealth Browsing

```typescript
import { GhostProtocolV2 } from '@qantum/ghost-protocol-v2';

const ghost = new GhostProtocolV2();

// Initialize stealth browser
await ghost.initialize();

// Browse without detection
const result = await ghost.browse('https://example.com', {
  stealthLevel: 'maximum',
  humanBehavior: true,
  screenshot: true
});

console.log('Detected:', result.detected); // false
console.log('Stealth Score:', result.stealthScore); // 100
```

### Predictive Audit - Security Scan

```typescript
import { PredictiveAudit } from '@qantum/predictive-audit';

const audit = new PredictiveAudit();

const report = await audit.run('https://example.com', {
  scopes: ['security', 'performance', 'quality'],
  depth: 'deep'
});

console.log('Score:', report.score);
console.log('Critical Issues:', report.findings.critical);
```

### Compliance Auto-Pilot

```typescript
import { ComplianceAutoPilot } from '@qantum/compliance-autopilot';

const compliance = new ComplianceAutoPilot();

const report = await compliance.check({
  frameworks: ['GDPR', 'SOC2', 'ISO27001'],
  scope: 'full'
});

console.log('GDPR:', report.GDPR.status); // compliant
console.log('SOC2:', report.SOC2.status); // compliant
```

### SaaS Platform - License Validation

```typescript
import { QAntumSaaSPlatform, SUBSCRIPTION_TIERS } from '@qantum/saas-platform';

const saas = new QAntumSaaSPlatform();

// Check pricing
console.log(SUBSCRIPTION_TIERS);
// { FREE: $0, PRO: $49, ENTERPRISE: $299, SINGULARITY: $999 }

// Register new user
const license = await saas.register({
  email: 'user@company.com',
  company: 'ACME Corp',
  tier: 'PRO'
});

console.log('License:', license.key);
```

### Edge Computing - Global Distribution

```typescript
import { EdgeOrchestrator, EDGE_NETWORK } from '@qantum/edge-computing';

const edge = new EdgeOrchestrator();

// Check network status
const status = await edge.getNetworkStatus();
console.log('Nodes:', status.healthy, '/', status.total);

// Distribute task globally
await edge.distribute({
  task: 'test-execution',
  regions: ['us-east-1', 'eu-west-1', 'ap-northeast-1']
});
```

---

## 📁 Project Structure

```
QAntumQATool/
├── src/                    # Source code
│   ├── ghost-protocol-v2/  # Stealth automation
│   ├── doc-generator/      # Auto documentation
│   ├── predictive-audit/   # Security auditing
│   ├── compliance-autopilot/
│   ├── saas-platform/      # Licensing
│   ├── sales-demo/         # Demo engine
│   ├── edge-computing/     # Distributed execution
│   ├── ai-negotiation/     # Multi-agent
│   ├── transcendence/      # Chrome/Electron
│   └── eternal-legacy/     # Knowledge preservation
│
├── scripts/
│   ├── automation.ts       # 🔧 Master automation
│   └── singularity-dashboard.js
│
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md
│   ├── API-REFERENCE.md
│   ├── CHANGELOG.md
│   └── QUICK-START.md      # This file
│
└── tests/                  # Test suites
```

---

## 🎯 Next Steps

1. **Read Documentation**
   - [API Reference](./API-REFERENCE.md)
   - [Architecture](./ARCHITECTURE.md)
   - [Changelog](./CHANGELOG.md)

2. **Run Demos**
   ```bash
   npx tsx src/ghost-protocol-v2/demo.ts
   npx tsx src/saas-platform/demo.ts
   npx tsx src/edge-computing/demo.ts
   ```

3. **Explore Dashboard**
   - Open http://localhost:8888
   - Try Oracle Scanner
   - Test Ghost Protocol

4. **Join Community**
   - Discord: discord.gg/qantum
   - GitHub: github.com/QAntum-Fortres/QAntum-FRAMEWORK

---

## ❓ Troubleshooting

### "Module not found" Error

```bash
npm install
npm run build
```

### "License invalid" Error

Check environment variable:
```bash
echo $env:QANTUM_LICENSE
```

### Dashboard won't start

Check port 8888 is available:
```bash
netstat -an | findstr 8888
```

---

## 📞 Support

| Tier | Support Channel | Response Time |
|------|-----------------|---------------|
| FREE | Community Forum | Best effort |
| PRO | Email | 24 hours |
| ENTERPRISE | Dedicated | 4 hours |
| SINGULARITY | Priority | 1 hour |

---

**"В QAntum не лъжем. Само истински стойности."**

© 2025 Dimitar Prodromov. All rights reserved.
