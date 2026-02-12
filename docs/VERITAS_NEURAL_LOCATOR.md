# Veritas Neural Locator (Vision-Based Interface)

## Overview

The Neural Locator is the "Eyes" of the Veritas Cognitive QA Framework. It replaces traditional DOM-based element selection (ID, XPath, CSS selectors) with a Vision-Transformer (ViT) based approach. This allows the framework to interact with the application based on *visual intent* rather than underlying implementation details, making it immune to DOM refactors and class name changes.

## Architecture

The Neural Locator consists of two main components:
1.  **Core Engine (Rust)**: Located in `veritas_core/src/engine/neural_locator.rs`. This component processes images, runs the inference logic (simulated for now), and returns structured vision data.
2.  **SDK Layer (TypeScript)**: Located in `src/veritas_sdk/`. This provides a high-level API for agents to interact with the core engine.

## Data Structures

### VisionRequest
The input payload sent to the Neural Locator.
```rust
struct VisionRequest {
    image_base64: String, // Screenshot in Base64
    intent: String,       // Natural language description (e.g., "Find Checkout Button")
}
```

### VisionResult
The structured output from the Neural Locator.
```rust
struct VisionResult {
    found: bool,
    location: Option<BoundingBox>,
    candidates: Vec<BoundingBox>, // All potential matches
    confidence: f32,              // 0.0 to 1.0
    semantic_embedding: Vec<f32>, // 768-dim vector for semantic healing
    heatmap_data: Vec<f32>,       // Flattened attention heatmap
    reasoning: String,            // AI explanation of the finding
    processing_time_ms: u64,      // Latency in milliseconds
}
```

### BoundingBox
```rust
struct BoundingBox {
    x: i32,
    y: i32,
    width: i32,
    height: i32,
    label: Option<String>,
    confidence: f32,
}
```

## Usage

### TypeScript SDK

```typescript
import { veritas } from '@/veritas_sdk/VeritasClient';

const result = await veritas.locate(base64Image, "Find the 'Add to Cart' button");

if (result.found && result.location) {
    console.log(`Found at (${result.location.x}, ${result.location.y}) with confidence ${result.confidence}`);
    // Click the center of the bounding box
} else {
    console.log("Element not found. Reasoning:", result.reasoning);
}
```

### Dashboard Integration

The Veritas Control Center in the dashboard visualizes the Neural Locator's output, showing:
- The identified bounding box overlay.
- The number of candidate matches.
- The processing latency.
- The reasoning behind the selection.

## Future Roadmap

1.  **Real Model Integration**: Replace the simulation logic in `neural_locator.rs` with `tract-onnx` or `ort` to run actual ViT models (e.g., CLIP or specialized UI detection models).
2.  **Heatmap Visualization**: Render the `heatmap_data` as a semi-transparent overlay on the dashboard to debug attention focus.
3.  **Semantic Healing**: Use the `semantic_embedding` vector to find the nearest match when the primary match fails or moves significantly.
