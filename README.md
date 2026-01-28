# SOVEREIGN-ENGINE

The core ecosystem for the Autonomous Bio-Digital Organism.

## Structure

```
SOVEREIGN-ENGINE/
├── OmniCore.py           # [LEGACY] The Brain (Orchestrator)
├── Ledger.py             # The Truth (Blockchain)
├── dashboard.html        # Real-time visualization
├── deploy_v2.ps1         # [NEW] Automated Windows Deployment
├── .env                  # Secrets (Stripe, AI Keys)
├── AETERNAAA/            # [NEW] Cloud-Native Ecosystem (v2.0)
│   ├── lwas_core/        # [+] Rust Backend Core (Veritas/Titan Node)
│   ├── lwas_cli/         # [+] CLI Entry Point
│   ├── OmniCore/         # [THE BRAIN] Unified TypeScript Core (NerveCenter)
│   │   ├── SingularityServer.ts # Main Entry Point
│   ├── helios-ui/        # [+] React Frontend (Tauri/Desktop)
│   ├── rust_engine/      # "Titan Node" (AI Inference)
│   ├── aeterna-node/     # Custom VM & Teleport Protocol
│   ├── nerve-center/     # Autonomous Control Logic
│   │
│   │   # --- INFRASTRUCTURE ---
│   ├── workers/          # "The Hands" (Playwright Verification)
│   ├── storage/          # "The Eyes Memory" (S3)
│   ├── database/         # PostgreSQL Schema
│   └── nginx/            # Reverse Proxy Config
└── README.md             # This file
```

## Setup

1. **Rust Core**:
   ```bash
   cd AETERNAAA/lwas_core
   cargo build
   ```

2. **OmniCore (NerveCenter)**:
   ```bash
   cd AETERNAAA/OmniCore
   pnpm install
   pnpm start
   ```

3. **Verification**:
   ```bash
   node AETERNAAA/workers/verify_dashboard.cjs
   ```
