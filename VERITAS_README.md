# THE VERITAS COGNITIVE QA FRAMEWORK (v1.0)

## Overview
Veritas is a post-scriptum QA framework engineered to render Selenium, Cypress, and Playwright obsolete. It utilizes a vision-based interface, semantic healing, and autonomous exploratory agents.

## Architecture

### 1. Vision-Based Interface (THE EYES)
- **Component**: `NeuralLocator` (Rust Core)
- **Description**: Uses a Vision-Transformer (ViT) Layer to analyze screenshots in real-time. It identifies elements based on visual intent, not underlying HTML.
- **Location**: `QANTUM_FRAMEWORK/veritas-core/src/neural_locator.rs`

### 2. Semantic Healing (THE IMMUNE SYSTEM)
- **Component**: `SemanticHealer` (Rust Core)
- **Description**: Uses Semantic Embedding Mapping to update the internal "Neural Map" when selectors change.
- **Location**: `QANTUM_FRAMEWORK/veritas-core/src/healing.rs`

### 3. Autonomous Exploratory Agents (THE BRAIN)
- **Component**: `GoalOrientedAgent` (TypeScript SDK)
- **Description**: Agents accept natural language goals and navigate the SaaS autonomously.
- **Location**: `QANTUM_FRAMEWORK/veritas-sdk/src/agent.ts`

### 4. Zero-Wait Architecture (THE OMEGA LAYER)
- **Component**: `StateChangeObserver` (Rust Core)
- **Description**: Hooks into the browser's rendering engine to eliminate wait().
- **Location**: `QANTUM_FRAMEWORK/veritas-core/src/observer.rs`

### 5. Distributed Swarm Execution
- **Implementation**: Rust-based micro-agents designed for parallel execution.

## Usage

### Prerequisites
- Rust (latest stable)
- Node.js (v18+)

### Running the SDK Demo
```bash
cd QANTUM_FRAMEWORK/veritas-sdk
npm install
npx ts-node examples/demo.ts
```

### Building the Core
```bash
cd QANTUM_FRAMEWORK/veritas-core
cargo build --release
```
