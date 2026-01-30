# THE VERITAS COGNITIVE QA FRAMEWORK (v1.0)

> **Status**: ACTIVE
> **Architecture**: Sovereign / Hybrid (Rust Core + TypeScript SDK)
> **Visual Intelligence**: Neural Locator (Simulated ViT)

## 1. Executive Summary
Veritas is a post-Selenium, post-Playwright QA framework designed for the "Sovereign Engine" ecosystem. It eliminates brittle selector-based testing (IDs, XPaths) in favor of **Vision-Based Intent**.

Instead of searching for `#submit-btn`, Veritas searches for "The Checkout Button" using a Neural Locator engine that analyzes screenshots in real-time.

## 2. Core Architecture

### 2.1 The "Eye" (Neural Locator)
- **Language**: Rust
- **Location**: `veritas_core/src/engine/neural_locator.rs`
- **Function**: Receives a base64 image and a natural language intent. Returns a bounding box, confidence score, and semantic embedding.
- **Simulation**: Currently simulates Vision Transformer (ViT) logic using deterministic hashing of intents to provide stable, reproducible "visual findings" for demonstration.

### 2.2 The "Brain" (Goal-Oriented Agents)
- **Language**: TypeScript (SDK) & Rust (Engine)
- **Location**: `src/veritas_sdk/Agent.ts`
- **Function**: Implements the OODA Loop (Observe, Orient, Decide, Act).
- **Workflow**:
  1.  **Observe**: Capture application state (Mock or Real Screenshot).
  2.  **Orient**: Send visual data to Rust Core via Bridge.
  3.  **Decide**: Determine if the element matches the Goal.
  4.  **Act**: Click, Type, or Navigate.

### 2.3 The "Bridge"
- **Location**: `src/veritas_sdk/Bridge.ts`
- **Mechanism**: Spawns the compiled `veritas_core` binary as a child process. Communicates via JSON-RPC over Stdin/Stdout.

## 3. Usage Guide

### 3.1 Prerequisites
- Rust (Cargo)
- Node.js (v18+)
- Python 3.10+ (for Backend)

### 3.2 Building the Core
```bash
cd veritas_core
cargo build
```

### 3.3 Running an Agent
```typescript
import { AutonomousAgent } from './src/veritas_sdk/Agent';

const agent = new AutonomousAgent();
await agent.executeGoal({ description: "Purchase a subscription with 10% discount" });
```

### 3.4 Integration Testing
To verify the entire loop (Agent -> Bridge -> Core):
```bash
npx tsx tests/veritas_integration.ts
```

## 4. Dashboard (Helios Singularity)
The Veritas framework integrates into the **Helios Master Control Plane**.
- **URL**: `http://localhost:5173`
- **Features**:
  - **Project Card**: Displays Veritas status.
  - **System Logs**: Streams initialization and agent activity events (e.g., "Neural Locator initialized").

## 5. Deployment (Render)
Veritas is designed to run in a containerized environment.
- **Dockerfile**: `Backend/Dockerfile` (Python Backend)
- **Rust Core**: Compiled during the build phase or multi-stage Docker build.
- **Configuration**: `render.yaml` defines the services.

## 6. Future Roadmap
- **Real ViT Integration**: Replace simulation with ONNX Runtime (`ort`) loading a CLIP or TrOCR model.
- **Semantic Healing**: Implement vector database storage (Qdrant/Pinecone) to recall previous element locations if visual lookup fails.
- **Distributed Swarm**: Enable `veritas_core` to spawn multiple agent threads across regions.
