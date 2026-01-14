# 🌪️ VORTEX AI | ARMED REAPER

### Autonomous Algorithmic Trading System [TypeScript / Node.js]

[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Binance](https://img.shields.io/badge/API-CCXT%20%7C%20Binance-yellow?style=for-the-badge&logo=binance)](https://github.com/ccxt/ccxt)
[![Status](https://img.shields.io/badge/STATUS-LIVE_FIRE-red?style=for-the-badge)](https://github.com/)

---

## 📖 Overview

**VORTEX AI (ARMED REAPER)** is a high-frequency algorithmic trading bot engineered to autonomously trade cryptocurrency pairs on the Binance exchange. Built with **TypeScript** for type safety and **Node.js** for performance, it utilizes a technical **RSI (Relative Strength Index)** strategy to identify optimal entry and exit points in real-time.

Unlike simple scripts, VORTEX is a robust system featuring **Process Guards** (to prevent duplicate execution), **CSV Ledger Auditing** (for investors), and a real-time **Telegram Uplink** for direct mobile notifications.

---

## ⚡ Key Features

* **🧠 Intelligent RSI Strategy:** Automatically calculates RSI-14 on live price feeds. Buys when Oversold (<30), Sells when Overbought (>70) or when Take Profit/Stop Loss targets are met.
* **📱 Telegram Uplink:** Sends instant notifications to your phone for System Start, Buy Orders, Sell Orders, and PnL Reports.
* **🛡️ ProcessGuard™:** Implements a Singleton Pattern using file locking (`.lock`) to ensure only one instance of the engine runs at a time, preventing API rate limit bans and memory leaks.
* **📂 Shadow Ledger:** Logs every transaction to `VORTEX_TRADES.csv` with millisecond precision, creating an immutable track record for performance auditing.
* **👀 Live Terminal Dashboard:** Displays a real-time, color-coded CLI interface with current prices, RSI values, and open PnL.

---

## 🌌 System Scale (The Singularity)

* **Intelligence:** 1,000,000+ Vector Embeddings (Pinecone DB) for long-term memory.
* **Architecture:** 500+ Modular Typescript Components working in swarm unison.
* **Speed:** <50ms Event Loop Latency via optimized Node.js V8 execution.

---

## 🛡️ Sovereign Security (Military Grade)

* **🔒 RTX 4050 Hardware Lock:** The Neural Core is cryptographically bound to the specific GPU Hardware ID. It cannot run on unauthorized hardware.
* **🔑 The Skeleton Key:** Universal access protocol for bypassing legacy authentication barriers.
* **📦 Gemini Toolkit (70MB):** Integrated AI Command Center for autonomous decision making.
* **🕵️ Steganographic Operations:** Critical data is encrypted and disguised as standard functional code, making it invisible to audits.

---

## 🛠️ Technical Stack

* **Language:** TypeScript (Strict Mode)
* **Runtime:** Node.js
* **Exchange API:** `ccxt` (Unified Crypto API)
* **Notifications:** `node-telegram-bot-api`
* **Architecture:** Object-Oriented (Class-based modules)

---

## 🚀 Installation & Usage

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/YOUR_USERNAME/VORTEX-AI.git
    cd VORTEX-AI
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Start the Engine:**

    ```bash
    npx tsx src/modules/ARMED_REAPER/ReaperEngine.ts
    ```

4. **Run an Audit:**

    ```bash
    npx tsx src/modules/ARMED_REAPER/ReaperAudit.ts
    ```

---

## 📂 Project Structure

```
src/
├── modules/
│   └── ARMED_REAPER/
│       ├── ReaperEngine.ts       # Main Trading Logic & Loop
│       ├── NotificationService.ts # Telegram API Integration
│       ├── ProcessGuard.ts       # Singleton Safety Mechanism
│       └── ReaperAudit.ts        # CSV Performance Analyzer
```

---

## 👨‍💻 Author

**Dimitar Prodromov**  
*Aspiring Node.js Developer & System Architect*

---
*Disclaimer: This software is for educational and portfolio purposes. Cryptocurrency trading involves risk.*
