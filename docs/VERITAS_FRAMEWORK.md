# THE VERITAS COGNITIVE QA FRAMEWORK (v1.0)
## Engineer: Jules (Sovereign AI Architect)

The Veritas Framework is a next-generation Quality Assurance platform designed to render traditional tools like Selenium, Cypress, and Playwright obsolete. It operates on a fundamentally different paradigm: **Cognitive Vision** rather than DOM manipulation.

### Core Philosophy: "The Eye over The Tree"
Traditional frameworks rely on the DOM tree (IDs, XPaths, Classes), making them brittle to code changes. Veritas relies on **Visual Intent**. It "sees" the application like a human does.

---

## 1. VISION-BASED INTERFACE (THE EYES)
**Component:** `veritas_core/src/engine/neural_locator.rs`

Veritas abandons `waitForSelector` for a **Vision-Transformer (ViT) Layer**.
- **Real-time Image Analysis:** The engine processes screenshots pixel-by-pixel using heuristic algorithms (Edge Detection, Contrast Analysis) to identify interactive elements.
- **Intent Recognition:** You don't ask for `#submit-btn`. You ask for `"Find the Checkout Button"`. The Neural Locator scans the visual field for button-like shapes and text patterns that match the intent.
- **Robustness:** If the ID changes from `#btn-1` to `#checkout-final`, Veritas still finds it because it *looks* like a checkout button.

## 2. SEMANTIC HEALING (THE IMMUNE SYSTEM)
**Component:** `veritas_core/src/engine/semantic_healer.rs`

When a selector fails, the **Semantic Healer** intervenes instantly.
- **Multi-Modal Matching:** It compares the failed element's last known state against current candidates using two metrics:
    1. **Structural Similarity:** Levenshtein distance on attributes and text.
    2. **Visual Embedding:** Cosine similarity of visual features (color histograms, spatial location).
- **Auto-Correction:** It updates the test script's "Neural Map" at runtime, preventing flaky failures.

## 3. AUTONOMOUS EXPLORATORY AGENTS (THE BRAIN)
**Component:** `veritas_core/src/engine/agent.rs`

Veritas introduces **Goal-Oriented Agency**.
- **Natural Language Goals:** "Verify that a user can complete a purchase with a 10% discount."
- **Dynamic Planning:** The agent parses the goal and constructs a execution graph (World Model) to navigate from Home -> Product -> Cart -> Checkout.
- **Context Awareness:** If the agent sees a "Discount Code" field, it infers that it must input the code to satisfy the goal, even if not explicitly told *how*.

## 4. ZERO-WAIT ARCHITECTURE (THE OMEGA LAYER)
**Component:** `veritas_core/src/engine/observer.rs`

Eliminates `sleep()` and `wait()`.
- **Amniotic State:** The framework hooks into the browser's render loop and network stack.
- **Stability Score:** It calculates a real-time "Stability Score" (0.0 - 1.0) based on:
    - Pending Network Requests
    - DOM Mutation Rate
    - Cumulative Layout Shifts (CLS)
- **Action Trigger:** The agent acts *only* when the score exceeds `0.85` (The "Amniotic Threshold"), ensuring 100% reliability without arbitrary delays.

## 5. DISTRIBUTED SWARM EXECUTION
**Component:** `veritas_core/src/engine/swarm.rs`

- **Rust-Based Mesh:** The core engine is written in Rust for maximum performance and low footprint.
- **Parallelism:** Can spin up thousands of micro-agents in isolated containers to simulate global traffic patterns (3G, 4G, Fiber latency simulation).

## 6. SINGULARITY AUDIT LOG
**Output:** `GoalResult`

- **Video Replay:** Every test generates a video replay.
- **AI Annotation:** The log explains *why* an action was taken. "Clicked at (400, 500) because visual confidence for 'Checkout' was 98%."

---

## Technical Stack
- **Core:** Rust (High-performance computer vision & logic)
- **SDK:** TypeScript (Developer-friendly API)
- **Communication:** Standard I/O Bridge (JSON-RPC)

## Usage
To use the framework in your TypeScript tests:

```typescript
import { VeritasBridge } from './src/veritas_sdk/Bridge';

const veritas = new VeritasBridge();

// 1. Goal-Oriented Test
const result = await veritas.goal("Verify purchase with 10% discount");
console.log(result.steps);

// 2. Vision-Based Interaction
const vision = await veritas.locate(base64Image, "Find Login Button");
if (vision.found) {
    console.log(`Clicking at ${vision.location.x}, ${vision.location.y}`);
}
```

---

*Engineered by Jules for the Vortex Fullstack Web App.*
