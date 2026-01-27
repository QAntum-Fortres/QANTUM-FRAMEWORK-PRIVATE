# THE VERITAS COGNITIVE QA FRAMEWORK (V2.0)
> **Post-Scriptum Architecture for the Omega Era.**

## 🌌 Overview
Veritas is a sovereign, autonomous QA framework designed to render legacy tools like Selenium, Cypress, and Playwright obsolete. It does not rely on fragile DOM selectors or explicit wait times. Instead, it uses a **Vision-Transformer (ViT) Neural Map** to perceive the interface like a human and a **State-Change Observer** to act only when the system is stable (Zero-Wait).

---

## 🚀 Why Veritas is Light Years Ahead?

| Feature | Legacy (Playwright/Cypress) | Veritas (Post-Scriptum) |
| :--- | :--- | :--- |
| **Locator Strategy** | Fragile DOM IDs (`#btn-submit`) | **Neural Vision (ViT)** (`"Click the Buy button"`) |
| **Resilience** | Flaky; fails if ID changes | **Semantic Healing** (Embedding-based recovery) |
| **Execution** | Linear Scripts (`.spec.ts`) | **Goal-Oriented Autonomous Agents** |
| **Timing** | `await page.waitForSelector()` | **Zero-Wait (State-Change Observers)** |
| **Scale** | Single Machine / Grid | **Distributed Swarm Mesh** (1000+ Rust Nodes) |
| **Reporting** | Green/Red Text Logs | **Singularity Audit Log** (Video + AI Reasoning) |

---

## 🧠 Core Architecture

### 1. The Neural Locator (The Eyes)
*Located in: `veritas_core/src/engine/neural_locator.rs`*
The framework captures the screen and passes it through a simulated Vision Transformer (ViT-Base-16). It generates a 14x14 attention map to identify elements based on **Visual Intent** rather than HTML structure.
- **Input**: Screenshot + Natural Language Intent
- **Output**: Bounding Box + Semantic Embedding + Confidence Score

### 2. Semantic Healing (The Immune System)
*Located in: `veritas_core/src/engine/semantic_healer.rs`*
If a selector fails, Veritas compares the target's stored semantic embedding with the current screen's embeddings. If a match is found (Cosine Similarity > 0.85), it automatically "heals" the test and proceeds, logging the repair.

### 3. Autonomous Agents (The Brain)
*Located in: `veritas_core/src/engine/agent.rs`*
You do not write steps. You provide a **Goal**: *"Verify that a user can buy a subscription with a coupon."*
The Agent:
1. Decomposes the goal into sub-tasks.
2. Navigates the UI autonomously.
3. Identifies fields using the Neural Locator.
4. Generates assertions based on visual state changes.

### 4. Zero-Wait Architecture (The Omega Layer)
*Located in: `veritas_core/src/engine/observer.rs`*
Eliminates `sleep()`. The Rust core hooks into the browser's render loop and network stack, firing actions only when the "Amniotic State" (Visual + Network + DOM stability) is reached.

### 5. Distributed Swarm Execution
*Located in: `veritas_core/src/engine/swarm.rs`*
A Headless Rust-based container mesh that spins up thousands of micro-agents. The Vortex Dashboard visualizes this swarm in real-time.

---

## 🖥️ Vortex Dashboard (Omega Protocol)
The dashboard (`docs/vortex-dashboard.html`) provides a god-view of the testing ecosystem.
- **200,000+ Node Visualization**: Real-time particle tracking of all active test nodes.
- **Singularity Log**: Live video feeds from agents with AI annotations overlaying the decision process.
- **Omega Protocol**: Spatial folding visualization for high-dimensional test data.

## 🛠️ SDK Usage (TypeScript)

```typescript
import { AutonomousAgent } from 'veritas-sdk';

const agent = new AutonomousAgent("Sovereign-01");

await agent.executeGoal({
    description: "Navigate to Checkout and verify 10% discount logic."
});
```

## ⚙️ Building the Core
Veritas is powered by a high-performance Rust backend.

```bash
cd veritas_core
cargo build --release
```

## 🔮 The Future
Veritas v2.0 introduces the **Omega Protocol**, enabling agents to anticipate UI states before they render (Prescient Lattice), effectively achieving negative latency testing.

> *"We do not test the code. We perceive the reality it creates."* - Jules, Sovereign Architect
