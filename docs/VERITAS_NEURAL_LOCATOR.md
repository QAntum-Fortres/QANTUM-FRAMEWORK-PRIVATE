# Veritas Neural Locator Engine (v1.0)

## Overview

The **Neural Locator** is the "Eyes" of the Veritas Cognitive QA Framework. Unlike traditional test automation tools (Selenium, Playwright, Cypress) that rely on the Document Object Model (DOM), the Neural Locator uses a **Vision-Transformer (ViT)** approach to understand the user interface.

This architecture renders brittle selectors (IDs, XPaths, Classes) obsolete. The engine analyzes the visual intent of the screen, identifying elements based on how they *look* to a human user, not how they are coded.

## Architecture

The Neural Locator is implemented in **Rust** for high performance and runs as a standalone binary within the `veritas_core` ecosystem. It communicates with the TypeScript SDK via a secure JSON-RPC bridge over `stdin`/`stdout`.

### Core Components

1.  **Vision Request Processor**: Decodes Base64 screenshots.
2.  **ViT Simulation Layer**: In this v1.0 implementation, we simulate the inference of a Vision Transformer. In a production environment, this would load an ONNX model (e.g., specific ViT or YOLOv8 variants finetuned on UI elements).
3.  **Semantic Embedding Generator**: Produces high-dimensional vectors (768 dimensions) representing the "meaning" of the UI element, used for **Semantic Healing**.
4.  **Singularity Audit Log**: A detailed, step-by-step trace of the cognitive process, explaining *why* a decision was made.

## Interface

### VisionRequest

```rust
pub struct VisionRequest {
    pub image_base64: String, // The screenshot
    pub intent: String,       // Natural language goal (e.g. "Find Checkout Button")
}
```

### VisionResult

```rust
pub struct VisionResult {
    pub found: bool,
    pub location: Option<BoundingBox>,
    pub confidence: f32,
    pub semantic_embedding: Vec<f32>, // For healing
    pub reasoning: String,            // AI explanation
    pub audit_trail: Vec<String>,     // The Singularity Log
}
```

## Singularity Audit Log

The output is not just a pass/fail. It includes a `audit_trail` that describes the "thought process" of the agent.

**Example Log:**
1. Initialized Neural Locator v1.0
2. Successfully decoded Base64 image payload (304 bytes)
3. Image loaded into memory: 1x1
4. Invoking Vision-Transformer (ViT) Layer...
5. ViT Pattern Match: 'Commerce/Checkout' detected.
6. Identifying 'Buy' button via edge detection and OCR simulation.
7. Generated 768-dimensional semantic embedding for 'Find the Checkout Button'.

## Integration

The `NeuralLocator` class in the TypeScript SDK (`src/veritas_sdk/NeuralLocator.ts`) wraps the bridge communication, allowing agents to simply call:

```typescript
const result = await locator.locate(screenshot, "Click the login button");
```

## Future Roadmap

*   **Real Inference**: Replace the mock ViT logic with `ort` (ONNX Runtime) in Rust to run actual models.
*   **Video Analysis**: Extend `VisionRequest` to handle video streams for temporal analysis.
*   **Distributed Swarm**: Deploy the Neural Locator in a Kubernetes mesh for parallel visual validation.
