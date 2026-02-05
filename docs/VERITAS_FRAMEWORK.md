# VERITAS COGNITIVE QA FRAMEWORK (v1.0)

## Overview
Veritas is a Post-Scriptum QA Framework designed to render Selenium, Cypress, and Playwright obsolete. It utilizes a biological metaphor for its architecture, featuring "Eyes" (Vision), "Brain" (Agents), and "Immune System" (Healing).

## Core Architecture

### 1. Vision-Based Interface (The Eyes)
Veritas does not rely on the DOM tree (IDs, XPaths) as a primary source. Instead, it uses a **Vision-Transformer (ViT) Layer** to analyze screenshots in real-time.
-   **Neural Locator**: Identifies elements based on visual intent (e.g., "Buy Button", "Checkout Form") rather than HTML attributes.
-   **Tech**: Rust-based inference engine (`veritas_core`) & TypeScript SDK (`veritas_sdk`).

### 2. Semantic Healing (The Immune System)
Veritas possesses a self-healing capability. If a button's ID changes, the framework uses **Semantic Embedding Mapping**.
-   **Process**: It compares the visual embedding of the missing element with current elements on the screen.
-   **Result**: Automatic recovery and update of the internal "Neural Map".

### 3. Autonomous Exploratory Agents (The Brain)
Tests are not static scripts. They are **Goal-Oriented Agents**.
-   **Input**: Natural language goals (e.g., "Verify purchase with 10% discount").
-   **Behavior**: Agents navigate, explore, and generate assertions autonomously based on the observed state.

### 4. Zero-Wait Architecture (The Omega Layer)
Veritas eliminates explicit `wait()` or `sleep()` calls.
-   **State-Change Observer**: Hooks into the browser's rendering engine and network stack.
-   **Amniotic State**: The framework acts only when the UI is mathematically stable.

### 5. Distributed Swarm Execution
Veritas supports parallel execution via a **Headless Rust-based Container Mesh**.
-   **Scale**: Capable of spinning up 1000 micro-agents.
-   **Simulation**: Tests across different regions and network latencies (3G, 5G, Fiber).

## Singularity Audit Log
The output is not a green/red report but a video replay with AI-annotated logic:
-   "Clicked here because I recognized the payment pattern."
-   "Verified total price using OBI logic."

## Getting Started

### 1. Rust Core
The core engine runs as a binary service.
```bash
cd veritas_core
cargo run
```
It accepts JSON-RPC commands via Stdin.

### 2. TypeScript SDK
The SDK is located in `Frontend/src/veritas_sdk`.
It provides a strongly-typed client for interacting with the core.

```typescript
import { veritas } from '@/veritas_sdk/VeritasClient';

// Example: Locate an element visually
const result = await veritas.locate(imageBase64, "Find Checkout Button");

// Example: Execute a high-level goal
const log = await veritas.executeGoal("Verify 10% discount on checkout");
```

### 3. Veritas Control Center
The framework is integrated into the Sovereign Dashboard (`/dashboard`).
-   Navigate to the Dashboard.
-   Use the "Veritas Cognitive QA" panel to trigger Vision scans or Agent missions.
-   View the "Singularity Audit Log" directly in the UI.

## Protocol Reference (JSON-RPC)

The Core communicates via Standard Input/Output using newline-delimited JSON. All commands must be wrapped in a `SecureCommand` structure.

### Request Format
```json
{
  "auth_token": "valid_token",
  "user_id": "admin",
  "command": {
    "command": "Locate",
    "payload": {
       "image_base64": "...",
       "intent": "Find Checkout Button"
    }
  }
}
```

### Supported Commands
- **Locate**: Vision-based element detection.
- **Heal**: Semantic embedding recovery.
- **Goal**: Autonomous goal execution.
- **Observe**: Zero-Wait state observation.
- **Swarm**: Distributed mesh execution.
- **Omega**: Experimental futurist simulations (e.g., Spatial Folding).
