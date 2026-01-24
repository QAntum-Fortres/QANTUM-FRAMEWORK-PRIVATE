# 🧠 SOVEREIGN ENGINE

**A Cyber-Physical Operating System for Human Optimization**

[![Status](https://img.shields.io/badge/Status-PROTOTYPE-blue)]()
[![Python](https://img.shields.io/badge/Python-3.10+-green)]()
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

---

## 🎯 Overview

SOVEREIGN ENGINE is a real-time multi-vector optimization system that integrates:

| Vector | Data Source | Purpose |
|--------|-------------|---------|
| **BIO** | Heart Rate Simulation | Human stress monitoring |
| **MARKET** | Binance API (BTC/USDT) | Financial risk assessment |
| **ENERGY** | Open-Meteo API (Solar) | Physical environment control |

The system uses **Cross-Vector Logic** to create feedback loops between domains:

- Bio-stress triggers financial risk reduction
- Market crashes activate energy arbitrage
- Energy surplus optimizes human comfort

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   SOVEREIGN ENGINE                       │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ BIO GOVERNOR│  │MKT GOVERNOR │  │NRG GOVERNOR │     │
│  │  (LAZARUS)  │  │  (FINANCE)  │  │  (HELIOS)   │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│         └────────┬───────┴────────┬───────┘             │
│                  ▼                                      │
│         ┌────────────────┐                              │
│         │  ORCHESTRATOR  │ ◀── Cross-Vector Logic      │
│         └───────┬────────┘                              │
│                 ▼                                       │
│         ┌────────────────┐                              │
│         │IMMUTABLE LEDGER│ ◀── SHA-256 Blockchain      │
│         └───────┬────────┘                              │
│                 ▼                                       │
│         ┌────────────────┐                              │
│         │ WebSocket API  │ ◀── Real-time broadcast     │
│         └────────────────┘                              │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
SOVEREIGN-ENGINE/
├── OmniCore.py          # Main server (WebSocket + Orchestrator)
├── Ledger.py            # Immutable blockchain ledger (SHA-256)
├── dashboard.html       # Real-time visualization (Chart.js)
├── rust_core/           # [FUTURE] Rust FFI integration
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs
└── README.md            # This file
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```powershell
python -m pip install websockets requests
```

### 2. Start the Server

```powershell
python OmniCore.py
```

Expected output:

```
/// LEDGER INITIALIZED: GENESIS BLOCK SEALED ///
>>> OMNI-CORE WEBSOCKET SERVER STARTED ON localhost:8765 <<<
```

### 3. Open Dashboard

Double-click `dashboard.html` or run:

```powershell
start msedge dashboard.html
```

---

## 🔒 Immutable Ledger

Every system cycle is recorded in a cryptographic blockchain:

```
🔒 BLK #1 | PROOF: a3f9c2d1... | STRATEGY: MAINTAIN_BALANCE
🔒 BLK #2 | PROOF: 7b2e4f8a... | STRATEGY: EMERGENCY_SHIELD
🔒 BLK #3 | PROOF: c9d1e3f5... | STRATEGY: ACCELERATED_GROWTH
```

Each block contains:

- `bio_stress` (0.0 - 1.0)
- `market_risk` (0.0 - 1.0)
- `energy_load` (0.0 - 1.0)
- `decision` (EMERGENCY_SHIELD | ACCELERATED_GROWTH | MAINTAIN_BALANCE)
- `previous_hash` (SHA-256 chain link)

---

## 🧪 Testing

### Verify Ledger Integrity

```python
from Ledger import ImmutableLedger

ledger = ImmutableLedger()
ledger.add_entry(0.5, 0.3, 0.2)
ledger.add_entry(0.8, 0.9, 0.1)

print("Chain valid:", ledger.is_chain_valid())  # True
```

### Verify WebSocket

```python
import asyncio
import websockets

async def test():
    async with websockets.connect("ws://localhost:8765") as ws:
        msg = await ws.recv()
        print("Received:", msg)

asyncio.run(test())
```

---

## 🔮 Roadmap

- [x] Python Ledger (SHA-256)
- [x] WebSocket Server
- [x] Real-time Dashboard
- [x] Cross-Vector Orchestration
- [ ] Rust FFI Integration (Performance)
- [ ] Neuro-Focus Sensor (EEG)
- [ ] AI Pattern Discovery (GPT Analysis)

---

## 📜 License

**Proprietary** - All rights reserved.

---

*Built with 🧠 by The Architect*
