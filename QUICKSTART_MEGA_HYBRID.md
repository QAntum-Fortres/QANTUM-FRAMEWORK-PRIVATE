# MEGA-HYBRID Quick Start Guide

## ⚡ Get Started in 5 Minutes

### Prerequisites
- Rust 1.92.0+ installed
- 5 minutes of your time

### Step 1: Build Everything (30 seconds)
```bash
cargo build --workspace --release
```

Expected output:
```
   Compiling lwas_core v1.0.0
   Compiling lwas_economy v1.0.0
   Compiling lwas_telemetry_reporter v1.0.0
   Compiling rust_core v0.1.0
   Compiling veritas_core v0.1.0
    Finished `release` profile [optimized]
```

✅ Build complete!

### Step 2: Test Everything (10 seconds)
```bash
cargo test --workspace
```

Expected output:
```
running 17 tests
test result: ok. 17 passed; 0 failed
```

✅ All tests passing!

### Step 3: Start Economy Server (Terminal 1)
```bash
cargo run --release -p lwas_economy --bin economy_server
```

You'll see:
```
🚀 LwaS Economy Server Starting...
📊 Real-time Equity & Profitability Calculation Engine
🌐 Server will listen on http://127.0.0.1:8891
```

✅ Economy server running!

### Step 4: Start Telemetry Server (Terminal 2)
```bash
cargo run --release -p lwas_telemetry_reporter --bin telemetry_reporter
```

You'll see:
```
👁️  LwaS Telemetry Reporter - The Eye of Sauron
📡 Real-time System & Market Monitoring
🌐 Server will listen on http://127.0.0.1:8890
🔍 Watching everything... reporting to Dashboard...
```

✅ Telemetry server running!

### Step 5: Test the APIs (Terminal 3)

**Test Economy API:**
```bash
# Health check
curl http://localhost:8891/health

# Get equity
curl http://localhost:8891/equity

# Get profitability
curl http://localhost:8891/profitability
```

**Test Telemetry API:**
```bash
# Health check
curl http://localhost:8890/health

# Get system metrics
curl http://localhost:8890/system

# Get full report
curl http://localhost:8890/report
```

✅ All APIs responding!

---

## 🎯 What You Just Launched

### 1. LwaS Economy Engine (Port 8891)
- Real-time equity tracking
- Profitability calculation
- Transaction processing
- Full HTTP API

### 2. LwaS Telemetry Reporter (Port 8890)
- System monitoring (CPU, RAM, uptime)
- Market data collection
- Anomaly detection
- Alert generation

### 3. Unified Rust Workspace
- All modules managed together
- Consistent dependencies
- Optimized builds
- Clean architecture

---

## 📚 Next Steps

1. **Read the Documentation:**
   - [MEGA_HYBRID_DOCUMENTATION.md](MEGA_HYBRID_DOCUMENTATION.md) - Complete architecture
   - [BUILD_AND_DEPLOYMENT.md](BUILD_AND_DEPLOYMENT.md) - Deployment guide
   - [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) - Status report

2. **Explore the Code:**
   - `src/rust_mojo_core/` - Compiler core
   - `src/rust_mojo_economy/` - Economy engine
   - `src/rust_mojo_telemetry/` - Telemetry system

3. **Integrate with Your System:**
   - See `src/omni_core/README.md` for Python integration
   - See `src/nerve-center/ARCHITECTURE_OF_TRUTH.md` for architecture

---

## 🚀 You're Ready!

The MEGA-HYBRID is now running. All systems operational.

**Status:** ✅ ONLINE  
**Services:** ✅ 2/2 Running  
**Tests:** ✅ 17/17 Passing  
**Documentation:** ✅ Complete  

**THE HYBRID IS BORN. IGNITION SUCCESSFUL.** 🚀👁️
