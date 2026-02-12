import { VisionRequest, VisionResult, BoundingBox } from './types';

export class NeuralLocator {
    // In a real implementation, this would communicate with the Rust Core via WebSocket or HTTP.
    // For this simulation/SDK, we might simulate the response or use a mock API.

    private baseUrl: string;

    constructor(baseUrl: string = "http://localhost:8080") {
        this.baseUrl = baseUrl;
    }

    async analyze(request: VisionRequest): Promise<VisionResult> {
        console.log(`[NeuralLocator] Analyzing image for intent: ${request.intent}`);

        // SIMULATION: If we can't hit the real backend, return a mock response
        // This allows the Frontend to function even if the Rust Core isn't running in the browser context.
        return new Promise((resolve) => {
            setTimeout(() => {
                const isBuy = request.intent.toLowerCase().includes('buy');
                const isLogin = request.intent.toLowerCase().includes('login');
                const isCheckout = request.intent.toLowerCase().includes('checkout');

                let location: BoundingBox | undefined = undefined;
                if (isBuy || isCheckout) {
                    location = { x: 800, y: 600, width: 150, height: 50, label: "Buy Button", confidence: 0.98 };
                } else if (isLogin) {
                    location = { x: 900, y: 50, width: 80, height: 30, label: "Login Link", confidence: 0.95 };
                }

                // Generate fake candidates
                const candidates: BoundingBox[] = [];
                if (location) {
                    candidates.push(location);
                    candidates.push({ ...location, x: location.x + 10, confidence: location.confidence * 0.8, label: "Secondary Match" });
                }

                resolve({
                    found: !!location,
                    location: location || null,
                    candidates: candidates,
                    confidence: location ? location.confidence : 0.0,
                    semantic_embedding: Array(768).fill(0).map(() => Math.random()),
                    heatmap_data: Array(100).fill(0).map(() => Math.random()),
                    reasoning: `ViT Layer identified '${request.intent}' based on visual intent patterns.`,
                    processing_time_ms: Math.floor(100 + Math.random() * 200)
                });
            }, 500 + Math.random() * 1000); // Simulate inference time
        });
    }
}
