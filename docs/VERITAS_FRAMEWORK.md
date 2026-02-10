# The Veritas Cognitive QA Framework (v1.0)

**To:** Jules (Sovereign AI Architect)
**From:** Dimitar Prodromov (Lead Architect)
**Subject:** Engineering a Post-Scriptum QA Framework

## Executive Summary

The **Veritas Cognitive QA Framework** is a next-generation Quality Assurance system designed to render legacy tools like Selenium, Cypress, and Playwright obsolete. It moves beyond DOM-based selectors and static scripts, embracing **Vision-Based Intelligence**, **Semantic Healing**, **Autonomous Agents**, and **Zero-Wait Architectures**.

This framework is built on a **Rust Core** (`veritas_core`) for high-performance simulation and AI logic, and a **TypeScript SDK** (`veritas_sdk`) for seamless integration with modern web applications.

---

## Core Pillars

### 1. Vision-Based Interface (The Eyes)
*   **Concept:** The framework does not rely on the DOM tree (IDs, XPaths) as a primary source of truth. It uses a **Neural Locator** engine powered by a simulated Vision-Transformer (ViT) Layer.
*   **Implementation:** `NeuralLocator` in `veritas_core` analyzes screenshots (Base64) to identify UI elements based on visual intent (e.g., "Checkout Button", "Login Form") rather than HTML attributes.
*   **Benefit:** Resilient to frontend code refactors (e.g., changing class names or IDs) as long as the visual appearance remains consistent.

### 2. Semantic Healing (The Immune System)
*   **Concept:** When a selector fails, the system automatically attempts to find the element using **Semantic Embedding Mapping**.
*   **Implementation:** The `SemanticHealer` compares the "last known embedding" of an element with current candidates in the view. It calculates Cosine Similarity to find the best match.
*   **Benefit:** Self-repairing tests that reduce maintenance overhead.

### 3. Autonomous Exploratory Agents (The Brain)
*   **Concept:** Instead of static linear scripts, we use **Goal-Oriented Agents**. You provide a high-level goal, and the agent plans and executes the necessary steps.
*   **Implementation:** The `GoalOrientedAgent` decomposes goals (e.g., "Verify discount code") into a sequence of actions (Navigation -> Identification -> Assertion).
*   **Benefit:** Tests describe *what* to achieve, not *how* to click.

### 4. Zero-Wait Architecture (The Omega Layer)
*   **Concept:** Elimination of `wait()`, `sleep()`, and `waitForSelector()`. The framework hooks into the browser's rendering engine and network stack to determine the **Amniotic State**.
*   **Implementation:** The `StateChangeObserver` calculates a stability score (0.0 - 1.0) based on layout shifts, network pending requests, and DOM mutations.
*   **Benefit:** Execution speed is limited only by the application's actual performance, not arbitrary timeouts.

### 5. Distributed Swarm Execution
*   **Concept:** Massive parallel execution across regions.
*   **Implementation:** The `DistributedSwarm` module simulates spinning up thousands of micro-agents in a Headless Rust-based container mesh.
*   **Benefit:** Global scale load testing and verification.

---

## Architecture

### Rust Core (`veritas_core`)
The brain of the operation. Compiled to a binary, it communicates with the SDK via standard I/O (JSON-RPC).
*   **`engine/neural_locator.rs`**: Vision logic and embedding generation.
*   **`engine/semantic_healer.rs`**: Self-healing algorithms.
*   **`engine/agent.rs`**: Planning and execution state machine.
*   **`engine/observer.rs`**: Stability analysis.
*   **`engine/swarm.rs`**: Distributed orchestration.

### TypeScript SDK (`src/veritas_sdk`)
The bridge to the developer.
*   **`Bridge.ts`**: Manages the subprocess of the Rust core.
*   **`NeuralLocator.ts`**: The main client class exposing the framework's capabilities.
*   **`types.ts`**: Shared interfaces (VisionRequest, GoalResult, etc.).

---

## Usage Example

```typescript
import { NeuralLocator } from './veritas_sdk/NeuralLocator';

const veritas = new NeuralLocator();

// 1. Vision-Based Interaction
const btn = await veritas.locate(screenshot, "Checkout Button");
if (btn.found) {
    click(btn.location);
}

// 2. Goal Execution
const result = await veritas.executeGoal("Verify that a user can complete a purchase with a 10% discount code.");
console.log(result.audit_log_url);

// 3. Self-Healing
const healed = await veritas.heal("#old-btn-id", screenshot, lastEmbedding);
```

## Singularity Audit Log

Instead of simple "Pass/Fail" reports, Veritas generates a **Singularity Audit Log**. This includes:
*   **Video Replay** with AI annotations.
*   **Reasoning Traces** explaining *why* an agent clicked a specific element.
*   **Confidence Scores** for every visual identification.

---

*Engineered by Jules, Sovereign AI Architect.*
