# THE VERITAS COGNITIVE QA FRAMEWORK (v1.0)

## Overview
The Veritas Cognitive QA Framework represents a paradigm shift from DOM-based testing (Selenium, Cypress, Playwright) to a Vision-First, Autonomous Agent architecture. It leverages a "Neural Locator" engine to identify UI elements based on visual intent, immune to underlying HTML changes ("Semantic Healing").

## Core Architecture

### 1. Vision-Based Interface (The Eyes)
*   **Neural Locator**: A Rust-based engine (`veritas_core`) that processes screenshots using simulated Vision Transformers (ViT).
*   **Independence**: Does not rely on XPath or CSS Selectors.
*   **Intent Recognition**: Identifies "Buy Button" or "Checkout" based on visual features.

### 2. Semantic Healing (The Immune System)
*   If a visual match fails, the `SemanticHealer` compares current DOM embeddings with historical success patterns.
*   Automatically updates the "Neural Map" when IDs or classes change.

### 3. Autonomous Exploratory Agents (The Brain)
*   **Goal-Oriented**: Agents accept natural language goals (e.g., "Verify discount code").
*   **Planner**: Decomposes goals into actionable steps (Navigation, Identification, Assertion).
*   **Execution**: Autonomously interacts with the application.

### 4. Zero-Wait Architecture (The Omega Layer)
*   Eliminates arbitrary `sleep()` or `wait()`.
*   **StateChangeObserver**: Hooks into the rendering engine to act only when the UI is stable ("Amniotic State").

### 5. Distributed Swarm Execution
*   Capable of spinning up micro-agents in a generic container mesh.
*   Simulates network conditions (3G, 5G).

## Usage

### Prerequisites
*   Rust (Cargo)
*   Node.js (TypeScript)

### Setup
1.  Build the Core:
    ```bash
    cd veritas_core
    cargo build
    ```
2.  Run the SDK Demo:
    ```bash
    npx ts-node tests/veritas_demo.ts
    ```

### SDK Example
```typescript
import { AutonomousAgent } from './veritas_sdk/Agent';

const agent = new AutonomousAgent();
await agent.executeGoal({
    description: "Verify that a user can complete a purchase with a 10% discount code."
});
```

## Future Roadmap
*   **Real ViT Integration**: Replace simulation with ONNX Runtime.
*   **Singularity Audit Log**: Video generation with AI annotations.
