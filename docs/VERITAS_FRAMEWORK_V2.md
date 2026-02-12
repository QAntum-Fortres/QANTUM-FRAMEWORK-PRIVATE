# THE VERITAS COGNITIVE QA FRAMEWORK (v2.0)
## Sovereign Architecture Specification

### 1. Vision-Based Interface (The Eyes)
**Neural Locator Engine**
The primary interface for Veritas is not the DOM, but Visual Reality.
- **Vision-Transformer (ViT) Layer:** We utilize a custom implementation of ViT (simulated in v1, prepared for integration) to analyze screenshots.
- **Visual Intent:** Elements are identified by their *intent* (e.g., "Buy", "Checkout", "Login") rather than brittle CSS selectors.
- **Implementation:** `veritas_core/src/engine/neural_locator.rs` uses `ndarray` to manage 768-dimensional semantic embeddings of visual elements.

### 2. Semantic Healing (The Immune System)
**Self-Repairing Test Execution**
When a selector fails, Veritas does not crash. It heals.
- **Embedding Comparison:** The framework compares the `last_known_embedding` of the missing element with all candidate elements in the current view.
- **Cosine Similarity:** Using `ndarray`, we calculate the similarity score. If a candidate exceeds the threshold (0.85), the test automatically updates its internal map and proceeds.
- **Implementation:** `veritas_core/src/engine/semantic_healer.rs`.

### 3. Autonomous Exploratory Agents (The Brain)
**Goal-Oriented Execution**
Static scripts are obsolete. Veritas uses Goal-Oriented Agents.
- **Natural Language Goals:** "Verify that a user can complete a purchase with a 10% discount code."
- **Decomposition:** The Agent decomposes the goal into a plan:
    1. Navigation (Explore)
    2. Identification (Locate)
    3. Action (Interact)
    4. Assertion (Verify)
- **Implementation:** `veritas_core/src/engine/agent.rs` and `src/veritas_sdk/Agent.ts`.

### 4. Zero-Wait Architecture (The Omega Layer)
**State-Change Observation**
We eliminate `sleep()` and `wait()`.
- **Amniotic State:** The framework hooks into the rendering engine (simulated via Bridge) to act only when the UI is stable.

### 5. Distributed Swarm Execution
**Parallel Micro-Agents**
- **Rust Core:** The lightweight Rust binary (`veritas_core`) allows spinning up thousands of instances with minimal overhead.
- **Architecture:** The `VeritasBridge` allows TypeScript/Node.js to orchestrate a swarm of Rust cores.

### 6. Singularity Audit Log
**Visual & Logic Replay**
- The output is not a text log, but a rich data structure containing the video replay, reasoning steps, and semantic embeddings of the interaction.

---

### Usage

#### Rust Core
```bash
cd veritas_core
cargo build --release
```

#### TypeScript SDK
```typescript
import { AutonomousAgent } from './veritas_sdk/Agent';

const agent = new AutonomousAgent("Sovereign-1");
await agent.executeGoal({
    description: "Verify purchase with 10% discount"
});
```

#### Dashboard
The **Helios Singularity Dashboard** (`Frontend/src/pages/HeliosMaster.tsx`) now visualizes the **Veritas Cognitive Layer**, showing active agents and the Neural Map in real-time.
