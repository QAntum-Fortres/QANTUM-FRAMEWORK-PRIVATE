# VERITAS COGNITIVE QA FRAMEWORK (v1.0)
**"The Eyes of the Singularity"**

## Overview
The Veritas Cognitive QA Framework is a "Post-Scriptum" architecture designed to render traditional tools like Selenium, Cypress, and Playwright obsolete. It employs a **Vision-Transformer (ViT) Layer**, **Semantic Healing**, and **Goal-Oriented Autonomous Agents** to test applications based on user intent rather than DOM selectors.

---

## 1. Vision-Based Interface ("The Eyes")
Veritas does not rely on fragile DOM selectors (IDs, XPaths, Classes). Instead, it sees the screen like a human does.

- **Neural Locator Engine**: A Rust-based engine (`veritas_core`) running a Vision Transformer (ViT).
- **Function**: Analyzes screenshots in real-time.
- **Capabilities**: Identifies "Buy" buttons, "Login" forms, and "Checkout" flows based on visual intent (iconography, layout, text rendering).
- **Advantage**: immune to React/Vue component re-renders that change the DOM structure.

## 2. Semantic Healing ("The Immune System")
When the application changes, Veritas adapts.

- **Embedding Database**: Stores vector embeddings (768-dim) of every UI element encountered.
- **Recovery Logic**: If a selector like `#btn-buy` disappears, Veritas scans the current view for an element with the highest **Cosine Similarity** to the original button's embedding.
- **Result**: Tests do not flake; they heal. The framework automatically updates its internal "Neural Map".

## 3. Autonomous Exploratory Agents ("The Brain")
We have moved beyond static `.spec.ts` files.

- **Goal-Oriented**: Agents receive natural language instructions (e.g., "Verify that a user can complete a purchase with a 10% discount code").
- **Execution**:
    1.  **Decomposition**: The agent breaks the goal into sub-steps (Find Product -> Cart -> Checkout).
    2.  **Navigation**: Autonomously traverses the app.
    3.  **Assertion**: Generates its own assertions based on the observed state (e.g., verifying math).

## 4. Zero-Wait Architecture ("The Omega Layer")
Veritas eliminates `wait()`, `sleep()`, and `waitForSelector()`.

- **State-Change Observer**: A Rust-based observer that hooks into the browser's rendering engine and network stack.
- **Amniotic State**: The framework acts only when the UI is visually stable and the network is idle (Zero-Point Energy state).

## 5. Distributed Swarm Execution
- **Architecture**: Headless Rust-based container mesh.
- **Scale**: Capable of spinning up 1000+ micro-agents in parallel.
- **Simulation**: Agents operate across different regions and simulated network latencies (3G, 5G, Fiber).

## 6. Singularity Audit Log
No more "Green/Red" reports.

- **Format**: Video replay with AI-annotated logic.
- **Annotations**: "Clicked here because I recognized the payment pattern. Verified total price using OBI logic."
- **Visualization**: Real-time streaming to the **Vortex Dashboard**.

---

## Architecture

### Core (`veritas_core`)
- **Language**: Rust
- **Responsibilities**: ViT Inference, Embedding Math, High-Performance Swarm Orchestration.
- **Communication**: JSON-RPC over Stdin/Stdout.

### SDK (`veritas-sdk` / `NerveCenterServer`)
- **Language**: TypeScript
- **Responsibilities**: Agent Logic, Goal Planning, Browser Control (Playwright/Puppeteer underneath), API Exposure.
- **Integration**: `VeritasBridge` connects the Node.js runtime to the Rust Core.

### Dashboard ("Vortex Genesis")
- **Tech**: HTML5 Canvas, WebSocket.
- **Features**: Real-time Neural Map visualization, Live Swarm Telemetry, 200,000+ Node Simulation.

## Getting Started

### Prerequisites
- Rust (Cargo)
- Node.js (pnpm)

### Building the Core
```bash
cd veritas_core
cargo build
```

### Running the Nerve Center
```bash
cd NerveCenterServer
npm install
npm run start
```

### Viewing the Dashboard
Open `docs/vortex-dashboard.html` in a browser. It will automatically connect to the Nerve Center at `ws://localhost:3001`.
