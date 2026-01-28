# VERITAS SDK REFERENCE (TypeScript)

The Veritas SDK allows developers to instantiate Autonomous Exploratory Agents and interact with the Rust Core.

## Installation

Ensure the `veritas_core` is built:
```bash
cd veritas_core && cargo build
```

## Quick Start

### 1. Import the SDK
```typescript
import { AutonomousAgent } from '../src/veritas_sdk/Agent';
```

### 2. Create an Agent
```typescript
const agent = new AutonomousAgent("Agent-007");
```

### 3. Execute a Goal
Give the agent a natural language goal. It will use the Neural Locator to find elements and Semantic Healing to recover from DOM changes.

```typescript
await agent.executeGoal({
    description: "Verify that a user can complete a purchase with a 10% discount code."
});
```

### 4. Cleanup
Always ensure the Rust child process is killed.
```typescript
agent.shutdown();
```

## API Reference

### `AutonomousAgent`

- **constructor(name: string)**: Initializes a new agent and spawns the Rust Core process.
- **executeGoal(goal: AgentGoal)**: Asynchronously executes a high-level goal.
- **shutdown()**: Terminates the background process.

### `VeritasBridge`

Low-level bridge to the Rust Core.

- **locate(image: string, intent: string)**: Returns `VisionResult` containing bounding box and semantic embedding.
- **heal(failed_selector: string, image: string, embedding: number[])**: Returns `HealResult` with new selector.
