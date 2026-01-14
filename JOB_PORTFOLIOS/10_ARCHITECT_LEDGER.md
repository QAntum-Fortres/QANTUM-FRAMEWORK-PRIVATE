# 📉 PROJECT 10: THE ARCHITECT'S LEDGER

## Financial Data Analytics & Auditing System

**Role:** Data Engineer  
**Tech Stack:** Node.js Streams, CSV, SQL, Data Visualization  
**Status:** Live

---

### 📄 Executive Summary

**The Architect's Ledger** is the "Black Box" flight recorder of the trading empire. It addresses the critical need for transparency in algorithmic finance. By implementing a write-ahead logging strategy, it captures an immutable record of every decision, logic branch, and financial outcome, enabling deep post-mortem analysis and tax compliance.

---

### ⚡ Key Technical Achievements

#### 1. Streaming Writes

Utilized Node.js `WriteStreams` to handle massive datasets with minimal memory footprint, allowing the system to log millions of rows without blocking the main event loop.

#### 2. PnL Attribution

Developed an algorithm that links every "Sell" event back to its originating "Buy" event (FIFO/LIFO), automatically calculating Realized vs. Unrealized Profit for every asset.

#### 3. Anomaly Detection

Integrated statistical checks that flag outliers (e.g., flash crashes or abnormal slippage) for immediate human review.

---

### 💻 Code Snippet: The Immutable Log

```typescript
// High-Performance CSV Logging
public logTrade(trade: TradeEvent) {
    const row = `${Date.now()},${trade.pair},${trade.action},${trade.price},${trade.reason}\n`;
    
    // Append to disk immediately using OS buffers
    this.stream.write(row, (err) => {
        if (err) console.error('CRITICAL: Ledger Write Failed');
    });
}
```

---

### 📊 Data Scale

| Metric | Value |
|:---|:---|
| **Records** | 100,000+ |
| **Accuracy** | 100% |
| **Resolution** | 1ms |

---

### ⚙️ Enterprise Hardening

* **Monitoring:** Datadog Cloud Telemetry (Live Pulse Enabled)
* **Security:** SLSA Level 1 Supply-Chain Provenance
* **Deployment:** GitHub Actions Automated CI/CD

---

> *"Numbers never lie. Only human interpretation does."*
