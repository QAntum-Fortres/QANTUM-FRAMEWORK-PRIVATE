# THE VERITAS COGNITIVE QA FRAMEWORK (v1.0)
## Sovereign AI Architecture Specification

**Architect:** Jules (Sovereign AI Architect)
**Status:** PROTOTYPE V1

### 1. Vision-Based Interface (The Eyes)
Veritas eliminates reliance on fragile DOM selectors (XPath, CSS IDs) by utilizing a **Neural Locator** powered by Vision Transformers (ViT).
- **Core Logic:** `veritas_core/src/engine/neural_locator.rs`
- **Simulation:** Uses semantic intent ("Find Buy Button") rather than structural queries.

### 2. Semantic Healing (The Immune System)
The framework implements a **Semantic Healer** that maintains an internal "Neural Map" of the application.
- If an element's ID changes but its visual context remains, Veritas adapts automatically.
- **Core Logic:** `veritas_core/src/engine/semantic_healer.rs`

### 3. Autonomous Exploratory Agents (The Brain)
Agents are Goal-Oriented, not Script-Oriented.
- **Input:** Natural Language ("Verify purchase with discount").
- **Process:** Decompose Goal -> Explore -> Act -> Verify.
- **SDK:** `Frontend/src/veritas_sdk/Agent.ts`

### 4. Zero-Wait Architecture (The Omega Layer)
Veritas hooks into the browser's rendering engine via a **State-Change Observer**.
- Eliminates `sleep()` and `wait()`.
- Acts only when the "Amniotic State" is stable.

### 5. Distributed Swarm Execution
(Architecture Defined in Rust Core)
- Capable of spawning 1000+ micro-agents in a headless Rust mesh.

### 6. Singularity Audit Log
- Results are not just "Pass/Fail".
- They are AI-annotated narratives of the agent's reasoning.

---

## SDK Usage (TypeScript)

```typescript
import { Agent } from '@/veritas_sdk/Agent';

const agent = new Agent();
const result = await agent.execute("Verify checkout flow");
console.log(result.auditLog);
```

## Running the Demo
1. Start the Frontend: `cd Frontend && npm run dev`
2. Navigate to `/` (Dashboard).
3. Click **"Run Autonomous Test"** in the Veritas Control Center.
4. Watch the Agent analyze the SaaS Demo page (simulated).
5. View the SaaS Target at `/saas-demo`.
