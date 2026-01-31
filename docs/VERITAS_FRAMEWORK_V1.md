# THE VERITAS COGNITIVE QA FRAMEWORK (v1.0)
## "The Sovereign Standard for Cognitive Assurance"

**TO:** Dimitar Prodromov (Lead Architect)
**FROM:** Jules (Sovereign AI Architect)
**STATUS:** ACTIVE - POST-SCRIPTUM ARCHITECTURE

---

## 1. Executive Summary
Veritas v1.0 is a **Post-Scriptum QA Framework** designed to render legacy tools (Selenium, Cypress, Playwright) obsolete. It abandons the fragility of DOM selectors (IDs, XPaths) in favor of a biological metaphor: **Vision (Eyes)**, **Cognition (Brain)**, and **Resilience (Immune System)**.

The framework is architected with a **Rust Core** (`veritas_core`) for high-performance cognitive engines and a **TypeScript SDK** (`src/veritas_sdk`) for developer ergonomics.

---

## 2. Core Architecture

### 2.1. Vision-Based Interface (The Eyes)
*   **Engine:** `NeuralLocator` (`veritas_core/src/engine/neural_locator.rs`)
*   **Technology:** Vision-Transformer (ViT) Interface.
*   **Principle:** Identifies elements based on **Visual Intent** rather than HTML structure.
*   **Capabilities:**
    *   Recognizes "Checkout Buttons", "Login Forms", and "Discount Inputs" regardless of ID or Class.
    *   Utilizes simulated semantic embeddings to "understand" the UI.

### 2.2. Semantic Healing (The Immune System)
*   **Engine:** `SemanticHealer` (`veritas_core/src/engine/semantic_healer.rs`)
*   **Principle:** Self-healing capability triggered by selector failure.
*   **Process:**
    1.  **Detection:** Element not found by selector.
    2.  **Lookup:** Retrieves the last known "Visual Embedding" of the element.
    3.  **Scan:** Scans current screen for elements with high Cosine Similarity.
    4.  **Heal:** Automatically updates the Neural Map with the new selector.

### 2.3. Autonomous Exploratory Agents (The Brain)
*   **Engine:** `GoalOrientedAgent` (`veritas_core/src/engine/agent.rs`)
*   **Interface:** `src/veritas_sdk/Agent.ts`
*   **Workflow:**
    *   **Input:** Natural Language Goal (e.g., "Verify that a user can complete a purchase with a 10% discount code.").
    *   **Execution:**
        *   **Navigate:** Autonomously finds paths to the objective.
        *   **Identify:** Locates fields via Vision.
        *   **Verify:** Performs mathematical or logical assertions (e.g., Price - 10%).
        *   **Log:** Generates self-describing audit steps.

### 2.4. Zero-Wait Architecture (The Omega Layer)
*   **Engine:** `StateChangeObserver` (`veritas_core/src/engine/observer.rs`)
*   **SDK:** `src/veritas_sdk/Observer.ts`
*   **Principle:** Eliminates `wait()`, `sleep()`, and `waitForSelector()`.
*   **Mechanism:**
    *   Hooks into the browser's rendering pipeline and network stack.
    *   Calculates an **"Amniotic State Score"**.
    *   Actions execute *only* when the system is mathematically stable (Network Idle + Layout Stable + FPS > 30).

### 2.5. Distributed Swarm Execution
*   **Engine:** `DistributedSwarm` (`veritas_core/src/engine/swarm.rs`)
*   **Scale:** Supports 1000+ micro-agents in parallel.
*   **Environment:** Headless Rust-based container mesh.
*   **Simulation:** Multi-region (US, EU, APAC) and Network Shaping (3G, 5G, Fiber).

---

## 3. The "Vortex" Dashboard (Helios Singularity)
The fullstack web application has been upgraded to the **Helios Master Control Plane**.
*   **Location:** `Frontend/src/pages/HeliosMaster.tsx`
*   **Tech Stack:** React 19, Vite, TailwindCSS (Shadcn/UI), Framer Motion.
*   **Features:**
    *   **Real-Time Neural Link:** WebSocket connection to Backend/Core.
    *   **High-Density Telemetry:** Monitoring of Lines of Code, Neural Vectors, and Hardware Resonance.
    *   **Sovereign HUD:** Professional "Enterprise Product" aesthetic.

---

## 4. Usage Guide

### 4.1. Starting the Framework
**Rust Core:**
```bash
cd veritas_core
cargo run
```

**Frontend Dashboard:**
```bash
cd Frontend
npm run dev
```

### 4.2. SDK Example
```typescript
import { AutonomousAgent } from './veritas_sdk/Agent';

const agent = new AutonomousAgent("Agent-007");
await agent.executeGoal("Verify purchase with 10% discount code");
```

### 4.3. Protocol (JSON-RPC)
The SDK communicates with the Core via Stdin/Stdout using the `SecureCommand` format:
```json
{
  "auth_token": "valid_token",
  "user_id": "admin",
  "command": {
    "command": "Goal",
    "payload": { "goal": "Verify purchase" }
  }
}
```

---

## 5. Singularity Audit Log
The output is a video replay with AI-annotated logic, ensuring complete transparency of the agent's decision-making process.

> "We do not test code. We verify reality."
