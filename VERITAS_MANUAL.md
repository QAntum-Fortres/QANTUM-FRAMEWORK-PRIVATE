# THE VERITAS COGNITIVE QA FRAMEWORK (v1.0)

> "The eyes that see what code cannot."

## 🚀 Overview
Veritas is a next-generation QA framework designed to supersede Selenium, Cypress, and Playwright. It abandons DOM-based selection (IDs, XPaths) in favor of a **Vision-Based Interface (ViT)** and **Neural Locator Engine**.

## 🧠 Core Architecture

### 1. The Neural Locator (Rust Core)
Located in `veritas_core/`, this high-performance engine:
*   **Simulates Vision-Transformer (ViT) Analysis**: Analyzes screenshots to identify UI elements based on *intent* (e.g., "Buy Button") rather than HTML structure.
*   **Semantic Healing**: If a selector fails, Veritas compares the visual embedding of the element with its "Neural Map" to find it even if the ID/Class has changed.
*   **Zero-Wait Architecture**: Designed for sub-millisecond response times using Rust's async runtime.

### 2. The Cognitive SDK (TypeScript)
Located in `src/veritas_sdk/`, this layer provides:
*   **Autonomous Agents**: Goal-oriented bots that navigate the application based on natural language instructions.
*   **Singularity Audit Log**: Generates human-readable, AI-annotated logs of actions and reasoning.

## 🛠️ Usage

### Setup & Compilation
Before running the framework, you must compile the Rust Core:

```bash
cd veritas_core
cargo build
cd ..
```

### Running the Demo
```bash
npx tsx tests/veritas_demo.ts
```

### Implementing an Agent
```typescript
import { AutonomousAgent } from './src/veritas_sdk/Agent';

const agent = new AutonomousAgent("Omega-1");
await agent.executeGoal({
    description: "Navigate to settings and change theme to Dark Mode."
});
```

## 📦 Directory Structure
*   `veritas_core/`: Rust implementation of the Neural Locator.
*   `src/veritas_sdk/`: TypeScript SDK for bridging Node.js to the Rust Core.
*   `tests/veritas_demo.ts`: Demonstration script.

## 🔮 Future Roadmap (v2.0)
*   **Distributed Swarm Execution**: Deploy 1000 micro-agents in a Kubernetes mesh.
*   **Real-Time DOM Injection**: "State-Change Observer" hooking directly into the browser rendering engine.
*   **Full Video Replay**: Generating mp4 audits with overlay annotations.

---
*Verified. Consolidated. Sovereign.*
