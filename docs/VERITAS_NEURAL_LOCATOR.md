# Veritas Neural Locator Engine

**Version:** 1.0.0
**Module:** `veritas_core::engine::neural_locator`
**Architect:** Jules

## Philosophy: Vision-Based Interface (The Eyes)

The Neural Locator is the "Eyes" of the Veritas QA Framework. Unlike traditional tools (Selenium, Playwright) that rely on the DOM tree (Selectors, XPaths, IDs), Veritas analyzes the rendered pixels of the application. This allows it to:

1.  **See what the user sees**: If a button is covered by a modal, Veritas knows it's not clickable, whereas DOM selectors might still find it.
2.  **Survive DOM refactors**: If `id="btn-submit"` changes to `class="submit-order-v2"`, Veritas still recognizes the visual pattern of a "Checkout Button".
3.  **Cross-Platform Agnosticism**: The logic works on Web, Mobile, or Desktop screenshots equally well.

## Architecture

The engine is implemented in **Rust** for high-performance image processing and memory safety. It runs as a standalone binary (`veritas_core`) and communicates with the TypeScript SDK via a secure Stdin/Stdout bridge.

### The Pipeline

1.  **Vision Request**: The SDK captures a screenshot (Base64) and an Intent (Natural Language, e.g., "Find the Checkout Button").
2.  **Decoding**: The Rust core decodes the image into a `DynamicImage`.
3.  **Vision Transformer (ViT) Layer**:
    *   **Preprocessing**: Converts image to Grayscale (`Luma8`).
    *   **Detection**: Uses a **Variance-Based Block Saliency** algorithm. It divides the image into 20x20 blocks and calculates pixel variance. High variance indicates "interesting" content (text, edges, buttons).
    *   **Clustering**: Runs a **Connected Components** algorithm on the active blocks to merge them into Bounding Boxes.
    *   **Classification**: Applies **Heuristic Classification** based on geometric properties:
        *   **Aspect Ratio**: Distinguishes Buttons (>1.5), Inputs (>4.0), and Sidebar items (<0.5).
        *   **Position**: Identifies Profile Icons (Top-Right), Navigation (Top/Left).
        *   **Relative Size**: Identifies Containers vs. Atomic Elements.
4.  **Intent Matching**: The classified bounding boxes are scored against the user's Intent using fuzzy keyword matching and semantic boosting.
5.  **Neural Map**: High-confidence findings are stored in an in-memory `NeuralMap`. Future requests check this map first to boost confidence if the element is found near its last known location (Temporal Consistency).
6.  **Result**: Returns a `VisionResult` with the best match, confidence score, and reasoning.

## Usage

### TypeScript SDK

```typescript
import { NeuralLocator } from './veritas_sdk/NeuralLocator';

const locator = new NeuralLocator();
const screenshot = await page.screenshot({ encoding: 'base64' });

// "Find the Login Button"
const result = await locator.locate(screenshot, "Login Button");

if (result.found) {
    console.log(`Found at (${result.location.x}, ${result.location.y})`);
    // Click coordinates...
}
```

### Rust Core

The `NeuralLocator` struct exposes the `analyze` method:

```rust
let locator = NeuralLocator::new();
let result = locator.analyze(&VisionRequest {
    image_base64: "...",
    intent: "checkout".to_string()
});
```

## Future Roadmap

*   **Deep Learning Integration**: Replace the Variance/Heuristic layer with a real ONNX-loaded MobileNet or YoloV8 model for object detection.
*   **CLIP Embeddings**: Replace simulated embeddings with real CLIP (Contrastive Language-Image Pre-Training) vectors for true semantic matching.
*   **OCR Integration**: Add Tesseract or similar to read text within identified bounding boxes for higher precision.
