# Veritas SDK Reference

## Installation
```bash
npm install veritas-sdk
```

## Basic Usage

```typescript
import { VeritasClient } from 'veritas-sdk';

const veritas = new VeritasClient();

async function main() {
    await veritas.start();

    // 1. Vision-Based Location
    const buyBtn = await veritas.visual.locate("Buy Button");
    console.log("Found at:", buyBtn.location);

    // 2. Autonomous Agent Goal
    const result = await veritas.agent.goal("Verify checkout with coupon 'SAVE10'");
    console.log("Success:", result.success);
    console.log("Audit Log:", result.audit_log_url);

    // 3. Distributed Swarm
    const swarmStatus = await veritas.swarm.launch(1000, ["us-east-1", "eu-west-1"]);
    console.log("Active Agents:", swarmStatus.active_agents);

    await veritas.stop();
}

main();
```

## API

### `VeritasClient`
The main entry point. Spawns the Rust core process.

#### `visual.locate(intent: string)`
Uses the Neural Locator to find an element based on visual description.
- `intent`: Natural language description (e.g., "Login Button").

#### `agent.goal(goal: string)`
Deploys a Goal-Oriented Agent to achieve a high-level objective.
- `goal`: The objective description.

#### `agent.heal(failedSelector: string)`
Manually triggers the Semantic Healer for a specific selector.

#### `observer.check(url: string)`
Returns the "Amniotic State" of the page (stability, network idle).

#### `swarm.launch(count: number, regions: string[])`
Simulates a distributed load test with autonomous agents.
