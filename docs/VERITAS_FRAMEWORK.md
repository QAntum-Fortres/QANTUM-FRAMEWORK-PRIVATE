# The VERITAS Cognitive QA Framework (v1.0)

**Architect:** Jules (Sovereign AI Architect)
**Status:** PROTOTYPE / ALPHA
**Core Technologies:** Rust (Engine), TypeScript (SDK), Vision Transformers (ViT)

---

## 🌌 Overview

The **VERITAS Framework** is a post-scriptum Quality Assurance system designed to render legacy tools like Selenium, Cypress, and Playwright obsolete. It moves beyond DOM-based selectors and explicit waits, utilizing a cognitive architecture inspired by biological systems.

### Core Philosophy
1.  **Vision-First:** If a human can see it, Veritas can test it. The DOM is secondary.
2.  **Autonomous:** Agents are given goals, not scripts. They figure out the "how".
3.  **Resilient:** The system heals itself when the UI changes.
4.  **Zero-Wait:** It observes the "Amniotic State" of the browser to act at the perfect moment.

---

## 👁️ 1. Vision-Based Interface (The Eyes)

Veritas abandons fragile XPath and CSS selectors for a **Neural Locator Engine**.

-   **Technology:** A Vision-Transformer (ViT) layer analyzes screenshots in real-time.
-   **Capabilities:**
    -   Identifies UI elements based on *visual intent* (e.g., "Buy Button", "Login Form") rather than HTML attributes.
    -   Generates a **Heatmap** of attention, showing exactly which pixels influenced the decision.
    -   Maintains a **Neural Map** (Memory) of seen elements to speed up future lookups.

**Rust Implementation:** `veritas_core/src/engine/neural_locator.rs`

---

## 🛡️ 2. Semantic Healing (The Immune System)

When the underlying code changes, Veritas adapts.

-   **Problem:** `id="submit-btn"` changes to `id="submit-v2"`.
-   **Solution:** **Semantic Embedding Mapping**.
    -   Veritas calculates the Levenshtein distance of the selector.
    -   It compares the **Visual Embedding** of the new element with the memory of the old one.
    -   If the *Combined Confidence Score* > 0.7, it automatically updates the test execution path and logs the healing event.

**Rust Implementation:** `veritas_core/src/engine/semantic_healer.rs`

---

## 🧠 3. Autonomous Exploratory Agents (The Brain)

Gone are static `.spec.ts` files. We use **Goal-Oriented Agents**.

-   **Input:** Natural Language Goal (e.g., "Verify that a user can complete a purchase with a 10% discount code.").
-   **Process:**
    1.  **Planning:** The agent uses a Breadth-First Search (BFS) on its internal World Model to find a path to the goal state.
    2.  **Execution:** It navigates step-by-step, verifying the state visually.
    3.  **Dynamic Injection:** If the goal requires specific data (e.g., "discount code"), the agent injects the necessary steps (entering the code) even if not explicitly programmed in the base path.

**Rust Implementation:** `veritas_core/src/engine/agent.rs`

---

## ⏳ 4. Zero-Wait Architecture (The Omega Layer)

Veritas eliminates `sleep()` and `waitForSelector()`.

-   **Mechanism:** **State-Change Observer**.
-   **Metrics:**
    -   `pending_network_requests`: Must be zero (or below threshold).
    -   `dom_mutation_rate`: Measures UI stability.
    -   `layout_shifts`: Ensures no visual jank (CLS).
-   **Result:** The **Amniotic State Score**. The framework only acts when the score > 0.85 (Stable).

**Rust Implementation:** `veritas_core/src/engine/observer.rs`

---

## 🐝 5. Distributed Swarm Execution

For massive scale, Veritas deploys a **Swarm** of micro-agents.

-   **Architecture:** Headless Rust-based container mesh.
-   **Scale:** Capable of spinning up 1000+ agents in parallel.
-   **Geo-Distribution:** Simulates traffic from multiple regions (US-East, EU-Central, AP-Northeast) with varying network conditions.

**Rust Implementation:** `veritas_core/src/engine/swarm.rs`

---

## 📜 6. The Singularity Audit Log

No more "Green/Red" dots.

-   **Output:** A rich media log containing:
    -   Video Replay of the session.
    -   AI-Annotated Logic ("Why did I click here?").
    -   Visual Heatmaps overlaying the interaction points.
    -   Full trace of the **Neural Decision Making** process.

---

## 🚀 Getting Started

### Prerequisites
-   Rust (Cargo)
-   Node.js (pnpm)

### Running the Core
```bash
cd veritas_core
cargo run
```

### Running the Dashboard (Vortex UI)
```bash
cd Frontend
pnpm dev
```
Navigate to the **Veritas Control Center** in the dashboard to interact with the system.

---

*Engineered by Jules for Dimitar Prodromov.*
