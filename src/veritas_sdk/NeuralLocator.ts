import { VeritasBridge } from './Bridge.ts';
import type { VisionResult, HealResult, GoalResult, ObserverState, SwarmStatus } from './types.ts';

/**
 * The Veritas Neural Locator Engine.
 * Provides the Vision-Based Interface for the QA Framework.
 *
 * Unlike traditional locators (DOM, XPath), this engine analyzes the rendered
 * pixels of the application using a Vision-Transformer (ViT) pipeline in the Rust Core.
 */
export class NeuralLocator {
    private bridge: VeritasBridge;

    constructor(bridge?: VeritasBridge) {
        this.bridge = bridge || new VeritasBridge();
    }

    /**
     * Locates a UI element based on visual intent using the Vision-Transformer Layer.
     * @param imageBase64 The current screenshot in Base64 format.
     * @param intent The natural language description of what to find (e.g., "Checkout Button").
     */
    public async locate(imageBase64: string, intent: string): Promise<VisionResult> {
        console.log(`[NeuralLocator] Analyzing image for intent: "${intent}"`);
        // Delegates to the Rust Core binary for heavy image processing
        return this.bridge.locate(imageBase64, intent);
    }

    /**
     * Retrieves the heatmap data from a vision result.
     * @param result The result from a locate call.
     */
    public getHeatmap(result: VisionResult): number[] {
        return result.heatmap_data || [];
    }

    /**
     * Terminates the underlying bridge connection.
     */
    public disconnect() {
        this.bridge.kill();
    }
}
